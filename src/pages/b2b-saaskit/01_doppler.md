### Step 1: Run with doppler cli

This project uses Doppler (https://doppler.com) to manage secrets. Getting up and running is pretty easy:

1. Install the Doppler CLI. It allows you to access and manage your secrets from the command line. To install it, follow the instructions on the Doppler website (https://docs.doppler.com/docs/cli). You are done once you installed `gnupg` and `doppler`.

2. Run `doppler login` to authenticate with Doppler, you should create an account if you don't have one already.

3. Run `doppler setup` in the root of your project to connect it to Doppler. And select `dev` as the environment.

4. You will learn more about Doppler in the next sections. The last step at the moment is to restart the project with `doppler run yarn dev`, if everything is set up correctly you will see new instructions here in the browser.
