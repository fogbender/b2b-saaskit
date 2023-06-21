import type { User } from '@propelauth/node';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { z } from 'zod';

import { db } from '../../../db/db';
import { gptKeys, orgStripeCustomerMappings } from '../../../db/schema';
import { serverEnv } from '../../../t3-env';
import { authProcedure, createTRPCRouter, orgProcedure } from '../trpc';

export const settingsRouter = createTRPCRouter({
	stripeConfigured: orgProcedure.query(() => {
		return serverEnv.STRIPE_SECRET_KEY !== undefined && serverEnv.STRIPE_PRICE_ID !== undefined;
	}),
	getSubscriptions: orgProcedure.query(async ({ ctx }) => {
		if (!serverEnv.STRIPE_SECRET_KEY) {
			return [];
		} else {
			const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

			const mappings = await db
				.select()
				.from(orgStripeCustomerMappings)
				.where(eq(orgStripeCustomerMappings.orgId, ctx.requiredOrgId));

			const res = await Promise.all(
				mappings.map(async ({ stripeCustomerId }) => {
					const customer = await stripe.customers.retrieve(stripeCustomerId);

					const subscriptions = await stripe.subscriptions.list({
						customer: stripeCustomerId,
					});

					const active = subscriptions.data.some((s) => s.status === 'active');

					const subscriptionWithCancel = subscriptions.data.find((s) => s.cancel_at);

					const cancelAtEpochSec = subscriptionWithCancel?.cancel_at;

					const return_url = new URL(ctx.req.url).origin + '/app/settings';

					const billingPortalSession = await stripe.billingPortal.sessions.create({
						customer: stripeCustomerId,
						return_url,
					});

					return {
						active,
						email: 'email' in customer && customer.email,
						portalUrl: billingPortalSession.url,
						cancelAtEpochSec,
					};
				})
			);

			return res;
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
