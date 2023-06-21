import Stripe from 'stripe';

import { serverEnv } from '../t3-env';

export const getStripeConfig = () => {
	if (
		serverEnv.STRIPE_SECRET_KEY !== undefined &&
		serverEnv.STRIPE_PRICE_ID !== undefined &&
		serverEnv.STRIPE_WEBHOOK_SECRET !== undefined
	) {
		return {
			apiKey: serverEnv.STRIPE_SECRET_KEY,
			priceId: serverEnv.STRIPE_PRICE_ID,
			webhookSecret: serverEnv.STRIPE_WEBHOOK_SECRET,
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
	const config = getStripeConfig();
	const sig = request.headers.get('stripe-signature');

	if (sig && config) {
		const stripe = openStripe(config);
		const text = await request.text();
		if (text) {
			return stripe.webhooks.constructEvent(text, sig, config.webhookSecret);
		}
	}

	return;
};
