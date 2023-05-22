import type { DehydratedState } from '@tanstack/react-query';
import type { StaticHandlerContext } from 'react-router-dom/server';

import { BrowserRouter, ServerRouter } from '../../lib/router';
import { TRPCProvider } from '../trpc';

export function Root(props: {
	dehydratedState?: DehydratedState;
	getContext?: () => StaticHandlerContext;
}) {
	if (import.meta.env.SSR) {
		return (
			<TRPCProvider dehydratedState={props.dehydratedState}>
				<ServerRouter {...props} />
			</TRPCProvider>
		);
	} else {
		return (
			<TRPCProvider dehydratedState={props.dehydratedState}>
				<BrowserRouter />
			</TRPCProvider>
		);
	}
}
