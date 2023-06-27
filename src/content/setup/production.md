---
title: "Production deployment to Vercel"
needsEnv: ["PROD"]
---

At this point, Prompts with Friends is fully configured on your machine! You can check it out here: <a href="http://localhost:3000/app" >http://localhost:3000/app</a>.

Except for the data, you should see the exact same app we have running on <a href="https://promptswithfirends.com/app" >https://promptswithfirends.com/app</a>.

A great next step is to learn how to deploy your version of the app to production. For this, we'll be using Vercel (<a href="https://vercel.com" >https://vercel.com</a>), a cloud platform for deploying and hosting static sites and serverless functions.

#### Fogbender (optional)

1. Create a new Fogbender workspace on <a href="https://fogbender.com/admin/-/workspaces" >https://fogbender.com/admin/-/workspaces</a>

2. Copy the new `widgetId`, then save it with `doppler secrets set PUBLIC_FOGBENDER_WIDGET_ID --config prd`
3. Copy the new `secret`, then save it with `doppler secrets set FOGBENDER_SECRET --config prd`

#### PropelAuth

1. Create a new PropelAuth project (e.g., `pwf_prod`), then locate "Integrate your product" - "Frontend integration".

1. Under "Test" / "Primary Frontend Location", change **Type** to `Vercel`, then come up with a value for "Subdomain" - this can be any string (e.g., `pwf-2023-may-13-435pm`), as long as `https://[subdomain].vercel.app` resolves to 404: NOT_FOUND.

1. Set "Default redirect path after login" to `/app`

1. Press "Save"

1. [Optional] Locate "Configuration" - "User Schema" in the sidebar. Enable "Profile Picture" (for nicer avatars) and "Name" (to show name instead of email)

1. Locate the "Integrate your product" - "Backend integration" page

1. Copy "Auth URL", then save it with `doppler secrets set PUBLIC_AUTH_URL --config prd`

1. Copy "Public (Verifier) Key", then save it with `doppler secrets set PROPELAUTH_VERIFIER_KEY --config prd`

1. Click on "Create New API Key", give the key a name (e.g., `pwf-prod`), copy the key, then save it with `doppler secrets set PROPELAUTH_API_KEY --config prd`

#### Supabase

Note that the Supabase free tier has a limit of 2 projects.

1. Create a new Supabase project and save the new database URL with `doppler secrets set DATABASE_URL --config prd`
2. Run `doppler run --config prd yarn migrate` to initialize the database. You should see your new tables in the <a href="https://app.supabase.com/project/_/editor" >Supabase table editor</a>.

#### PropelAuth GitHub OAuth (optional)

1. In the sidebar, select "Configuration" - "Signup / Login", and click on "Sign in with GitHub".

1. Locate "Authorized redirect URIs", this URL is going to be used in the next step.

1. Open <a href="https://github.com/settings/developers">https://github.com/settings/developers</a>, click on "New OAuth App", and fill in the form:

   - "Application name" - "Prompts with Friends"
   - "Homepage URL" - `https://[subdomain].vercel.app`
   - "Authorization callback URL" - paste the value from the previous step

1. Leave the rest of the fields blank and click on "Register application"

1. You should see a new OAuth application created. Click on the "Generate a new client secret" button, then copy "Client ID" and the new "Client secret" to the page from step 1.

1. Click enable and save.

#### Posthog (optional)

1. Since free PostHog is limited to only one project on a free tier, use the same values for production and the local version.

1. Get existing `PUBLIC_POSTHOG_KEY` with `doppler secrets get PUBLIC_POSTHOG_KEY`

1. Set it for production with `doppler secrets set PUBLIC_POSTHOG_KEY --config prd`

#### OpenAI (optional)

1. Create a new API key on <a href="https://platform.openai.com/account/api-keys">https://platform.openai.com/account/api-keys</a> named "b2b_prod", then copy it

1. Save it with `doppler secrets set OPENAI_API_KEY --config prd`

#### Stripe (optional)

1. Navigate to https://dashboard.stripe.com/apikeys and make sure you're in live mode ("Test mode" off)

1. Locate "Secret key" and store it with `doppler secrets set STRIPE_SECRET_KEY --config prd`

1. Navigate to https://dashboard.stripe.com/products (still in live mode)

1. Create a product of type "subscription" and store its API ID with `doppler secrets set STRIPE_PRICE_ID --config prd`

#### Check build

1. Make sure you can still build the project locally with `doppler run --config prd yarn build`

#### Publish to GitHub, deploy to Vercel

1. Publish your project to GitHub

   - Create a new project on GitHub, copy the new URL
   - Change our origin URL to yours with `git remote set-url origin NEW_URL`
   - Add and commit your changes (if any) with `git add . && git commit -m "my updates"`
   - Push to GitHub with `git push -u origin main`

2. Link your GitHub project to Vercel

   - See https://vercel.com/docs/concepts/deployments/git/vercel-for-github

3. Note that if your Vercel subdomain ended up being different from the one used in the 2nd step of PropelAuth settings above, make sure to update "Primary Frontend Location" in PropelAuth to your actual Vercel subdomain

4. Configure Vercel to use production secrets from Doppler by using the <a href="https://www.doppler.com/integrations/vercel" >Vercel integration</a>. For additional information, see <a href="https://docs.doppler.com/docs/vercel">https://docs.doppler.com/docs/vercel</a>

#### Astro

1. Open `astro.config.mjs` and change `site` to your new url (e.g., `https://hotdog-catering.vercel.app`)

1. Consider setting `allowRobots` to `false` in `src/pages/robots.txt.ts` in case you're not ready for search engines to index your site

1. Redeploy your project to Vercel for the changes to take effect
