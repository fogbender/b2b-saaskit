---
title: "Configure default OpenAI key for PromptsWithFriends (optional)"
needsEnv: ["OPENAI_API_KEY"]
---

OpenAI (<a href="https://openai.com/">https://openai.com/</a>) provides APIs for generating text and images.

<a href="https://promptswithfriends.com">_Prompts with Friends_</a>, our sample B2B app, uses OpenAI to return responses to prompts and requires each customer organization to provide its own OpenAI API key. However, to ease onboarding, you can specify your OpenAI API key to offer each user 3 free API calls per day.

OpenAI does not come with a free tier, but all new accounts get a $5 credit that must be used during the initial 3 months.

1. Open <a href="https://platform.openai.com/account/api-keys">API keys</a> and create a new API key named "b2b_localhost", then copy the key

1. Save the API key with `doppler secrets set OPENAI_API_KEY`

1. Restart `doppler run yarn dev` to move to the next section of the tutorial
