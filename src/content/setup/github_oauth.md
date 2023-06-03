---
title: "OAuth login with GitHub (optional)"
needsEnv: ["PUBLIC_AUTH_URL", "PROPELAUTH_VERIFIER_KEY", "PROPELAUTH_API_KEY"]
---

OAuth login can provide your users with a seamless login experience. Google is usually more popular, but GitHub is easier to set up for the purposes of this tutorial.

GitHub would not charge you for using GitHub as an OAuth provider.

1. Open <a href="https://app.propelauth.com">https://app.propelauth.com</a>, in the sidebar, select "Configuration" - "Social Logins", and click on "Sign in with GitHub".

1. Locate "Authorized redirect URIs", this URL is going to be used in the next step (it should look like `https://123456789.propelauthtest.com/github/callback`)

1. Open <a href="https://github.com/settings/developers">https://github.com/settings/developers</a>, click on "New OAuth App", and fill in the form:

   - "Application name" - "Prompts with Friends localhost"
   - "Homepage URL" - `https://localhost:3000`
   - "Authorization callback URL" - paste the value from the previous step

1. Leave the rest of the fields blank and click on "Register application"

1. You should see a new OAuth application created. Click on the "Generate a new client secret" button, then copy "Client ID" (it should look like `1234567890abcdef1234`) and the new "Client secret" (it should look like `1234567890abcdef1234567890abcdef12345678`) to the page from step 1.

1. Click enable and save.

1. You don't need to restart the app or save anything to Doppler, just refresh the login page and you should see a new "Sign in with GitHub" button.
