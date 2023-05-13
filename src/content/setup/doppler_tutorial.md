---
title: "Get familiar with Doppler"
needsEnv: ["DOPPLER_TUTORIAL"]
---

### Step 2: Get familiar with Doppler

Doppler will help your development in three main ways: manage environment variables and avoid storing them as plaintext, manage developer access to secrets, and manage secrets during deployments.

While we'll only refer to the Doppler CLI in the steps of this tutorial, you have the option of using the web interface as well (or instead). To open the web interface, run `doppler open` on the command line.

1. Run `doppler secrets` to see a list of all your secrets.

2. Next, run `doppler secrets set DOPPLER_TUTORIAL done`. Run `doppler secrets` to make sure that it's set.

3. Restart `doppler run yarn dev` to move to the next section of the tutorial.
