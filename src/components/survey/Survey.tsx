import { StrictMode, useState } from 'react';
import {
	StaticRouterProvider,
	createStaticRouter,
	StaticHandlerContext,
} from 'react-router-dom/server';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

export const routes = () => [
	{
		path: '/survey',
		element: <div>Hello world!</div>,
	},
	{
		path: '/survey/someht',
		element: <div>Hello world!</div>,
	},
	{
		path: '/survey/someht2',
		element: <div>Hello world!</div>,
	},
	{
		path: '/survey/someht3',
		element: <div>Hello world!</div>,
	},
];

export function Survey({ context }: { context?: StaticHandlerContext }) {
	if (import.meta.env.SSR && context) {
		const router = createStaticRouter(routes(), context);
		return <StaticRouterProvider router={router} context={context} />;
	}
	const router = useState(() => {
		return createBrowserRouter(routes());
	})[0];
	return (
		<StrictMode>
			<RouterProvider router={router} />
		</StrictMode>
	);
}
