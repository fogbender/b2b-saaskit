CREATE TABLE IF NOT EXISTS "surveys" (
	"id" serial PRIMARY KEY NOT NULL,
	"rating" integer NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"comments" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service" ON "public"."surveys" AS PERMISSIVE FOR ALL TO service_role USING (true);
