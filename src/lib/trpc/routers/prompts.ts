import kv from '@vercel/kv';
import { z } from 'zod';
import { nanoid } from 'nanoid';

import { createTRPCRouter, authProcedure } from '../trpc';
import type { Simplify } from 'unthunk';
import { TRPCError } from '@trpc/server';

export const promptsRouter = createTRPCRouter({
	getPrompts: authProcedure.query(async ({}) => {
		const promptIds = await kv.zrange('prompts:all', 0, -1);
		const prompts: Prompt[] = [];
		for (const promptId of promptIds) {
			if (typeof promptId === 'string') {
				const prompt = await getPrompt(promptId);
				if (prompt) {
					prompts.push(prompt);
				}
			}
		}
		return prompts;
	}),
	createPrompt: authProcedure
		.input(
			z.object({
				prompt: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const promptId = nanoid();
			const m = kv.multi();
			const now = new Date().getTime();
			const prompt: Prompt = {
				id: promptId,
				user_id: ctx.user.userId,
				content: input.prompt,
				privacy_level: 'public',
				created_at: now,
			};
			m.hmset(`prompts:${promptId}`, prompt);
			m.zadd(`prompts:all`, { score: now, member: promptId });
			console.log('x', await m.exec());
			return promptId;
		}),
	deletePrompt: authProcedure
		.input(
			z.object({
				promptId: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const prompt = await getPrompt(input.promptId);
			if (prompt?.user_id !== ctx.user.userId) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You can only delete your own prompts.',
				});
			}
			const m = kv.multi();
			m.del(`prompts:${input.promptId}`);
			m.zrem(`prompts:all`, input.promptId);
			await m.exec();
			return input;
		}),
});

const zPrompt = z.object({
	id: z.string(),
	content: z.coerce.string(), // redis can return strings as numbers 🤦
	privacy_level: z.enum(['public', 'private']),
	user_id: z.string(),
	created_at: z.number(),
});
type Prompt = Simplify<z.infer<typeof zPrompt>>;
const promptKeys = Object.keys(zPrompt.shape) as (keyof Prompt)[];

const getPrompt = async (promptId: string) => {
	const data = await kv.hmget(`prompts:${promptId}`, ...promptKeys);
	if (data) {
		return zPrompt.parse(data);
	}
	return;
};
