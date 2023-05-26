---
title: Removing kit assets
---

## The landing page

We've got some landing page complexity here, since we're using the same codebase for three websites: https://b2bsaaskit.com, https://PromptsWithFriends.com, and the instructons on https://localhost:3000.

To replace our mess with a single landing page, do this:

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

## Environment variables checker

- `rm src/pages/app/_envCheck.ts`
- Remove `await import('./_envCheck');` from files in `src/pages/app/`

## Demos

- `rm -r src/pages/demo`

WIP
