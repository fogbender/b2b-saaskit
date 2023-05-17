import { useActiveOrg, useAuthInfo } from './propelauth';
import { useMemo, useEffect } from 'react';
import { trpc } from './trpc';
import cookie from 'js-cookie';
import { AUTH_COOKIE_NAME } from '../constants';
import { parseJwt } from './jwt';

export function AuthSync() {
	// refresh_token is stored in secure cookie, so the only way to get access_token is to wait for propel auth to get new access_token from their backend
	const auth = useAuthInfo();
	const orgId = useActiveOrg()?.orgId || '';
	const authMutation = trpc.auth.authSync.useMutation();
	const params = useMemo(() => {
		if (auth.loading === false) {
			return {
				isLoggedIn: auth.isLoggedIn,
				accessToken: auth.accessToken || undefined,
				userId: auth.user?.userId,
				orgId,
			};
		}
		return { isLoggedIn: undefined, accessToken: undefined, userId: undefined };
	}, [auth, orgId]);

	useEffect(() => {
		if (params.isLoggedIn === false && cookie.get(AUTH_COOKIE_NAME)) {
			// logout user from backend if user is logged out from propel auth
			authMutation.mutate(params);
			return;
		}
		if (params.isLoggedIn) {
			// store new cookie to backend if new access_token is much fresher than the one in backend or userId doesn't match
			const cookieValues = new URLSearchParams(cookie.get(AUTH_COOKIE_NAME) || '');
			const userIdFromCookie = cookieValues.get('userId');
			const orgIdFromCookie = cookieValues.get('orgId');
			const jwtValues = parseJwt(params.accessToken || '') as {
				exp: number;
			};
			if (params.userId !== userIdFromCookie || orgIdFromCookie !== orgId) {
				authMutation.mutate(params);
				return;
			}
			const expFromCookie = cookieValues.get('exp');
			const expFromCookieNumber = Number(expFromCookie) || 0;
			console.log('expFromCookieNumber', jwtValues.exp - expFromCookieNumber);
			// expires in 30 minutes, but refresh 25 minutes earlier
			if (jwtValues.exp - expFromCookieNumber > 5 * 60) {
				authMutation.mutate(params);
				return;
			}
		}
	}, [params.isLoggedIn, params.accessToken]);
	return null;
}
