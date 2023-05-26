CREATE TABLE IF NOT EXISTS "prompt_likes" (
	"prompt_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prompt_likes" ADD CONSTRAINT "prompt_likes_prompt_id_user_id" PRIMARY KEY("prompt_id","user_id");

ALTER TABLE prompt_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service" ON "public"."prompt_likes" AS PERMISSIVE FOR ALL TO service_role USING (true);

ALTER TABLE "prompts" ALTER COLUMN "content" DROP NOT NULL;
ALTER TABLE "prompts" ALTER COLUMN "response" DROP DEFAULT;
ALTER TABLE "prompts" ALTER COLUMN "response" DROP NOT NULL;
ALTER TABLE "prompts" ALTER COLUMN "created_at" SET DEFAULT now();
ALTER TABLE "prompts" ADD COLUMN "template" json DEFAULT '{}' NOT NULL;
ALTER TABLE "prompts" ADD COLUMN "title" text DEFAULT '' NOT NULL;
ALTER TABLE "prompts" ADD COLUMN "description" text DEFAULT '' NOT NULL;
ALTER TABLE "prompts" ADD COLUMN "tags" json DEFAULT '[]' NOT NULL;
ALTER TABLE "prompts" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;
