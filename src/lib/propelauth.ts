import { initBaseAuth } from '@propelauth/node';
import { serverEnv } from '../t3-env';
import type { AstroCookies } from 'astro';

export const propelauth = initBaseAuth({
	authUrl: serverEnv.PUBLIC_AUTH_URL,
	apiKey: serverEnv.PROPELAUTH_API_KEY,
	manualTokenVerificationMetadata: {
		verifierKey: serverEnv.PROPELAUTH_VERIFIER_KEY,
		issuer: serverEnv.PUBLIC_AUTH_URL,
	},
});

export async function getUser(cookies: AstroCookies | string) {
	const header = typeof cookies === 'string' ? cookies : cookies.get('b2b_propel_header').value;
	if (header) {
		try {
			return await propelauth.validateAccessTokenAndGetUser(header);
		} catch (e) {
			console.error(e);
			return;
		}
	}
	return;
}

export type ServerUser = Awaited<ReturnType<typeof getUser>>;
