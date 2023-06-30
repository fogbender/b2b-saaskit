---
title: "Preview deployment to Vercel"
needsEnv: ["PROD"]
---

Preview deployments are tricky to configure because they are not quite production, but also not quite development. The main issue is that PropelAuth only lets you configure CORS to accept subdomains for your own domain - you can't use `something.vercel.app`.

There are multiple ways of dealing with this, but in this guide we're going to use production values for the preview environment.

#### Doppler

1. In Doppler, find your project, open `prd` and click "Duplicate". Give it a name, like `prd_preview`, and click "Duplicate"
1. Then, go to "Integrations" and set up a new sync with Vercel. Select "Preview" for "Vercel environment" and "prd_preview" as "Config"

#### PropelAuth

1. In PropelAuth, locate "Integrate your product" - "Frontend Integration", then switch to the "Test" tab (because PropelAuth lets us set any domain for test environments)

1. Click on "Add additional frontend location" and add `https://vercel.app`. Make sure that "Allow any subdomain" is checked. (If you need greater security, you'd need to add your preview domains one by one after each deployment)

1. Press "Save"

1. Locate "Integrate your product" - "Backend Integration"

1. Copy "Auth URL", then save it with `doppler secrets set PUBLIC_AUTH_URL --config prd_preview`

1. Copy "Public (Verifier) Key", then save it with `doppler secrets set PROPELAUTH_VERIFIER_KEY --config prd_preview`

1. Click on "Create New API Key", give it a name (e.g. `pwf_preview`), copy the key, then save it with `doppler secrets set PROPELAUTH_API_KEY --config prd_preview`

#### Supabase - Option 1, using a separate DB

1. Create a new DB. Keep in mind that Supabase only allows two free projects - you won't be able to use the same free Supabase account for separate development, preview, and production databases. Configure `DATABASE_URL` with `doppler secrets set DATABASE_URL --config prd_preview`

1. To run migrations, use `doppler run --config prd_preview yarn migrate`

#### Supabase - Option 2, using the development DB

1. Copy `DATABASE_URL` from your development config with `doppler secrets get DATABASE_URL --config dev`, copy the value

1. Set `DATABASE_URL` with `doppler secrets set DATABASE_URL --config prd_preview` to the value from the previous step

1. Run migrations with `doppler run --config dev yarn migrate` - `--config dev` works, because development and preview environments share the same database

#### Supabase - Option 3, using the production DB

1. Copy `DATABASE_URL` from your production config with `doppler secrets get DATABASE_URL --config prd`, copy the value

1. Set `DATABASE_URL` with `doppler secrets set DATABASE_URL --config prd_preview` to the value from the previous step

1. Since production and preview environments share the same database, you have to ensure your migrations are compatible with production code. The safest option is to use the preview environment to test changes not involving changes to the database schema

#### Vercel

Assuming you're using GitHub with Vercel, push to a branch and navigate to the preview site by clicking the "View deployment" button in GitHub - you'll now be able to login with a user from the "Test" environment in your production PropelAuth project.
