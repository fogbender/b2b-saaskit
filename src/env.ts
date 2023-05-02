import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
	clientPrefix: 'PUBLIC_',
	server: {
		DATABASE_URL: z.string().url(),
		OPEN_AI_API_KEY: z.string().min(1),
	},
	client: {
		PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
	},
	runtimeEnv: import.meta.env,
});

console.log(env);
