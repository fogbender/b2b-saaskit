import { z } from 'zod';
import { desc, eq } from 'drizzle-orm';

import { createTRPCRouter, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { db } from '../../../db/db';
import { surveys } from '../../../db/schema';

export const surveysRouter = createTRPCRouter({
	getPublic: publicProcedure.query(async ({}) => {
		return await db
			.select({
				id: surveys.id,
				rating: surveys.rating,
				comments: surveys.comments,
				createdAt: surveys.createdAt,
			})
			.from(surveys)
			.where(eq(surveys.isPublic, true))
			.orderBy(desc(surveys.id));
	}),
	postSurvey: publicProcedure
		.input(
			z.object({
				rating: z.coerce.number().min(1).max(5),
				is_public: z
					.literal('on')
					.optional()
					.transform((checkbox) => checkbox === 'on'),
				comments: z.string().max(1500).optional(),
			})
		)
		.mutation(async ({ input }) => {
			const x = await db
				.insert(surveys)
				.values({
					rating: input.rating,
					isPublic: input.is_public,
					comments: input.comments,
				})
				.returning({ id: surveys.id });
			const survey = x[0];
			if (!survey) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Failed to create a survey.',
				});
			}
			return survey.id;
		}),
});
