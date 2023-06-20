import { handleError, initBaseAuth } from '@propelauth/node';
import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

import { db } from '../../db/db';
import { orgStripeCustomerMappings } from '../../db/schema';
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
		if (!token) {
			throw new Error('No token');
		}

		const { orgId } = await request.json();

		if (!orgId) {
			throw new Error('No orgId');
		}

		// make sure we have access to org
		await propelauth.validateAccessTokenAndGetUserWithOrgInfo(token, { orgId });

		const mappings = await db
			.select()
			.from(orgStripeCustomerMappings)
			.where(eq(orgStripeCustomerMappings.orgId, orgId));

		const customerId = mappings[0] && mappings[0].stripeCustomerId;

		if (!serverEnv.STRIPE_SECRET_KEY) {
			throw new Error('No Stripe secret key');
		}

		const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });
		const app_url = serverEnv.SITE_URL + '/app';
		const session = await stripe.checkout.sessions.create({
			client_reference_id: orgId,
			customer: customerId,
			line_items: [
				{
					price: serverEnv.STRIPE_PRICE_ID,
					quantity: 1,
				},
			],
			mode: 'subscription',
			success_url: app_url,
			cancel_url: app_url,
		});

		const { url } = session as { url: string };

		return new Response(JSON.stringify({ url }));
	} catch (e) {
		const err = handleError(e, { logError: true, returnDetailedErrorToUser: false });
		return new Response(err.message, { status: err.status });
	}
};
