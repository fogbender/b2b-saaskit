import { z } from 'zod';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

import { createTRPCRouter, authProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { db } from '../../../db/db';
import { prompts } from '../../../db/schema';
import { trackEvent } from '../../posthog';

export const promptsRouter = createTRPCRouter({
	getPrompts: authProcedure.query(async ({}) => {
		return await db.select().from(prompts);
	}),
	createPrompt: authProcedure
		.input(
			z.object({
				prompt: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			trackEvent(ctx.user, 'prompt_created');
			const promptId = nanoid();
			await db.insert(prompts).values({
				promptId,
				content: input.prompt,
				userId: ctx.user.userId,
				createdAt: new Date(),
				privacyLevel: 'public',
			});
			return promptId;
		}),
	deletePrompt: authProcedure
		.input(
			z.object({
				promptId: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const x = await db
				.select({
					userId: prompts.userId,
				})
				.from(prompts)
				.where(eq(prompts.promptId, input.promptId));
			const prompt = x[0];
			if (!prompt) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Prompt not found',
				});
			}

			if (prompt?.userId !== ctx.user.userId) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You can only delete your own prompts.',
				});
			}
			await db.delete(prompts).where(eq(prompts.promptId, input.promptId));
			return input;
		}),
});
