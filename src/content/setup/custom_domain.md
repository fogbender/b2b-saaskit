---
title: "Set up custom domain"
needsEnv: ["PROD"]
---

### Setting up production configuration with a custom domain (required to make Safari work with PropelAuth)

1. Buy a domain.

#### PropelAuth

1. Go to PropelAuth, select "Going Live" - "Go Live" and in the "Set Domain" field enter your domain name and press green checkmark.

1. Follow the instruction on how to verify your domain (you'll need to have access to domain records to setup TXT and CNAME records).

1. Make sure that you can open https://auth.yourdomain.com.

1. Go to "Integrate your product" - "Frontend integration" and switch to "Prod" tab.

1. Make sure that your "Application URL" is pointing to `www.yourdomain` or `yourdomain` depending on which one you prefer.

1. Set "Default redirect path after login" to `/app`.

1. Press "Save".

1. Locate the "Integrate your product" - "Integrate your Backend" step.

1. Copy "Auth URL", then save it with `doppler secrets set PUBLIC_AUTH_URL --config prd`.

1. Copy "Public (Verifier) Key", then save it with `doppler secrets set PROPELAUTH_VERIFIER_KEY --config prd`).

1. Click on "Create New API Key" give it a name (e.g. PWF Prod), copy the key, then save it with `doppler secrets set PROPELAUTH_API_KEY --config prd`).

#### Vercel

1. Go to Vercel, select your project, then go to "Settings" - "Domains".

1. Enter your domain name and press "Add".

1. Select what domain should be primary (e.g. `www.yourdomain.com`) and which one should be redirected from (e.g. `yourdomain.com`). You can change that later, just make sure that you selected the same primary domain as in PropelAuth ("Application URL").

1. Follow the instructions on how to verify your domain (you'll need to have access to domain records to setup A and CNAME records).

#### Astro

1. Open `astro.config.mjs` and change `site` to your new url (e.g. `https://www.yourdomain.com`).

1. Consider setting `allowRobots` to `false` in `src/pages/robots.txt.ts` if you don't want Google to index your site yet.

1. Redeploy your project to Vercel for changes to take effect.
