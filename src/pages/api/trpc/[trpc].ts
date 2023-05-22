import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { APIRoute } from 'astro';

import { appRouter } from '../../../lib/trpc/root';

export const prerender = false;

// The Astro API route, handling all incoming HTTP requests.
export const all: APIRoute = ({ request }) => {
	return fetchRequestHandler({
		endpoint: '/api/trpc',
		req: request,
		router: appRouter,
		createContext: ({ req, resHeaders }) => {
			return { req, resHeaders };
		},
		onError({ error }) {
			if (import.meta.env.DEV && error.code === 'INTERNAL_SERVER_ERROR') {
				throw new Error(error as unknown as string);
			}
		},
	});
};
