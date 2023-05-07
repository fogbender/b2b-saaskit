import kv from '@vercel/kv';
import { z } from 'zod';

import { createTRPCRouter, authProcedure } from '../trpc';

export const promptsRouter = createTRPCRouter({
	getPrompts: authProcedure.query(async ({ ctx }) => {
		return await kv.get('prompts');
	}),
	createPrompt: authProcedure
		.input(
			z.object({
				prompt: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			await kv.set('prompts', input.prompt);
		}),
});
