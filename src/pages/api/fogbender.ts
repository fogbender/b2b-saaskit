import { handleError, initBaseAuth } from '@propelauth/node';
import type { APIRoute } from 'astro';
import jsonwebtoken from 'jsonwebtoken';

import { serverEnv } from '../../t3-env';
import type { FogbenderTokenResponse } from '../../types/types';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
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
		const secret = serverEnv.FOGBENDER_SECRET;
		if (!secret) {
			throw new Error('FOGBENDER_SECRET was not configured');
		}

		if (!token) {
			throw new Error('No token');
		}

		const { orgId } = await request.json();
		if (!orgId) {
			throw new Error('No orgId');
		}

		// make sure we have access to org
		const { user, orgMemberInfo } = await propelauth.validateAccessTokenAndGetUserWithOrgInfo(
			token,
			{ orgId }
		);

		const unsignedToken = {
			userId: user.userId,
			customerId: orgMemberInfo.orgId,
		};

		const userJWT = jsonwebtoken.sign(unsignedToken, secret, {
			algorithm: 'HS256',
		});

		const responseData: FogbenderTokenResponse = {
			...unsignedToken,
			userJWT,
		};
		return new Response(JSON.stringify(responseData), { status: 200 });
	} catch (e) {
		const err = handleError(e, { logError: true, returnDetailedErrorToUser: false });
		return new Response(err.message, { status: err.status });
	}
};
