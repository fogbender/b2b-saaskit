---
title: "Preview deployment to Vercel"
needsEnv: ["PROD"]
---

Preview deployments are a bit trickier to set up because they are not quite production, but they are also not quite development. The main issue you are going to have is that in PropelAuth you can only configure CORS to accept subdomains of your domain, you can't use `something.vercel.app`.

There are multiple ways of dealing with that, but in this guide we are going to use production values for the preview environment.

#### Doppler

1. In Doppler go to your project, open `prd` and click "Duplicate". Give it a name `prd_preview` and click "Duplicate".
1. Then go to "Integrations" and set up new sync with Vercel. Select "Preview" as "Vercel environment" and "prd_preview" as "Config".

#### PropelAuth

1. In PropelAuth, locate "Integrate your product" - "Frontend integration", then switch to "Test" tab (since you are allowed to set any domain for test environment)

1. Click on "Add additional frontend location" and add `https://vercel.app`, make sure that "Allow any subdomain" is checked. (If you desire more security you would need to add your preview domains one by one after each deployment)

1. Press "Save"

1. Locate the "Integrate your product" - "Integrate your Backend" step

1. Copy "Auth URL", then save it with `doppler secrets set PUBLIC_AUTH_URL --config prd_preview`

1. Copy "Public (Verifier) Key", then save it with `doppler secrets set PROPELAUTH_VERIFIER_KEY --config prd_preview`

1. Click on "Create New API Key" give it a name (e.g. `pwf-preview`), copy the key, then save it with `doppler secrets set PROPELAUTH_API_KEY --config prd_preview`

#### Supabase (option 1, using separate DB)

1. Create a new DB for previews (keep in mind that Supabase only allows you to have only 2 free projects, so be creative or use other options). Configure `DATABASE_URL` with `doppler secrets set DATABASE_URL --config prd_preview`.
1. To run migrations you can use `doppler run --config prd_preview yarn migrate` (keep in mind you will share one DB between multiple environments unless you setup more environments with their own `DATABASE_URL`)

#### Supabase (option 2, using dev DB)

1. Copy DB URL from Development config with `doppler secrets get DATABASE_URL --config dev` (it will print the password in plain text, so make sure you are not in a public place)
1. Set DATABASE_URL with `doppler secrets set DATABASE_URL --config prd_preview` using the value you copied in the previous step.
1. Running migrations in dev config will affect your preview `doppler run --config dev yarn migrate` because they share the same DB.

#### Supabase (option 3, using production DB)

1. you might use production version of DB for previews.
1. Copy DB URL from Production config with `doppler secrets get DATABASE_URL --config prd` (it will print the password in plain text, so make sure you are not in a public place)
1. Set DATABASE_URL with `doppler secrets set DATABASE_URL --config prd_preview` using the value you copied in the previous step.
1. Because you share the same DB for production and preview you have to be careful if your migrations are compatible with your production code. The best option is to only use previews for testing changes that do not affect DB schema.
1. You can also switch your `DATABASE_URL` to other DBs (see option 1 and option 2) to test migrations before applying them to production.
1. And one more option is to design your migrations in a way that is backwards compatible with your production code. Then you can run migrations on the production DB with `doppler run --config prd yarn migrate`. And since previews use the same DB you would be able to see the changes in your preview environment. But keep in mind that your new code should not create data that is not compatible with your production code.

#### Vercel

Now deploy (or re-deploy) a preview and you should be able to log in with your user using "Test" environment in your production PropelAuth project.
