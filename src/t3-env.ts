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
	onValidationError: (zodError) => {
		// we can't use internal AstroError directly unfortunatelly https://github.com/withastro/astro/blob/c459b81785b8bbdd07c3d27b471990e8ffa656df/packages/astro/src/core/errors/errors.ts#L32
		class AstroError extends Error {
			constructor(message: string, public hint?: string) {
				super(message);
			}
		}
		const { fieldErrors } = zodError.flatten();
		const errorString = Object.entries(fieldErrors)
			.map(([key, value]) => `\n - ${key} ${value}`)
			.join('');
		const error = new AstroError('❌ Invalid environment variables: ' + errorString);
		if (import.meta.env.DEV) {
			error.hint = `If you see this error, the app is not configured properly

- This error is produced by \`createEnv\` function inside the \`src/t3-env.ts\` file
- It can happen if you're running \`yarn dev\` instead of \`doppler run yarn dev\`
- To fix it, go to http://localhost:3000/setup and follow the instructions there
- If you're stuck, you can try: \`SKIP_ENV_VALIDATION=true doppler run yarn dev\`, which will skip environment variables validation
`;
		}
		throw error;
	},
});

type PickByPrefix<T, TPrefix extends string> = {
	[TKey in keyof T as TKey extends `${TPrefix}${string}` ? TKey : never]: T[TKey];
};

export type ClientEnv = Simplify<PickByPrefix<typeof serverEnv, typeof clientPrefix>>;
