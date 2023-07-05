---
title: Removing kit assets (recommended)
---

## The landing page

We've got some landing page complexity, since we're using the same codebase for three websites: https://b2bsaaskit.com, https://PromptsWithFriends.com, and the instructons on https://localhost:3000.

To replace all this with a single landing page:

- `rm src/assets/free.svg src/assets/b2b7.svg`
- `rm src/components/landing/Prod.astro src/components/landing/B2B.astro src/components/landing/Dev.astro`
- Replace `src/pages/index.astro` with:

```
---
import Layout from '../layouts/Layout.astro';

export const prerender = true;
---

<Layout title="Landing">
	<main class="container mx-auto my-8">
		<h1 class="text-4xl">Landing!</h1>
	</main>
</Layout>
```

## Favicon

- Replace `public/favicon.ico` with your `.ico` file
- In `src/layouts/Layout.astro`, update `<link rel="icon" type="image/svg+xml" href={pwf} />` with your .ico file

## Faq page

- `rm src/pages/faq.astro src/components/landing/faq.astro`

## Setup and Eject pages

- `rm -r src/pages/setup src/pages/eject`
- `rm -r src/content/`

## Demos

- `rm -r src/pages/demo`
- `rm -r src/pages/survey src/lib/trpc/routers/surveys.ts src/components/survey/Survey.tsx`

TODO
