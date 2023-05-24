import { Outlet, RouteObject } from 'react-router-dom';

import { env } from '../../config';
import { AuthSync } from '../AuthSync';
import { FullPageSupport, SupportWidget } from '../fogbender/Support';
import { AuthProvider } from '../propelauth';
import { App } from './App';
import { CreatePrompt } from './CreatePrompt';
import { EditPrompt } from './EditPrompt';
import { AppNav } from './Nav';
import { Prompt } from './Prompt';
import { Prompts } from './Prompts';
import { Settings } from './Settings';

export const routes: RouteObject[] = [
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
