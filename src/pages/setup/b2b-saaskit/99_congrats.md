### Everything is configured!

Now you have finished the tutorial you should have everything running locally. Good next step would be to deploy your project to Vercel. You can do that by following these steps:

1. First you need to configure production versions of your project (keep in mind that free tier of PropelAuth and Supabase limit you to 2 projects).
1. Create new Forbender workspace for production and set `PUBLIC_FOGBENDER_WIDGET_ID` and `FOGBENDER_SECRET`.
   You can use Doppler UI (`doppler open --config prd`) or CLI to do that (`doppler secrets set PUBLIC_FOGBENDER_WIDGET_ID --config prd`, `doppler secrets set FOGBENDER_SECRET --config prd`).
1. Create new Supabase project for production and set `DATABASE_URL`.
   You can use Doppler UI (`doppler open --config prd`) or CLI to do that (`doppler secrets set DATABASE_URL --config prd`).
1. Run migrations with `doppler run --config prd yarn migrate` to initialize the database, you should be able to see new tables created in [supabase table editor](https://app.supabase.com/project/_/editor).
1. Create new PropelAuth project and switch to "Integrate your product" - "Frontend integration".
   Set "Primary Frontend Location" to URL you are going to use in production.

1. Now switch to the "Integrate your Backend" step ("Integrate your product" - "Backend integration" in the sidebar).
   Then copy "Auth URL" and set `PUBLIC_AUTH_URL` to that value.
   You can use Doppler UI (`doppler open --config prd`) or CLI to do that (`doppler secrets set PUBLIC_AUTH_URL --config prd`).
1. Copy "Public (Verifier) Key" and set `PROPELAUTH_VERIFIER_KEY` to that value.
   You can use Doppler UI (`doppler open --config prd`) or CLI to do that (`doppler secrets set PROPELAUTH_VERIFIER_KEY --config prd`).
1. Click on "Create New API Key" give it a name and copy the key, set `PROPELAUTH_API_KEY` to that value.
   You can use Doppler UI (`doppler open --config prd`) or CLI to do that (`doppler secrets set PROPELAUTH_API_KEY --config prd`).
1. Make sure that you can still build the project locally with `doppler run --config prd yarn build`.
1. Publish your project to github.
1. Link your github project to Vercel.
1. Configure Vercel to use production secrets from Doppler using [Vercel integration](https://www.doppler.com/integrations/vercel) also check out [the docs here](https://docs.doppler.com/docs/vercel).
1. Deploy your project to Vercel.
