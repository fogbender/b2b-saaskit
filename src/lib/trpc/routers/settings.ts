import { z } from 'zod';
import { eq } from 'drizzle-orm';

import { createTRPCRouter, authProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { db } from '../../../db/db';
import { gptKeys } from '../../../db/schema';
import type { User } from '@propelauth/node';

export const settingsRouter = createTRPCRouter({
	getKeys: authProcedure
		.input(
			z.object({
				orgId: z.string(),
			})
		)
		.query(async ({ ctx, input }) => {
			requireOrg(ctx, input.orgId);
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
				.where(eq(gptKeys.orgId, input.orgId))
				.orderBy(gptKeys.createdAt);
		}),
	createKey: authProcedure
		.input(
			z.object({
				orgId: z.string(),
				keySecret: z.string(),
				keyType: z.enum(['gpt-3', 'gpt-4']),
			})
		)
		.mutation(async ({ ctx, input }) => {
			requireOrg(ctx, input.orgId);
			let keyId: number | undefined;
			await db.transaction(async (trx) => {
				await trx.delete(gptKeys).where(eq(gptKeys.orgId, input.orgId));
				const y = await trx
					.insert(gptKeys)
					.values({
						userId: ctx.user.userId,
						keySecret: input.keySecret,
						keyPublic: input.keySecret.slice(0, 3) + '...' + input.keySecret.slice(-4),
						keyType: input.keyType,
						orgId: input.orgId,
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
	return item?.userId === ctx.user.userId;
}

function requireOrg(ctx: { user: User }, requiredOrgId: string) {
	for (const orgId in ctx.user.orgIdToOrgMemberInfo) {
		const orgMemberInfo = ctx.user.orgIdToOrgMemberInfo[orgId];
		console.log(orgMemberInfo);
		if (orgMemberInfo?.orgId === requiredOrgId) {
			return orgMemberInfo;
		}
	}
	throw new TRPCError({
		code: 'FORBIDDEN',
		message: 'You can only view key of your own org.',
	});
}
