---
title: "User authentication with GitHub (optional)"
needsEnv: ["PUBLIC_AUTH_URL", "PROPELAUTH_VERIFIER_KEY", "PROPELAUTH_API_KEY"]
---

By default, _Prompts with Friends_ offers email-based user authentication. An alternative approach is to allow users to sign up and sign in with third-party services like Google, Microsoft, GitHub, and so on, via a mechanism called "OAuth". In the context of OAuth, a third-party service used for authentication is called an "OAuth provider".

In this step, we'll configure authentication with GitHub. Using GitHub as an OAuth provider is free to you and your users.

1. Open <a href="https://app.propelauth.com">https://app.propelauth.com</a>, in the sidebar, select "Configuration" - "Social Logins", then click on "Sign in with GitHub"

1. Locate "Authorized redirect URIs" - this URL will be used in the next step (it should similar to `https://123456789.propelauthtest.com/github/callback`)

1. Open <a href="https://github.com/settings/developers">https://github.com/settings/developers</a>, click on "New OAuth App" or "Register a new application", and fill in the form:

   - Application name: "Prompts with Friends localhost"
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: paste the Authorized redirect URL value from the previous step

1. Leave the rest of the fields blank and click on "Register application"

1. You should see a page with "Application created successfully" banner on top. Click on the "Generate a new client secret" button, then copy "Client ID" and the new "Client secret" to the PropelAuth configuration page from step 1

1. In PropelAuth, switch "Enabled?" to "ENABLED", then click "Save"

1. You don't need to restart the app or save anything to Doppler, just refresh the login page and you should see a new "Sign in with GitHub" button
