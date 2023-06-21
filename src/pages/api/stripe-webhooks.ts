import { handleError } from '@propelauth/node';
import type { APIRoute } from 'astro';
import type Stripe from 'stripe';

import { db } from '../../db/db';
import { orgStripeCustomerMappings } from '../../db/schema';
import { constructEvent } from '../../lib/stripe';

// import { serverEnv } from '../../t3-env';

export const prerender = false;

export const post: APIRoute = async ({ request }) => {
	try {
		const body = await constructEvent(request, serverEnv.STRIPE_WEBHOOK_SECRET);

		if (body.type === 'checkout.session.completed') {
			const object = body.data.object as Stripe.Checkout.Session;
			const orgId = object.client_reference_id;
			const stripeCustomerId = object.customer;

			if (orgId && stripeCustomerId && typeof stripeCustomerId === 'string') {
				await db.insert(orgStripeCustomerMappings).values({
					orgId,
					stripeCustomerId,
				});
			}
		}

		return new Response(null, { status: 204, statusText: 'No Content' });
	} catch (e) {
		const err = handleError(e, { logError: true, returnDetailedErrorToUser: false });
		return new Response(err.message, { status: err.status });
	}
};
