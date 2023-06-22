import { handleError, initBaseAuth } from '@propelauth/node';
import type { APIRoute } from 'astro';

import { getStripeConfig, openStripe } from '../../lib/stripe';
import { serverEnv } from '../../t3-env';

export const prerender = false;

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
		const stripeConfig = getStripeConfig();
		if (!stripeConfig) {
			throw new Error('Stripe secret key and price ID are not configured');
		}

		if (!token) {
			throw new Error('No token');
		}

		const { orgId } = await request.json();

		if (!orgId) {
			throw new Error('No orgId');
		}

		// make sure we have access to org
		await propelauth.validateAccessTokenAndGetUserWithOrgInfo(token, { orgId });

		const stripe = openStripe(stripeConfig);
		const appUrl = new URL('/app/settings', request.url).toString();
		const session = await stripe.checkout.sessions.create({
			client_reference_id: orgId,
			line_items: [
				{
					price: stripeConfig.priceId,
					quantity: 1,
				},
			],
			subscription_data: {
				metadata: {
					what: 'subscription_data',
					orgId,
				},
			},
			metadata: {
				what: 'checkout_session',
				orgId,
			},
			mode: 'subscription',
			success_url: appUrl,
			cancel_url: appUrl,
		});

		const { url } = session;

		if (!url) {
			throw new Error('No checkout URL');
		}

		return new Response(JSON.stringify({ url }));
	} catch (e) {
		const err = handleError(e, { logError: true, returnDetailedErrorToUser: false });
		return new Response(err.message, { status: err.status });
	}
};
