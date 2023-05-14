---
title: "Custom domain configuration"
needsEnv: ["PROD"]
---

Note that a custom domain is required for making PropelAuth work with Safari.

1. Buy a domain name
   - A good place to search for domain names is <a href="https://domainr.com/" target="_blank">https://domainr.com/</a>

#### Vercel

1. Go to Vercel, select your project, then locate "Settings" - "Domains"

1. Enter your domain name and press "Add"

1. Select your primary domain (e.g., `www.yourdomain.com`) and the redirect (e.g., `yourdomain.com`)

1. Follow domain verification instructions. Note that you will need access to your domain name's DNS to configure TXT and CNAME records

#### PropelAuth

1. In PropelAuth, locate "Going Live" - "Go Live". Enter your domain name under "Set Domain", then press the green checkmark

1. Follow domain verification instructions. Note that you will need access to your domain name's DNS to configure TXT and CNAME records

1. Make sure you can open https://auth.yourdomain.com

1. Locate "Integrate your product" - "Frontend integration", then switch to "Prod" tab

1. Make sure your "Application URL" is the same as the primary domain in step 2 of Vercel configuration above

1. Set "Default redirect path after login" to `/app`

1. Press "Save"

1. Locate the "Integrate your product" - "Integrate your Backend" step

1. Copy "Auth URL", then save it with `doppler secrets set PUBLIC_AUTH_URL --config prd`

1. Copy "Public (Verifier) Key", then save it with `doppler secrets set PROPELAUTH_VERIFIER_KEY --config prd`

1. Click on "Create New API Key" give it a name (e.g. `pwf-prod-custom-domain`), copy the key, then save it with `doppler secrets set PROPELAUTH_API_KEY --config prd`

#### Astro

1. Open `astro.config.mjs` and change `site` to your primary domain

1. Consider setting `allowRobots` to `false` in `src/pages/robots.txt.ts` in case you're not ready for search engines to index your site

1. Redeploy your project to Vercel for the changes to take effect
