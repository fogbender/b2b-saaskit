import { createEnv, Simplify } from '@t3-oss/env-core';
import { z } from 'zod';

// in case if the script was imported from node like in case of migrations
const runtimeEnv = import.meta.env || process.env;

const clientPrefix = 'PUBLIC_' as const;

// export env for server code
export const serverEnv = createEnv({
	clientPrefix,
	server: {
		// database
		DATABASE_URL: z.string().min(1),
		// propel auth
		PROPELAUTH_API_KEY: z.string().min(1),
		PROPELAUTH_VERIFIER_KEY: z.string().min(1),
		// optional Fogbender
		FOGBENDER_SECRET: z.string().min(1).optional(),
		// optional OpenAI API key
		OPENAI_API_KEY: z.string().min(1).optional(),
		// optional Stripe
		STRIPE_SECRET_KEY: z.string().min(1).optional(),
		STRIPE_PRICE_ID: z.string().min(1).optional(),
	},
	client: {
		// propel auth
		PUBLIC_AUTH_URL: z.string().min(1),
		// fogbender
		PUBLIC_FOGBENDER_WIDGET_ID: z.string().min(1).optional(),
		// posthog
		PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
	},
	runtimeEnv,
	skipValidation:
		!!runtimeEnv.SKIP_ENV_VALIDATION &&
		runtimeEnv.SKIP_ENV_VALIDATION !== 'false' &&
		runtimeEnv.SKIP_ENV_VALIDATION !== '0',
});

type PickByPrefix<T, TPrefix extends string> = {
	[TKey in keyof T as TKey extends `${TPrefix}${string}` ? TKey : never]: T[TKey];
};

export type ClientEnv = Simplify<PickByPrefix<typeof serverEnv, typeof clientPrefix>>;
