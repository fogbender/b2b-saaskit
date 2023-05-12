import { FogbenderSimpleFloatie } from 'fogbender-react';
import { useMemo } from 'react';
import type { OrgMemberInfo } from '@propelauth/react';
import type { UseAuthInfoLoggedInProps } from '@propelauth/react/types/useAuthInfo';
import { apiServer, queryKeys, useQuery } from '../client';
import type { FogbenderTokenResponse } from '../../types/types';
import { env } from '../../config';
import { useActiveOrg, useAuthInfo } from '../propelauth';

export const SupportWidget = () => {
	const activeOrg = useActiveOrg();
	const auth = useAuthInfo();
	const widgetId = env.PUBLIC_FOGBENDER_WIDGET_ID;

	if (widgetId && auth.loading === false && auth.user && activeOrg) {
		return <Internal auth={auth} activeOrg={activeOrg} widgetId={widgetId} />;
	}
	return null;
};

export const Internal = ({
	auth,
	activeOrg,
	widgetId,
}: {
	auth: UseAuthInfoLoggedInProps;
	activeOrg: OrgMemberInfo;
	widgetId: string;
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

	return <>{token && <FogbenderSimpleFloatie token={token} />}</>;
};
