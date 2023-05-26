import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { trpc } from '../trpc';
import { routes } from './routes';

export function BrowserRouter() {
	const queryClient = useQueryClient();
	const trpcUtils = trpc.useContext();
	const router = useState(() => {
		routes.queryClient = queryClient;
		routes.trpcUtils = trpcUtils;
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
