### Step 3: PropelAuth

PropelAuth provides end-to-end managed user authentication specializing in B2B use cases. Your users can manage their own accounts and teams. It also includes multiple authentication options (Google, Github, Microsoft, Slack), 2FA, and SAML.

1. Create an account on https://propelauth.com and create a new project. You can skip most of the steps in the setup wizard for now. And switch right to the "Integrate your Frontend" step.

2. Find Auth URL that should look something like `https://123456789.propelauthtest.com`.

3. Now set `PUBLIC_AUTH_URL` to that value. You can use Doppler UI or CLI to do that. If you are using CLI you can run `doppler secrets set PUBLIC_AUTH_URL`.

4. Now restart `doppler run yarn dev` and you should see the next section of the tutorial.
