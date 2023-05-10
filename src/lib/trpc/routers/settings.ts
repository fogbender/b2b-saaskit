import { z } from 'zod';
import { eq } from 'drizzle-orm';

import { createTRPCRouter, authProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { db } from '../../../db/db';
import { gptKeys, defaultKeys } from '../../../db/schema';
import type { User } from '@propelauth/node';

export const settingsRouter = createTRPCRouter({
	getKeys: authProcedure.query(async ({}) => {
		return await db
			.select({
				keyId: gptKeys.keyId,
				keyType: gptKeys.keyType,
				createdAt: gptKeys.createdAt,
				lastUsedAt: gptKeys.lastUsedAt,
				keyPublic: gptKeys.keyPublic,
				isShared: gptKeys.isShared,
			})
			.from(gptKeys)
			.orderBy(gptKeys.createdAt);
	}),
	createKey: authProcedure
		.input(
			z.object({
				keySecret: z.string(),
				keyType: z.enum(['gpt-3', 'gpt-4']),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const x = await db
				.insert(gptKeys)
				.values({
					userId: ctx.user.userId,
					keySecret: input.keySecret,
					keyPublic: input.keySecret.slice(0, 3) + '...' + input.keySecret.slice(-4),
					keyType: input.keyType,
					orgId: 'public',
					isShared: false,
				})
				.returning({ id: gptKeys.keyId });
			const key = x[0];
			if (!key) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to create key',
				});
			}
			return key.id;
		}),
	deleteKey: authProcedure
		.input(
			z.object({
				keyId: z.number(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const x = await db
				.select({
					userId: gptKeys.userId,
					orgId: gptKeys.orgId,
				})
				.from(gptKeys)
				.where(eq(gptKeys.keyId, input.keyId));
			const item = x[0];
			if (!item) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Prompt not found',
				});
			}

			if (!canOnlyChangeOwnKey(ctx, item)) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You can only delete your own prompts.',
				});
			}
			await db.transaction(async (trx) => {
				await trx.delete(defaultKeys).where(eq(defaultKeys.keyId, input.keyId));
				await trx.delete(gptKeys).where(eq(gptKeys.keyId, input.keyId));
			});
			return input;
		}),
	changeVisibility: authProcedure
		.input(
			z.object({
				keyId: z.number(),
				isShared: z.boolean(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const x = await db
				.select({
					userId: gptKeys.userId,
					orgId: gptKeys.orgId,
				})
				.from(gptKeys)
				.where(eq(gptKeys.keyId, input.keyId));
			const item = x[0];
			if (!item) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Prompt not found',
				});
			}

			if (!canOnlyChangeOwnKey(ctx, item)) {
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You can only edit your own prompts.',
				});
			}
			await db
				.update(gptKeys)
				.set({ isShared: input.isShared })
				.where(eq(gptKeys.keyId, input.keyId));
			return input;
		}),
	getDefaults: authProcedure.query(async ({ ctx }) => {
		return await db
			.select({
				keyId: defaultKeys.keyId,
				itemType: defaultKeys.itemType,
				itemId: defaultKeys.itemId,
			})
			.from(defaultKeys)
			.where(eq(defaultKeys.itemId, ctx.user.userId))
			.orderBy(defaultKeys.keyId);
	}),
	saveDefault: authProcedure
		.input(
			z.object({
				keyId: z.number(),
				itemType: z.enum(['user', 'org']),
			})
		)
		.mutation(async ({ ctx, input }) => {
			console.error('FIXME: check access');
			// if (!canOnlyChangeOwnKey(ctx, item)) {
			// 	throw new TRPCError({
			// 		code: 'FORBIDDEN',
			// 		message: 'You can only edit your own prompts.',
			// 	});
			// }
			const itemId = input.itemType === 'user' ? ctx.user.userId : 'ctx.user.orgId';
			await db
				.insert(defaultKeys)
				.values({ itemId, itemType: input.itemType, keyId: input.keyId })
				.onConflictDoUpdate({
					target: [defaultKeys.itemType, defaultKeys.itemId],
					set: { keyId: input.keyId },
				});
			return input;
		}),
});

function canOnlyChangeOwnKey(ctx: { user: User }, item: { userId: string; orgId: string }) {
	return item?.userId === ctx.user.userId;
}
