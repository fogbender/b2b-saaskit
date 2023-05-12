### Step 3: User authentication with PropelAuth

PropelAuth <a href="https://propelauth.com" target="_blank">https://propelauth.com</a> provides end-to-end managed user authentication. PropelAuth is a great fit for the B2B SaaS Kit because it ships with organization management features, enabling your users to create teams and manage membership.

PropelAuth is free up to 1000 monthly active users.

1. Create an account on <a href="https://propelauth.com" target="_blank">https://propelauth.com</a>, create a new project, click on "(4) Integrate your Frontend", click on "View".

2. Locate and copy the value of "Auth URL" - it should like like `https://123456789.propelauthtest.com`, then run `doppler secrets set PUBLIC_AUTH_URL` and paste the value.

NOTE: to exit Doppler CLI after setting the value, type Shift+Enter twice, then type "." (period). Run `doppler secrets` to make sure the value of PUBLIC_AUTH_URL looks good - set it again (step 2 above) if you see any extra newlines.

3. Restart `doppler run yarn dev` to move to the next section of the tutorial.
