---
title: "Configure default OpenAI key for PromptsWithFriends (optional)"
needsEnv: ["OPENAI_API_KEY"]
---

OpenAI (<a href="https://openai.com/">https://openai.com/</a>) is a company that provides an API to generate text, images, and more. We use it to generate responses to prompts in PromptsWithFriends. Each customer of PromptsWithFriends needs their own OpenAI API key. But for an easier onboarding experience, the default key can be set for the whole website, and every user would have 3 free API calls per day.

OpenAI does not offer a free tier, but they do offer a free trial ($5 in free credit that can be used during your first 3 months). This is an optional step since we expect most users to use their own API key and you can use the website even if you don't run the prompt.

1. Open <a href="https://platform.openai.com/account/api-keys">API keys</a> and create a new secret key named "b2b_localhost" and copy it.

1. Save the API key with `doppler secrets set OPENAI_API_KEY`

1. Restart `doppler run yarn dev` to move to the next section of the tutorial
