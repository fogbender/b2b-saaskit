import type { APIRoute } from 'astro';

import { Router } from './_router';

export const prerender = false;

// server/rsc.js

// you might consider using `astro-robots-txt` instead of this file
export const get: APIRoute = async ({ request }) => {
	try {
		const url = new URL(new URL(request.url).searchParams.get('url') || '/', request.url);
		console.log(url.toString());
		return sendJSX(Router({ url }));
	} catch (err) {
		console.error(err);
		const status =
			err && typeof err === 'object' && 'statusCode' in err ? Number(err.statusCode) : null;
		return new Response(null, { status: status || 500 });
	}
};

async function sendJSX(jsx: ReturnType<typeof Router>) {
	const clientJSX = await renderJSXToClientJSX(jsx);
	const clientJSXString = JSON.stringify(clientJSX, stringifyJSX);
	return new Response(clientJSXString, { headers: { 'content-type': 'application/json' } });
}

async function renderJSXToClientJSX(jsx: ReturnType<typeof Router>): Promise<object> {
	if (
		typeof jsx === 'string' ||
		typeof jsx === 'number' ||
		typeof jsx === 'boolean' ||
		jsx == null
	) {
		// Don't need to do anything special with these types.
		return jsx;
	} else if (Array.isArray(jsx)) {
		// Process each item in an array.
		return Promise.all(jsx.map((child) => renderJSXToClientJSX(child)));
	} else if (jsx != null && typeof jsx === 'object') {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		if (jsx.$$typeof === Symbol.for('react.element')) {
			if (typeof jsx.type === 'string') {
				// This is a component like <div />.
				// Go over its props to make sure they can be turned into JSON.
				return {
					...jsx,
					props: await renderJSXToClientJSX(jsx.props),
				};
			} else if (typeof jsx.type === 'function') {
				// This is a custom React component (like <Footer />).
				// Call its function, and repeat the procedure for the JSX it returns.
				const Component = jsx.type;
				const props = jsx.props;
				const returnedJsx = await Component(props);
				return renderJSXToClientJSX(returnedJsx);
			} else throw new Error('Not implemented.');
		} else {
			// This is an arbitrary object (for example, props, or something inside of them).
			// Go over every value inside, and process it too in case there's some JSX in it.
			return Object.fromEntries(
				await Promise.all(
					Object.entries(jsx).map(async ([propName, value]) => [
						propName,
						await renderJSXToClientJSX(value),
					])
				)
			);
		}
	} else throw new Error('Not implemented');
}

function stringifyJSX(_key: string, value: unknown) {
	if (value === Symbol.for('react.element')) {
		// We can't pass a symbol, so pass our magic string instead.
		return '$RE'; // Could be arbitrary. I picked RE for React Element.
	} else if (typeof value === 'string' && value.startsWith('$')) {
		// To avoid clashes, prepend an extra $ to any string already starting with $.
		return '$' + value;
	} else {
		return value;
	}
}
