---
title: Replacing Vercel (service)
---

The two main benefits of Vercel is that it's free to start and its industry-leading DX in terms of deployment ease and deployment speed. However, costs could scale unfavorably as your project grows, which might lead you to consider alternatives. B2B SaaS Kit doesn't rely on any Vercel-specific services, so switching from Vercel is as easy as changing an Astro adapter.

To remove the Vercel adapter, follow these steps:

- `yarn remove @astrojs/vercel`
- Edit `astro.config.mjs` and remove two lines of code:

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

<p class="text-sm pl-4">NOTE that you can use regular Astro without SSR adapters (if you remove the <code class="whitespace-nowrap">output: 'hybrid',</code> line). This can be a good option if you already have your own backend, but the Kit does not currently support such a configuration.</p>

Instead, you can add another Astro SSR adapter from the ones available on https://docs.astro.build/en/guides/server-side-rendering/#adding-an-adapter.

Be careful when switching to non-Node.js runtimes, like Deno Deploy or Cloudflare Workers: since we do not test against other adapters, some of our dependencies may not work.
