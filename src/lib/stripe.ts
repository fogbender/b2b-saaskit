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

export const constructEvent = async (request: Request) => {
	const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY);
	const endpointSecret = serverEnv.STRIPE_WEBHOOK_SECRET;
	const sig = request.headers.get('stripe-signature');

	return stripe.webhooks.constructEvent(await request.text(), sig, endpointSecret);
};
