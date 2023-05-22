import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {
	createStaticHandler,
	createStaticRouter,
	StaticHandlerContext,
	StaticRouterProvider,
} from 'react-router-dom/server';

import { routes } from '../components/app/routes';

export const handler = createStaticHandler(routes);

export async function createRouterContext(req: Request) {
	const contextOrResponse = await handler.query(req);
	if (contextOrResponse instanceof Response) {
		return { kind: 'response' as const, response: contextOrResponse };
	}
	return { kind: 'context' as const, context: contextOrResponse };
}

export function ServerRouter({ getContext }: { getContext?: () => StaticHandlerContext }) {
	if (!getContext) {
		throw new Error(
			`getContext is required for ServerRouter. Please use "createRouterContext" to create SSR context, or you can switch to "client:only="react" if you don't want to implement SSR.`
		);
	}
	const context = getContext();
	const router = createStaticRouter(routes, context);
	return <StaticRouterProvider router={router} context={context} />;
}

export function BrowserRouter() {
	const router = useState(() => {
		return createBrowserRouter(routes);
	})[0];
	// https://reactrouter.com/en/main/guides/ssr#lazy-routes
	// let lazyMatches = matchRoutes(routes, window.location)?.filter((m) => m.route.lazy);
	// console.log(lazyMatches);
	// if (lazyMatches && lazyMatches?.length > 0) {
	// 	await Promise.all(
	// 		lazyMatches.map(async (m) => {
	// 			let routeModule = await m.route.lazy();
	// 			Object.assign(m.route, {
	// 				...routeModule,
	// 				lazy: undefined,
	// 			});
	// 		})
	// 	);
	// }
	return <RouterProvider router={router} />;
}
