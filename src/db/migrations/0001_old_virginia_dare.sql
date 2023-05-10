DO $$ BEGIN
 CREATE TYPE "gpt_type" AS ENUM('gpt-3', 'gpt-4');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "item_type" AS ENUM('user', 'org');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "default_keys" (
	"item_id" text PRIMARY KEY NOT NULL,
	"item_type" item_type NOT NULL,
	"key_id" integer
);

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

DO $$ BEGIN
 ALTER TABLE "default_keys" ADD CONSTRAINT "default_keys_key_id_gpt_keys_id_fk" FOREIGN KEY ("key_id") REFERENCES "gpt_keys"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE gpt_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service" ON "public"."gpt_keys" AS PERMISSIVE FOR ALL TO service_role USING (true);

ALTER TABLE default_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service" ON "public"."default_keys" AS PERMISSIVE FOR ALL TO service_role USING (true);
