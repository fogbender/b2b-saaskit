CREATE TABLE IF NOT EXISTS "prompts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"content" text NOT NULL,
	"privacy_level" text NOT NULL,
	"created_at" timestamp NOT NULL
);

ALTER TABLE PROMPTS ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service" ON "public"."prompts" AS PERMISSIVE FOR ALL TO service_role USING (true)
