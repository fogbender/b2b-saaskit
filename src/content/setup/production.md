---
title: "Deploy to Vercel"
needsEnv: ["PROD"]
---

### Configuration and deployment to production

Now that you've got everything running locally, let's configure the production environment and deploy the project to production. For this, we use Vercel (<a href="https://vercel.com" target="_blank">https://vercel.com</a>), a cloud platform for deploying and hosting static sites and serverless functions.

#### Fogbender

1. Create a new Fogbender workspace on <a href="https://fogbender.com/admin/-/workspaces" target="_blank">https://fogbender.com/admin/-/workspaces</a>
2. Copy the new `widgetId`, then save it with `doppler secrets set PUBLIC_FOGBENDER_WIDGET_ID --config prd`
3. Copy the new `secret`, then save it with `doppler secrets set FOGBENDER_SECRET --config prd`

#### Supabase

Note that the Supabase free tier has a limit of 2 projects.

1. Create a new Supabase project and save the new database URL with `doppler secrets set DATABASE_URL --config prd`
2. Run `doppler run --config prd yarn migrate` to initialize the database. You should see your new tables in the <a href="https://app.supabase.com/project/_/editor" target="_blank">Supabase table editor</a>.

#### PropelAuth

Note that the PropelAuth free tier has a limit of 2 projects.

1. Create a new PropelAuth project, then locate "Integrate your product" - "Frontend integration".

1. In the "Test" tab "Primary Frontend Location" change the type to `Vercel` and enter a "Subdomain" (this part is tricky because we haven't deployed to Vercel yet, be creative).

1. Set "Default redirect path after login" to `/app`.

1. Press "Save".

3. Locate the "Integrate your product" - "Integrate your Backend" step.

4. Copy "Auth URL", then save it with `doppler secrets set PUBLIC_AUTH_URL --config prd`.

5. Copy "Public (Verifier) Key", then save it with `doppler secrets set PROPELAUTH_VERIFIER_KEY --config prd`).

6. Click on "Create New API Key" give it a name (e.g. PWF Prod), copy the key, then save it with `doppler secrets set PROPELAUTH_API_KEY --config prd`).

#### Check build

1. Make sure you can still build the project locally with `doppler run --config prd yarn build`.

#### Publish to GitHub, deploy to Vercel

1. Publish your project to GitHub. TODO: How?

2. Link your GitHub project to Vercel. TODO: How?

1. You might need to change "Primary Frontend Location" in PropelAuth to the new Vercel subdomain.

3. Configure Vercel to use production secrets from Doppler by using the <a href="https://www.doppler.com/integrations/vercel" target="_blank">Vercel integration</a>. For additional information, see <a href="https://docs.doppler.com/docs/vercel" target="_blank">https://docs.doppler.com/docs/vercel</a>

#### Astro

1. Open `astro.config.mjs` and change `site` to your new url (e.g. `https://hotdog-catering.vercel.app`).

1. Consider setting `allowRobots` to `false` in `src/pages/robots.txt.ts` if you don't want Google to index your site yet.

1. Redeploy your project to Vercel for changes to take effect.
