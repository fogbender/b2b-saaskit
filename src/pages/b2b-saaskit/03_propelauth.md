### Step 3: PropelAuth

PropelAuth provides end-to-end managed user authentication specializing in B2B use cases. Your users can manage their own accounts and teams. It also includes multiple authentication options (Google, Github, Microsoft, Slack), 2FA, and SAML.

1. Create an account on https://propelauth.com and create a new project called "b2b localhost". You can skip most of the steps in the setup wizard for now. And switch right to the "Integrate your Frontend" step ("Integrate your product" - "Frontend integration" in the sidebar)

1. Set "Primary Frontend Location" type to "localhost" and set the "Your application's primary location" to "http://localhost:3000".

1. Now switch to the "Integrate your Backend" step ("Integrate your product" - "Backend integration" in the sidebar).

1. Then copy "Auth URL" that should look something like `https://123456789.propelauthtest.com`.
   Set `PUBLIC_AUTH_URL` to that value. You can use Doppler UI or CLI to do that. To open UI you can run `doppler open`. If you are using CLI you can run `doppler secrets set PUBLIC_AUTH_URL [value]` (pro tip, to makes sure that values are not stored in your shell history you can run `doppler secrets set PUBLIC_AUTH_URL` without specifying the value, then just follow the instructions that the command will print out).

1. Copy "Public (Verifier) Key" and set `PROPELAUTH_VERIFIER_KEY` to that value.
   You can use Doppler UI (`doppler open`) or CLI to do that (`doppler secrets set PROPELAUTH_VERIFIER_KEY`).

1. Click on "Create New API Key" give it a name "b2b localhost" and copy the key, set `PROPELAUTH_API_KEY` to that value.
   You can use Doppler UI (`doppler open`) or CLI to do that (`doppler secrets set PROPELAUTH_API_KEY`).

1. Now restart `doppler run yarn dev` and you should see the next section of the tutorial.
