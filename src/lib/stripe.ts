import Stripe from 'stripe';

import { serverEnv } from '../t3-env';

export const getStripeConfig = () => {
	if (serverEnv.STRIPE_SECRET_KEY !== undefined && serverEnv.STRIPE_PRICE_ID !== undefined) {
		return {
			apiKey: serverEnv.STRIPE_SECRET_KEY,
			priceId: serverEnv.STRIPE_PRICE_ID,
		};
	} else {
		return undefined;
	}
};

export const openStripe = ({ apiKey }: { apiKey: string }) =>
	new Stripe(apiKey, {
		apiVersion: '2022-11-15',
		typescript: true,
	});

export async function searchSubscriptionsByOrgId(
	stripeConfig: { apiKey: string },
	orgId: string,
	returnUrl?: string
) {
	const stripe = openStripe(stripeConfig);
	const search = await stripe.subscriptions.search({
		expand: ['data.customer'],
		query: 'metadata["orgId"]:"' + encodeURI(orgId) + '"',
	});
	const res = await Promise.all(
		search.data.map(async (x) => {
			const customer = x.customer;
			if (typeof customer === 'string') {
				throw new Error('data.customer was not expanded in search');
			}
			const portalUrl = returnUrl
				? (
						await stripe.billingPortal.sessions.create({
							customer: customer.id,
							return_url: returnUrl,
						})
				  ).url
				: undefined;
			return {
				active: x.status === 'active',
				email: 'email' in customer && customer.email,
				portalUrl,
				cancelAtEpochSec: x.cancel_at,
			};
		})
	);
	return res;
}
