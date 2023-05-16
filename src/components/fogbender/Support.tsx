import {
	FogbenderWidget,
	FogbenderSimpleFloatie,
	FogbenderProvider,
	FogbenderConfig,
	FogbenderIsConfigured,
	FogbenderHeadlessWidget,
	FogbenderUnreadBadge,
} from 'fogbender-react';
import { AuthProvider } from '../propelauth';
import { TRPCProvider } from '../trpc';
import { AuthSync } from '../AuthSync';
import { useMemo } from 'react';
import type { OrgMemberInfo } from '@propelauth/react';
import type { UseAuthInfoLoggedInProps } from '@propelauth/react/types/useAuthInfo';
import { apiServer, queryKeys, useQuery } from '../client';
import type { FogbenderTokenResponse } from '../../types/types';
import { env } from '../../config';
import { useActiveOrg, useAuthInfo } from '../propelauth';
import { AppNav } from '../app/Nav';

export const FullPageSupport = ({ path }: { path: string }) => {
	return (
		<TRPCProvider>
			<AuthProvider authUrl={env.PUBLIC_AUTH_URL}>
				<AuthSync />
				<AppNav path={path} />
				<div className="relative mt-2 border-gray-300">
					<SupportWidget kind="widget" />
				</div>
			</AuthProvider>
		</TRPCProvider>
	);
};

export const SupportWidget = ({ kind }: { kind: 'widget' | 'floatie' | 'badge' }) => {
	const activeOrg = useActiveOrg();
	const auth = useAuthInfo();
	const widgetId = env.PUBLIC_FOGBENDER_WIDGET_ID;

	if (!widgetId) {
		if (kind !== 'widget') {
			return null;
		}
		return (
			<div className="container mt-8 mx-auto">
				<h3 className="text-2xl font-bold">Prompts with Friends / Support</h3>
				<div className="mt-4 px-4 sm:px-6 lg:px-8 border border-gray-300 rounded-md py-8">
					<p className="prose">
						Hi! This section is only available if you have set up your{' '}
						<code>PUBLIC_FOGBENDER_WIDGET_ID</code> and <code>FOGBENDER_SECRET</code>.
					</p>
					<a href="/setup" className="text-blue-600 hover:text-blue-800 hover:underline">
						Set up your Fogbender widget
					</a>
				</div>
			</div>
		);
	}

	if (auth.loading === false && auth.user && activeOrg) {
		return (
			<Internal
				auth={auth}
				activeOrg={activeOrg}
				widgetId={widgetId}
				isFloatie={kind === 'floatie'}
				isHeadless={kind === 'badge'}
			/>
		);
	}
	return null;
};

export const Internal = ({
	auth,
	activeOrg,
	widgetId,
	isFloatie,
	isHeadless,
}: {
	auth: UseAuthInfoLoggedInProps;
	activeOrg: OrgMemberInfo;
	widgetId: string;
	isFloatie: boolean;
	isHeadless: boolean;
}) => {
	const fogbenderQuery = useQuery({
		queryKey: queryKeys.fogbender(auth.user.userId, activeOrg.orgId),
		queryFn: () =>
			apiServer
				.url('/api/fogbender')
				.auth('Bearer ' + auth.accessToken)
				.json({ orgId: activeOrg.orgId })
				.post()
				.unauthorized((e) => {
					console.error('Failed to get userJWT for fogbender widget', e);
					return { userJWT: undefined };
				})
				.json<FogbenderTokenResponse>(),
		staleTime: Infinity,
	});
	const userJWT = fogbenderQuery.data?.userJWT;
	// token is undefined until we got the userJWT from out backend (because it needs to be signed with fogbender secret)
	const token = useMemo(() => {
		if (!userJWT) {
			return;
		}
		return {
			widgetId,
			customerId: activeOrg.orgId,
			customerName: activeOrg.orgName,
			userId: auth.user.userId,
			userEmail: auth.user.email,
			userName: auth.user.email, // Don’t know the name? Reuse email here
			userAvatarUrl: auth.user.pictureUrl,
			userJWT,
		};
	}, [auth.user, activeOrg, fogbenderQuery.data?.userJWT]);

	return (
		<>
			{token && isFloatie ? (
				<FogbenderSimpleFloatie token={token} />
			) : (
				<FogbenderProvider>
					<FogbenderConfig token={token} />
					<FogbenderIsConfigured>
						{isHeadless ? (
							<>
								<FogbenderHeadlessWidget />
								<FogbenderUnreadBadge />
							</>
						) : (
							<FogbenderWidget />
						)}
					</FogbenderIsConfigured>
				</FogbenderProvider>
			)}
		</>
	);
};
