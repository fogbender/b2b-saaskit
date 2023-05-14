---
title: "Secrets management with Doppler"
needsEnv: ["SITE_URL"]
---

Doppler (<a href="https://doppler.com" target="_blank">doppler.com</a>) will help your development in three main ways: manage environment variables and avoid storing them as plaintext, manage developer access to secrets, and manage secrets during deployments.
If you ever followed a tutorial like this you might be expecting to create a `.env` file and store secrets there.
But instead, we are going to use Doppler CLI in the steps of the tutorial, keep in mind that you have the option of using the web interface as well (or instead). To open the web interface, run `doppler open` on the command line.

Dopper is free for up to 5 users.

1. Install the Doppler CLI by following the instructions on <a href="https://docs.doppler.com/docs/cli" target="_blank">https://docs.doppler.com/docs/cli</a>. Move to next step once `gnupg` and `doppler` are installed.

1. Run `doppler login` to authenticate with Doppler. Create a new account if you don't already have one.

1. Run `doppler setup` in the root of the project to connect it to Doppler, then select `dev` for environment.

1. Next, run `doppler secrets set SITE_URL http://localhost:3000` this will set the secret named `SITE_URL` to the value `http://localhost:3000`.

1. Run `doppler secrets` to make sure that it's set.

1. Restart the project with `doppler run yarn dev` (instead of `yarn dev`). If everything went correctly you would see a green checkmark ✅ in this section and you will be automatically moved to the next section of the tutorial.
