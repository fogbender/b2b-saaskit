CREATE TABLE IF NOT EXISTS "org_stripe_customer_mappings" (
	"org_id" text NOT NULL,
	"stripe_customer_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "org_stripe_customer_mappings" ADD CONSTRAINT "org_stripe_customer_mappings_org_id_stripe_customer_id" PRIMARY KEY("org_id","stripe_customer_id");

ALTER TABLE org_stripe_customer_mappings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service" ON "public"."org_stripe_customer_mappings" AS PERMISSIVE FOR ALL TO service_role USING (true);
