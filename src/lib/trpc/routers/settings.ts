import type { User } from '@propelauth/node';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '../../../db/db';
import { gptKeys } from '../../../db/schema';
import { getStripeConfig, searchSubscriptionsByOrgId } from '../../stripe';
import { authProcedure, createTRPCRouter, orgProcedure } from '../trpc';

export const settingsRouter = createTRPCRouter({
	stripeConfigured: orgProcedure.query(() => {
		return getStripeConfig() !== undefined;
	}),
	getSubscriptions: orgProcedure.query(async ({ ctx }) => {
		const stripeConfig = getStripeConfig();
		if (!stripeConfig) {
			return [];
		} else {
			const returnUrl = new URL('/app/settings', ctx.req.url).toString();
			return await searchSubscriptionsByOrgId(stripeConfig, ctx.requiredOrgId, returnUrl);
		}
	}),
	getKeys: orgProcedure.query(async ({ ctx }) => {
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
			.where(eq(gptKeys.orgId, ctx.requiredOrgId))
			.orderBy(gptKeys.createdAt);
	}),
	createKey: orgProcedure
		.input(
			z.object({
				keySecret: z.string(),
				keyType: z.enum(['gpt-3', 'gpt-4']),
			})
		)
		.mutation(async ({ ctx, input }) => {
			let keyId: number | undefined;
			await db.transaction(async (trx) => {
				await trx.delete(gptKeys).where(eq(gptKeys.orgId, ctx.requiredOrgId));
				const y = await trx
					.insert(gptKeys)
					.values({
						userId: ctx.user.userId,
						keySecret: input.keySecret,
						keyPublic: input.keySecret.slice(0, 3) + '...' + input.keySecret.slice(-4),
						keyType: input.keyType,
						orgId: ctx.requiredOrgId,
						isShared: true,
					})
					.returning({ id: gptKeys.keyId });
				if (y[0]) {
					keyId = y[0].id;
				}
			});
			if (!keyId) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to store the key',
				});
			}

			return keyId;
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
				await trx.delete(gptKeys).where(eq(gptKeys.keyId, input.keyId));
			});
			return input;
		}),
});

function canOnlyChangeOwnKey(ctx: { user: User }, item: { userId: string; orgId: string }) {
	return item.userId === ctx.user.userId;
}
