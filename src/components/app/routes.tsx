import { Outlet, RouteObject } from 'react-router-dom';

import { env } from '../../config';
import { AuthSync } from '../AuthSync';
import { FullPageSupport } from '../fogbender/Support';
import { AuthProvider } from '../propelauth';
import { App } from './App';
import { AppNav } from './Nav';
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
