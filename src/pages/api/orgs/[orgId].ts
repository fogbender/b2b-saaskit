import { handleError, initBaseAuth, UserMetadata } from '@propelauth/node';
import type { APIRoute } from 'astro';

import { serverEnv } from '../../../t3-env';

export const prerender = false;

export const get: APIRoute = async ({ params, request }) => {
	const propelauth = initBaseAuth({
		authUrl: serverEnv.PUBLIC_AUTH_URL,
		apiKey: serverEnv.PROPELAUTH_API_KEY,
		manualTokenVerificationMetadata: {
			verifierKey: serverEnv.PROPELAUTH_VERIFIER_KEY,
			issuer: serverEnv.PUBLIC_AUTH_URL,
		},
	});
	const token = request.headers.get('Authorization');
	try {
		if (!token) {
			throw new Error('No token');
		}

		const { orgId } = params;
		if (!orgId) {
			throw new Error('No orgId');
		}

		// check that we have access to this org
		await propelauth.validateAccessTokenAndGetUserWithOrgInfo(token, { orgId });
		// get users in org
		const orgUsers = await propelauth.fetchUsersInOrg({ orgId });

		const responseData = {
			users: orgUsers.users.map(publicUserInfo),
		};
		return new Response(JSON.stringify(responseData), { status: 200 });
	} catch (e) {
		const err = handleError(e, { logError: true, returnDetailedErrorToUser: false });
		return new Response(err.message, { status: err.status });
	}
};

export function publicUserInfo(user: UserMetadata) {
	return {
		userId: user.userId,
		name: [user.lastName, user.firstName].filter(Boolean).join(' '),
		pictureUrl: user.pictureUrl,
		email: user.email,
	};
}
