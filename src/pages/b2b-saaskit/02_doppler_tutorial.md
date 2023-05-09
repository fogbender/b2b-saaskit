### Step 2: Get familiar with Doppler

Doppler allows you to manage your secrets in a secure way. It is a great tool to manage your secrets in a team and to keep them in sync between your local development environment and your production environment. You can easily oversee who has access to which secrets and revoke access if necessary. Also integrations allow you to sync changes from Doppler to your production environment like Vercel (we are going to cover this later).

1. You have option to manage your keys either with the CLI or the web interface. If you ever get lost you can run `doppler open` to open the web interface.

2. But for the purposes of this turorial we are going to cover how to use CLI. First `doppler secrets` will show you all the secrets you have access to. You can use config option to run commands for different environments `doppler secrets --config dev` or `doppler secrets --config prd`.

3. Now set `DOPPLER_TUTORIAL` to `done` so that you can continue to the new section by running this command `doppler secrets set DOPPLER_TUTORIAL done` and `doppler secrets set DOPPLER_TUTORIAL ready --config prd`, you can verify that it worked by running `doppler secrets get DOPPLER_TUTORIAL` and `doppler secrets get DOPPLER_TUTORIAL --config prd`.

4. Now restart `doppler run yarn dev` and you should see the next section of the tutorial.
