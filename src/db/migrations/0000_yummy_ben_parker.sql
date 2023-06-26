DO $$ BEGIN
 CREATE TYPE "gpt_type" AS ENUM('gpt-3', 'gpt-4');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "gpt_keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"key_public" text NOT NULL,
	"key_secret" text NOT NULL,
	"key_type" gpt_type NOT NULL,
	"user_id" text NOT NULL,
	"org_id" text NOT NULL,
	"is_shared" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_used_at" timestamp
);

ALTER TABLE gpt_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service" ON "public"."gpt_keys" AS PERMISSIVE FOR ALL TO service_role USING (true);

CREATE TABLE IF NOT EXISTS "prompt_likes" (
	"prompt_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prompt_likes" ADD CONSTRAINT "prompt_likes_prompt_id_user_id" PRIMARY KEY("prompt_id","user_id");

ALTER TABLE prompt_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service" ON "public"."prompt_likes" AS PERMISSIVE FOR ALL TO service_role USING (true);

CREATE TABLE IF NOT EXISTS "prompts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"org_id" text NOT NULL,
	"template" json NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"tags" json NOT NULL,
	"privacy_level" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service" ON "public"."prompts" AS PERMISSIVE FOR ALL TO service_role USING (true);

CREATE TABLE IF NOT EXISTS "shared_key_ratelimit" (
	"id" text PRIMARY KEY NOT NULL,
	"value" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE shared_key_ratelimit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service" ON "public"."shared_key_ratelimit" AS PERMISSIVE FOR ALL TO service_role USING (true);

CREATE TABLE IF NOT EXISTS "surveys" (
	"id" serial PRIMARY KEY NOT NULL,
	"rating" integer NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"comments" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service" ON "public"."surveys" AS PERMISSIVE FOR ALL TO service_role USING (true);
