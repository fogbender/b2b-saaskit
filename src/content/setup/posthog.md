---
title: "Product analytics with PostHog (optional)"
needsEnv: ['PUBLIC_POSTHOG_KEY']

---

### Step 6: Product analytics with PostHog

PostHog (<a href="https://posthog.com/" target="_blank">https://posthog.com/</a>) is an open-source product analytics platform that helps engineers understand user behavior.

PostHog is free for 1 project and up to 1 million events per month.

1. Open <a href="https://app.posthog.com/project/settings#project-variables" target="_blank">Project settings</a> and copy the `Project API Key`, it will look something like `phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.

1. Save the project API key with `doppler secrets set PUBLIC_POSTHOG_KEY`.

1. Since free PostHog is limited to only one project, let's save the same values for production with `doppler secrets set --config prd PUBLIC_POSTHOG_KEY`.

1. Restart `doppler run yarn dev` to move to the next section of the tutorial.
