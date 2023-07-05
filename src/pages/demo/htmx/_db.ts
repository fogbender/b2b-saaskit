import { eq, sql } from 'drizzle-orm';

import { db } from '../../../db/db';
import { sharedKeyRatelimit as count } from '../../../db/schema';

const key = 'coutner';

export async function getCounter() {
	const result = await db.select({ value: count.value }).from(count).where(eq(count.limitId, key));
	const first = result[0];
	if (!first) {
		return 0;
	}
	return first.value;
}

export async function incrementCounter() {
	// will do UPSERT
	const result = await db
		.insert(count)
		.values({
			limitId: key,
			value: 1,
		})
		.onConflictDoUpdate({
			target: count.limitId,
			set: {
				value: sql`${count.value} + 1`,
			},
		})
		.returning({
			value: count.value,
		});
	const first = result[0];
	if (!first) {
		throw new Error('No result from UPSERT');
	}

	return first.value;
}
