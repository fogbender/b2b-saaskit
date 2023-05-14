import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
} from 'drizzle-orm/pg-core';

// Hello and welcome to the schema file!
// 1. run `doppler run npx drizzle-kit generate:pg` to generate migrations
// 2. (IMPORTANT) if you are creating new tables you would need to manually
//    edit SQL file to add row level security policies
// 3. once this is done, run `doppler run yarn migrate` to apply the migration

/* ```sql
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service" ON "public"."prompts" AS PERMISSIVE FOR ALL TO service_role USING (true);
``` */

export const prompts = pgTable('prompts', {
	promptId: text('id').primaryKey(),
	userId: text('user_id').notNull(),
	content: text('content').notNull(),
	privacyLevel: text('privacy_level').notNull(),
	createdAt: timestamp('created_at').notNull(),
});

export const gptTypeEnum = pgEnum('gpt_type', ['gpt-3', 'gpt-4']);

/* ```sql
ALTER TABLE gpt_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service" ON "public"."gpt_keys" AS PERMISSIVE FOR ALL TO service_role USING (true);
``` */

export const gptKeys = pgTable('gpt_keys', {
	keyId: serial('id').primaryKey(),
	keyPublic: text('key_public').notNull(),
	keySecret: text('key_secret').notNull(),
	keyType: gptTypeEnum('key_type').notNull(),
	userId: text('user_id').notNull(),
	orgId: text('org_id').notNull(),
	isShared: boolean('is_shared').default(false).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	lastUsedAt: timestamp('last_used_at'),
});

export const itemTypeEnum = pgEnum('item_type', ['user', 'org']);

/* ```sql
ALTER TABLE default_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service" ON "public"."default_keys" AS PERMISSIVE FOR ALL TO service_role USING (true);
``` */

export const defaultKeys = pgTable(
	'default_keys',
	{
		itemId: text('item_id').notNull(),
		itemType: itemTypeEnum('item_type').notNull(),
		keyId: integer('key_id').references(() => gptKeys.keyId),
	},
	(defaultKeys) => {
		return {
			namePopulationIdx: uniqueIndex('name_population_idx').on(
				defaultKeys.itemId,
				defaultKeys.itemType
			),
		};
	}
);

/* ```sql
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service" ON "public"."surveys" AS PERMISSIVE FOR ALL TO service_role USING (true);
``` */

export const surveys = pgTable('surveys', {
	id: serial('id').primaryKey(),
	rating: integer('rating').notNull(),
	isPublic: boolean('is_public').default(false).notNull(),
	comments: text('comments'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});
