---
title: "Secrets management with Doppler"
needsEnv: ["SITE_URL"]
---

Doppler (<a href="https://doppler.com" >doppler.com</a>) will help your development in three main ways: manage environment variables and avoid storing them as plaintext, manage developer access to secrets, and manage secrets during deployments.

Dopper is free for up to 5 users.

Instead of creating `.env` files and storing secrets there, we'll use the Doppler CLI.

Keep in mind that you have the option of using the web interface as well (or instead). To open the web interface, run `doppler open` on the command line.

1. Install the Doppler CLI by following the instructions on <a href="https://docs.doppler.com/docs/cli" >https://docs.doppler.com/docs/cli</a>. Continue once `gnupg` and `doppler` are installed

1. Run `doppler login` to authenticate with Doppler. Create a new account if you don't already have one

1. Next, in the root of the project run `doppler projects create prompts-with-friends` this will create a Doppler project named `prompts-with-friends`

1. After creating a project, connect the current directory with projects `dev` environment with this command `doppler setup -c dev -p prompts-with-friends`

1. Next, run `doppler secrets set SITE_URL http://localhost:3000` - this will set the secret named `SITE_URL` to the value `http://localhost:3000`

1. Run `doppler secrets` to make sure that it's actually set

1. Restart the project with `doppler run yarn dev` (instead of `yarn dev`). If everything worked out, you should see a green checkmark ✅ on this section of the tutorial, with the next section expanded
