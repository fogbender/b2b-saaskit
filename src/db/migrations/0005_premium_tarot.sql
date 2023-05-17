ALTER TABLE "prompts" ADD COLUMN "org_id" text NOT NULL;
ALTER TABLE "prompts" ADD COLUMN "response" text DEFAULT '' NOT NULL;