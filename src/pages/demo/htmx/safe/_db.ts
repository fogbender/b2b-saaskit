import { TRPCError } from '@trpc/server';
import { desc, eq } from 'drizzle-orm';
import z from 'zod';

import { db } from '../../../../db/db';
import { surveys } from '../../../../db/schema';

export async function getSurveys() {
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
}

export async function postSurvey(form: FormData) {
	const input = z
		.object({
			rating: z.coerce.number().min(1).max(5),
			is_public: z
				.literal('on')
				.optional()
				.transform((checkbox) => checkbox === 'on'),
			comments: z.string().max(1500).optional(),
		})
		.safeParse(Object.fromEntries(form.entries()));

	if (input.success === false) {
		throw input.error;
	}
	const x = await db
		.insert(surveys)
		.values({
			rating: input.data.rating,
			isPublic: input.data.is_public,
			comments: input.data.comments,
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
}
