import type { APIRoute } from 'astro';

import { createCaller } from '../../../lib/trpc/root';

export const prerender = false; // to allow dynamic title per user

export const all: APIRoute = async ({ request }) => {
	const responseHeaders = new Headers();
	responseHeaders.set('content-type', 'application/json');
	const callerExample = await createCaller({
		req: request,
		resHeaders: responseHeaders,
	}).hello.hello();
	const title = `Create Caller / ${callerExample}`;
	return new Response(
		JSON.stringify({
			what: 'I can even use tRPC from API endpoints, maybe in case you need to have some third-party public API',
			title,
		}),
		{
			headers: responseHeaders,
		}
	);
};
