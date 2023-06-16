import type { AstroGlobal } from 'astro';
import { createStaticHandler } from 'react-router-dom/server';

import { RemixContext, routes } from '../components/app/routes';
import { createHelpers } from './trpc/root';

export const handler = createStaticHandler(routes);

export async function createRouterContext(astro: AstroGlobal) {
	const helpers = createHelpers(astro);
	// Astro doesn't have trailing slash in dev, but has it prod :(
	const newUrl = astro.request.url.replace(/\/$/, '') || '/';
	const newReq = new Request(newUrl, astro.request);
	const contextOrResponse = await handler.query(newReq, {
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
