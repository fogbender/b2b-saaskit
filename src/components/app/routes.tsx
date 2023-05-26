import type { QueryClient } from '@tanstack/react-query';
import { Outlet, RouteObject } from 'react-router-dom';

import { env } from '../../config';
import type { Helpers } from '../../lib/trpc/root';
import { AuthSync } from '../AuthSync';
import { FullPageSupport, SupportWidget } from '../fogbender/Support';
import { AuthProvider } from '../propelauth';
import type { RouterUtils } from '../trpc';
import { App } from './App';
import { CreatePrompt } from './CreatePrompt';
import { EditPrompt } from './EditPrompt';
import { AppNav } from './Nav';
import { Prompt } from './Prompt';
import { Prompts } from './Prompts';
import { Settings } from './Settings';

export const routes: RemixBrowserContext & RouteObject[] = [
	{
		path: '/app',
		Component() {
			return (
				<AuthProvider authUrl={env.PUBLIC_AUTH_URL}>
					<AuthSync />
					<AppNav />
					<Outlet />
					<SupportWidget kind="floatie" />
				</AuthProvider>
			);
		},
		children: [
			{
				index: true,
				Component() {
					return <App />;
				},
			},
			{
				path: '/app/prompts',
				loader: async ({ context }) => {
					// pre-fetch in SSR
					await context?.helpers.prompts.getPrompts.prefetch({});
					// pre-fetch in browser
					await routes.trpcUtils?.prompts.getPrompts.ensureData({});
					return null;
				},
				Component() {
					return <Prompts />;
				},
			},
			{
				path: '/app/prompts/:promptId',
				Component() {
					return <Prompt />;
				},
			},
			{
				path: '/app/prompts/:promptId/edit',
				Component() {
					return <EditPrompt />;
				},
			},
			{
				path: '/app/prompts/create',
				Component() {
					return <CreatePrompt />;
				},
			},
			{
				path: '/app/settings',
				Component() {
					return <Settings />;
				},
			},
			{
				path: '/app/support',
				Component() {
					return <FullPageSupport />;
				},
			},
		],
	},
];

// browser-only context
export type RemixBrowserContext = {
	trpcUtils?: RouterUtils;
	queryClient?: QueryClient;
};

// server only context
export type RemixContext = {
	helpers: Helpers;
};

declare module 'react-router-dom' {
	interface LoaderFunctionArgs {
		context?: RemixContext;
	}

	interface ActionFunctionArgs {
		context?: RemixContext;
	}
}
