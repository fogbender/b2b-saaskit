import { TRPCError } from '@trpc/server';
import { eq, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { db } from '../../../db/db';
import { gptKeys, prompts, sharedKeyRatelimit } from '../../../db/schema';
import { serverEnv } from '../../../t3-env';
import { trackEvent } from '../../posthog';
import { authProcedure, createTRPCRouter, orgProcedure } from '../trpc';

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

			if (key) {
				await db
					.update(gptKeys)
					.set({
						lastUsedAt: new Date(),
					})
					.where(eq(gptKeys.keyId, key.keyId));
			}

			let secretKey: string;
			if (key) {
				secretKey = key.keySecret;
			} else {
				if (!serverEnv.OPENAI_API_KEY) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'No OpenAI key found for this organization.',
					});
				} else {
					const remaining = await rateLimitUpsert(ctx.user.userId, Date.now());
					if (remaining > 0) {
						secretKey = serverEnv.OPENAI_API_KEY;
					} else {
						throw new TRPCError({
							code: 'TOO_MANY_REQUESTS',
							message: 'You have exceeded the rate limit for this key.',
						});
					}
				}
			}

			const res = await fetch('https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${secretKey}`,
				},
				body: JSON.stringify({
					model: key?.keyType === 'gpt-4' ? 'gpt-4' : 'gpt-3.5-turbo',
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

	getDefaultKey: authProcedure.query(async ({ ctx }) => {
		if (serverEnv.OPENAI_API_KEY) {
			const usage = await db
				.select({
					value: sharedKeyRatelimit.value,
				})
				.from(sharedKeyRatelimit)
				.where(eq(sharedKeyRatelimit.limitId, rateLimitSharedKeyId(ctx.user.userId, Date.now())));
			const spent = usage[0]?.value ?? 0;
			return {
				isSet: true,
				canUse: spent < limit,
				requestsRemaining: limit - spent,
				resetsAt: new Date(rateLimitSharedKeyResetsAt(Date.now())),
			};
		}

		return { isSet: false };
	}),
});

// const period = 1000 * 5; // 5 seconds
const period = 1000 * 60 * 60 * 24; // 24 hours
const limit = 3;

function rateLimitSharedKeyId(userId: string, currentTimestamp: number) {
	return `shared_key:${userId}:${Math.floor(currentTimestamp / period)}`;
}

function rateLimitSharedKeyResetsAt(currentTimestamp: number) {
	return Math.ceil(currentTimestamp / period) * period;
}

/**
 * @returns the number of requests remaining
 */
async function rateLimitUpsert(userId: string, currentTimestamp: number) {
	// will do UPSERT
	const result = await db
		.insert(sharedKeyRatelimit)
		.values({
			limitId: rateLimitSharedKeyId(userId, currentTimestamp),
			value: 1,
		})
		.onConflictDoUpdate({
			target: sharedKeyRatelimit.limitId,
			set: {
				value: sql`${sharedKeyRatelimit.value} + 1`,
			},
		})
		.returning({
			value: sharedKeyRatelimit.value,
		});
	const first = result[0];
	if (!first) {
		throw new Error('No result from UPSERT');
	}

	// +1 to get the value that we had before the UPSERT
	return limit - first.value + 1;
}
