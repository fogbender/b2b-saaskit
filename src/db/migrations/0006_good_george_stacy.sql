CREATE TABLE IF NOT EXISTS "shared_key_ratelimit" (
	"id" text PRIMARY KEY NOT NULL,
	"value" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE shared_key_ratelimit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service" ON "public"."shared_key_ratelimit" AS PERMISSIVE FOR ALL TO service_role USING (true);
