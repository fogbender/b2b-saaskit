CREATE TABLE IF NOT EXISTS "prompts" (
	"id" serial PRIMARY KEY NOT NULL,
	"prompt" text NOT NULL,
	"user_id" text NOT NULL
);
