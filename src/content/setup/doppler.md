---
title: "Secrets management with Doppler"
needsEnv: ['DOPPLER_PROJECT']

---

### Step 1: Secrets management with Doppler

To avoid storing sensitive strings in our repo or in .env files, we'll use a service called <a href="https://doppler.com" target="_blank">Doppler</a>. Dopper is free for up to 5 users.

1. Install the Doppler CLI by following the instructions on <a href="https://docs.doppler.com/docs/cli" target="_blank">https://docs.doppler.com/docs/cli</a>. Move to next step once once `gnupg` and `doppler` are installed.

2. Run `doppler login` to authenticate with Doppler. Create a new account if you don't already have one.

3. Run `doppler setup` in the root of the project to connect it to Doppler, then select `dev` for environment.

4. Restart the project with `doppler run yarn dev` to move to the next step.
