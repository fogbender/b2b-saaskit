import { initBaseAuth } from '@propelauth/node';
import { serverEnv } from '../t3-env';

export const propelauth = initBaseAuth({
	authUrl: serverEnv.PUBLIC_AUTH_URL,
	apiKey: serverEnv.PROPELAUTH_API_KEY,
	manualTokenVerificationMetadata: {
		verifierKey: serverEnv.PROPELAUTH_VERIFIER_KEY,
		issuer: serverEnv.PUBLIC_AUTH_URL,
	},
});
