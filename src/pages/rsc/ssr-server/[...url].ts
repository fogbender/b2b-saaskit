import type { APIRoute } from 'astro';
import { renderToString } from 'react-dom/server';

import clientJs from '../_client.js?raw';

export const prerender = false;

// server/rsc.js
const prefixUrl = '/rsc/ssr-server/';

// you might consider using `astro-robots-txt` instead of this file
export const get: APIRoute = async ({ request }) => {
	try {
		const originalUrl = new URL(request.url);
		const removePrefix = '/rsc/rsc-server';
		const length = removePrefix.length;
		const pathname = originalUrl.pathname.slice(length) || '/';
		const url = new URL(originalUrl);
		url.pathname = pathname;
		const search = new URLSearchParams({ url: pathname });
		if (url.pathname === '/client.js') {
			const content = clientJs;
			return new Response(content, { headers: { 'content-type': 'application/javascript' } });
		}
		const response = await fetch('http://localhost:3000/rsc/rsc-server/?' + search);
		if (!response.ok) {
			return new Response(null, { status: response.status });
		}
		const clientJSXString = await response.text();
		if (url.searchParams.has('jsx')) {
			return new Response(clientJSXString, { headers: { 'content-type': 'application/json' } });
		} else {
			const clientJSX = JSON.parse(clientJSXString, parseJSX);
			let html = renderToString(clientJSX);
			html += `<script>window.__INITIAL_CLIENT_JSX_STRING__ = `;
			html += JSON.stringify(clientJSXString).replace(/</g, '\\u003c');
			html += `</script>`;
			html += `
				<script type="importmap">
				{
					"imports": {
					"react": "https://esm.sh/react@canary",
					"react-dom/client": "https://esm.sh/react-dom@canary/client"
					}
				}
				</script>
				<script type="module" src="${prefixUrl}client.js"></script>
			`;
			return new Response(html, { headers: { 'content-type': 'text/html' } });
		}
	} catch (err) {
		console.error(err);
		const status =
			err && typeof err === 'object' && 'statusCode' in err ? Number(err.statusCode) : null;
		return new Response(null, { status: status || 500 });
	}
};

function parseJSX(_key: string, value: string) {
	if (value === '$RE') {
		// This is our special marker we added on the server.
		// Restore the Symbol to tell React that this is valid JSX.
		return Symbol.for('react.element');
	} else if (typeof value === 'string' && value.startsWith('$$')) {
		// This is a string starting with $. Remove the extra $ added by the server.
		return value.slice(1);
	} else {
		return value;
	}
}
