import { createEnv, LooseOptions, StrictOptions } from '@t3-oss/env-core';
import { z, ZodOptional, ZodString, ZodType } from 'zod';

function validateEnv<
	TPrefix extends string,
	TServer extends Record<string, ZodType> = NonNullable<unknown>,
	TClient extends Record<string, ZodType> = NonNullable<unknown>
>(opts: LooseOptions<TPrefix, TServer, TClient> | StrictOptions<TPrefix, TServer, TClient>) {
	return opts;
}

// in case if the script was imported from node like in case of migrations
const runtimeEnv = import.meta.env || process.env;

const x = validateEnv({
	clientPrefix: 'PUBLIC_',
	server: {
		// database
		DATABASE_URL: z.string().min(1),
		// propel auth
		PROPELAUTH_API_KEY: z.string().min(1),
		PROPELAUTH_VERIFIER_KEY: z.string().min(1),
		// fogbender
		FOGBENDER_SECRET: z.string().min(1).optional(),
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

// this function would be dead code eliminated
const client = () => {
	// add check that values are strings
	const v = (_: (ZodString | ZodOptional<ZodString>)[]) => {};

	// this line will error if the client env is not a string
	v(Object.values(x.client));
	// generate type just for the client
	return z.object(x.client);
};

export type ClientEnv = z.infer<ReturnType<typeof client>>;

// export env for server code
export const serverEnv = createEnv(x);
