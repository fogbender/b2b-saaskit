import { createStaticHandler } from 'react-router-dom/server';

import { routes } from '../components/app/routes';

export const handler = createStaticHandler(routes);

export async function createRouterContext(req: Request) {
	const contextOrResponse = await handler.query(req);
	if (contextOrResponse instanceof Response) {
		return { kind: 'response' as const, response: contextOrResponse };
	}
	return { kind: 'context' as const, context: contextOrResponse };
}
