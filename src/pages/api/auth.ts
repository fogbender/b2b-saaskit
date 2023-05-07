import type { APIRoute } from 'astro';
import { handleError, initBaseAuth } from '@propelauth/node';
import type { FogbenderAuthResponse } from '../../types/types';
import { serverEnv } from '../../t3-env';

export const post: APIRoute = async ({ request }) => {
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
		const { orgId } = await request.json();
		if (!orgId) {
			throw new Error('No orgId');
		}
		// check that we have access to this org
		await propelauth.validateAccessTokenAndGetUserWithOrgInfo(token, { orgId });

		const responseData: FogbenderAuthResponse = {
			done: true,
		};
		const headers = new Headers();
		headers.append(
			'set-cookie',
			`b2b_propel_header=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`
		);
		headers.append('set-cookie', `b2b_propel_auth=true; Path=/; Secure; SameSite=Strict`);
		return new Response(JSON.stringify(responseData), { status: 200, headers });
	} catch (e) {
		const err = handleError(e, { logError: true, returnDetailedErrorToUser: false });
		return new Response(err.message, { status: err.status });
	}
};
