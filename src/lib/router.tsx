import type { AstroGlobal } from 'astro';
import { createStaticHandler } from 'react-router-dom/server';

import { RemixContext, routes } from '../components/app/routes';
import { createHelpers } from './trpc/root';

export const handler = createStaticHandler(routes);

export async function createRouterContext(astro: AstroGlobal) {
	const helpers = createHelpers(astro);
	const contextOrResponse = await handler.query(astro.request, {
		requestContext: {
			helpers,
		} satisfies RemixContext,
	});
	if (contextOrResponse instanceof Response) {
		return { kind: 'response' as const, response: contextOrResponse, helpers };
	}
	return {
		kind: 'context' as const,
		context: contextOrResponse,
		helpers,
	};
}
