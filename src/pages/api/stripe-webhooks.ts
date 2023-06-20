import { handleError } from '@propelauth/node';
// import Stripe from 'stripe';
import type { APIRoute } from 'astro';

import { db } from '../../db/db';
import { orgStripeCustomerMappings } from '../../db/schema';

// import { serverEnv } from '../../t3-env';

export const prerender = false;

export const post: APIRoute = async ({ request }) => {
	try {
		const body = await request.json();

		if (body.type === 'checkout.session.completed') {
			const orgId = body.data.object.client_reference_id;
			const stripeCustomerId = body.data.object.customer;

			if (orgId && stripeCustomerId) {
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
