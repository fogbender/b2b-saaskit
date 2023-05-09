import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const prompts = pgTable('prompts', {
	id: serial('id').primaryKey(),
	prompt: text('prompt').notNull(),
	userId: text('user_id').notNull(),
});
