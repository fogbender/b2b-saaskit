import { createEnv, LooseOptions, StrictOptions } from '@t3-oss/env-core';
import { z, ZodType, ZodString } from 'zod';

function validateEnv<
	TPrefix extends string,
	TServer extends Record<string, ZodType> = NonNullable<unknown>,
	TClient extends Record<string, ZodType> = NonNullable<unknown>
>(opts: LooseOptions<TPrefix, TServer, TClient> | StrictOptions<TPrefix, TServer, TClient>) {
	return opts;
}

const x = validateEnv({
	clientPrefix: 'PUBLIC_',
	server: {
		PUBLIC_AUTH_URL: z.string().url(),
		PROPELAUTH_API_KEY: z.string().min(1),
		PROPELAUTH_VERIFIER_KEY: z.string().min(1),
		FOGBENDER_SECRET: z.string().min(1),
	},
	client: {
		// PUBLIC_AUTH_URL_WRONG: z.number().min(1),
		PUBLIC_AUTH_URL: z.string().min(1),
		PUBLIC_FOGBENDER_WIDGET_ID: z.string().min(1),
	},
	runtimeEnv: import.meta.env,
	skipValidation:
		!!import.meta.env.SKIP_ENV_VALIDATION &&
		import.meta.env.SKIP_ENV_VALIDATION !== 'false' &&
		import.meta.env.SKIP_ENV_VALIDATION !== '0',
});

// this function would be dead code eliminated
const client = () => {
	// add check that values are strings
	const v = (_: ZodString[]) => {};
	// this line will error if the client env is not a string
	v(Object.values(x.client));
	// generate type just for the client
	return z.object(x.client);
};
export type ClientEnv = z.infer<ReturnType<typeof client>>;

// export env for server code
export const serverEnv = createEnv(x);
