import type { APIRoute } from 'astro';
import { handleError, initBaseAuth } from '@propelauth/node';
import jsonwebtoken from 'jsonwebtoken';

import type { FogbenderTokenResponse } from '../../types/types';

export const post: APIRoute = async ({ request }) => {
	const propelauth = initBaseAuth({
		authUrl: import.meta.env.PUBLIC_AUTH_URL,
		apiKey: import.meta.env.PROPELAUTH_API_KEY,
		manualTokenVerificationMetadata: {
			verifierKey: import.meta.env.PROPELAUTH_VERIFIER_KEY,
			issuer: import.meta.env.PUBLIC_AUTH_URL,
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
		const { user, orgMemberInfo } = await propelauth.validateAccessTokenAndGetUserWithOrgInfo(
			token,
			{ orgId }
		);

		const unsignedToken = {
			userId: user.userId,
			customerId: orgMemberInfo.orgId,
		};

		const secret = import.meta.env.FOGBENDER_SECRET;
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
