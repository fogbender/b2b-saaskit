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
