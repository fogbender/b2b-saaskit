ALTER TABLE "default_keys" DROP CONSTRAINT "default_keys_pkey";
CREATE UNIQUE INDEX IF NOT EXISTS "name_population_idx" ON "default_keys" ("item_id","item_type");
