---
title: Replacing Vercel (service)
---

The main two benefits of Vercel are that it's free to start and it provides you with industry-leading DX in terms of deployment ease and deployment speed. But costs could scale unfavorably as the project grows and you might consider other alternatives. We don't rely on any Vercel-specific services, so switching from Vercel is as easy as changing an Astro adapter.

To remove the Vercel adapter follow these steps:

- `yarn remove @astrojs/vercel`
- edit the file `astro.config.mjs` and remove two lines of code:

```diff
import react from '@astrojs/react';
- import vercel from '@astrojs/vercel/serverless';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	integrations: [react()],
	output: 'hybrid',
-	adapter: vercel(),
	// eslint-disable-next-line no-undef
	site: process.env.SITE_URL,
```

<p class="text-sm pl-4">NOTE that you can use regular Astro without SSR adapters (if you remove the <code class="whitespace-nowrap">output: 'hybrid',</code> line). That could be a good option if you already have your own backend, but the Kit does not support that configuration.</p>

So instead you can add another Astro adapter from available SSR adapters https://docs.astro.build/en/guides/server-side-rendering/#adding-an-adapter

Be careful when switching to non-Node.js runtimes, like Deno Deploy or Cloudflare Workers, because we do not test other adapters, and some of our dependencies might not work in those environments.
