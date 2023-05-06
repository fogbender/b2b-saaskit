import { initTRPC } from '@trpc/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { APIRoute } from 'astro';

const t = initTRPC.create();

const router = t.router({
	hello: t.procedure.query(() => {
		return 'Something from the server';
	}),
});

// The Astro API route, handling all incoming HTTP requests.
export const all: APIRoute = ({ request }) => {
	return fetchRequestHandler({
		endpoint: '/api/trpc',
		req: request,
		router: router,
		createContext: async ({ req }) => {
			return {
				req,
			};
		},
		onError({ error }) {
			if (import.meta.env.DEV && error.code === 'INTERNAL_SERVER_ERROR') {
				throw new Error(error as unknown as string);
			}
		},
	});
};
export type AppRouter = typeof router;
