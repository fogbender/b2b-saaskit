### Step 1: Secrets management with Doppler

To avoid storing sensitive strings in our repo or in .env files, we're going to use a product called Doppler (https://doppler.com). Dopper is free for up to 5 users.

1. Install the Doppler CLI by following the instructions on https://docs.doppler.com/docs/cli. Move to next step once once `gnupg` and `doppler` are installed.

2. Run `doppler login` to authenticate with Doppler. Create a new account if you don't already have one.

3. Run `doppler setup` in the root of the project to connect it to Doppler, then select `dev` for environment.

4. Restart the project with `doppler run yarn dev` to move to the next step.
