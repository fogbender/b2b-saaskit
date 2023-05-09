import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

// Hello and welcome to the schema file!
// 1. run `doppler run npx drizzle-kit generate:pg` to generate migrations
// 2. (IMPORTANT) if you are creating new tables you would need to manually
//    edit SQL file to add row level security policies
// 3. once this is done, run `doppler run yarn migrate` to apply the migration

/* ```sql
ALTER TABLE PROMPTS ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service" ON "public"."prompts" AS PERMISSIVE FOR ALL TO service_role USING (true)
``` */

export const prompts = pgTable('prompts', {
	promptId: text('id').primaryKey(),
	userId: text('user_id').notNull(),
	content: text('content').notNull(),
	privacyLevel: text('privacy_level').notNull(),
	createdAt: timestamp('created_at').notNull(),
});
