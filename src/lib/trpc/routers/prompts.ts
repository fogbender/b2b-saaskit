import { z } from 'zod';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

import { createTRPCRouter, authProcedure, orgProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { db } from '../../../db/db';
import { gptKeys, prompts } from '../../../db/schema';
import { trackEvent } from '../../posthog';

export const promptsRouter = createTRPCRouter({
	getPrompts: orgProcedure.query(async ({ ctx }) => {
		return await db.select().from(prompts).where(eq(prompts.orgId, ctx.requiredOrgId));
	}),
	createPrompt: orgProcedure
		.input(
			z.object({
				prompt: z.string(),
				response: z.string().optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			trackEvent(ctx.user, 'prompt_created');
			const promptId = nanoid();
			await db.insert(prompts).values({
				orgId: ctx.requiredOrgId,
				promptId,
				content: input.prompt,
				response: input.response,
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
	runPrompt: orgProcedure
		.input(
			z.object({
				prompt: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const keys = await db
				.select({
					keyId: gptKeys.keyId,
					keySecret: gptKeys.keySecret,
					keyType: gptKeys.keyType,
				})
				.from(gptKeys)
				.where(eq(gptKeys.orgId, ctx.requiredOrgId))
				.orderBy(gptKeys.createdAt);
			const key = keys[0];
			if (!key) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'No OpenAI key found for this organization.',
				});
			}
			await db
				.update(gptKeys)
				.set({
					lastUsedAt: new Date(),
				})
				.where(eq(gptKeys.keyId, key.keyId));
			console.log('runPrompt', input);
			const res = await fetch('https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${key.keySecret}`,
				},
				body: JSON.stringify({
					model: key.keyType === 'gpt-4' ? 'gpt-4' : 'gpt-3.5-turbo',
					messages: [
						{
							role: 'user',
							content: input.prompt,
						},
					],
				}),
			});
			const { error, choices } = (await res.json()) as {
				error?: { message: string };
				choices: {
					message: { content: string };
				}[];
			};
			if (error) {
				return { error: error.message };
			}
			const choice = choices[0];
			if (!choice) {
				return { error: 'No response from OpenAI' };
			}
			return { message: choice.message.content };
		}),
});
