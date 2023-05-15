---
title: "User authentication with PropelAuth"
needsEnv: ["PUBLIC_AUTH_URL", "PROPELAUTH_VERIFIER_KEY", "PROPELAUTH_API_KEY"]
---

PropelAuth (<a href="https://propelauth.com" target="_blank">https://propelauth.com</a>) provides end-to-end managed user authentication. PropelAuth is a great fit for the B2B SaaS Kit because it ships with organization management features, enabling your users to create teams and manage membership.

PropelAuth is free up to 1000 monthly active users.

1. Create an account on <a href="https://propelauth.com" target="_blank">https://propelauth.com</a>, create a new project (e.g. `pwf-dev`), in the sidebar select "Integrate your product" - "Frontend integration"

1. In the "Test" tab "Primary Frontend Location" should be `https://localhost:3000`. Set "Default redirect path after login" to `/app`

1. Locate the "Integrate your product" - "Integrate your Backend" step

1. Locate and copy the value of "Auth URL" - it should like like `https://123456789.propelauthtest.com`, then run `doppler secrets set PUBLIC_AUTH_URL` and paste the value

NOTE: to exit Doppler CLI after setting the value, type Enter twice, then type "." (period). Run `doppler secrets` to make sure the value of PUBLIC_AUTH_URL looks good - set it again (step 2 above) if you see any extra newlines

3. Copy "Public (Verifier) Key" and set `PROPELAUTH_VERIFIER_KEY` to that value

4. Click on "Create New API Key" give it a name "b2b localhost" and copy the key, set `PROPELAUTH_API_KEY` to that value

5. Restart `doppler run yarn dev` to move to the next section of the tutorial
