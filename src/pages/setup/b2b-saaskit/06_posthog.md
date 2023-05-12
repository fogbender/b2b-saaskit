### Step 6: Event tracking with PostHog

PostHog (<a href="https://posthog.com/" target="_blank">https://posthog.com/</a>) is an open-source product analytics platform that helps engineers understand user behavior, develop and test improvements, and release changes to make their products more successful. It provides a suite of tools for collecting, visualizing, and analyzing user data, as well as for A/B testing and feature flagging.

PostHog is free for 1 project and up to 1 million events per month.

1. Open the <a href="https://app.posthog.com/project/settings#project-variables" target="_blank">Project settings</a> and copy the `Project API Key`, it will look something like `phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.

1. Run `doppler secrets set PUBLIC_POSTHOG_KEY` and paste the key as the value.

1. Heads up, because you are limited to just one project, you can go ahead and use the same value for your production configuration as well `doppler secrets set --config prd PUBLIC_POSTHOG_KEY` and paste the key as the value.

1. Restart `doppler run yarn dev` to move to the next section of the tutorial.
