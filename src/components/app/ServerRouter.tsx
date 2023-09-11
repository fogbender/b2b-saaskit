import {
	createStaticRouter,
	type StaticHandlerContext,
	StaticRouterProvider,
} from 'react-router-dom/server';

import { routes } from './routes';

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
