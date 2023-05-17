---
title: B2B SaasKit (WIP)
---

Files that are only used to make the template nicer for a newcomer, but are not needed for the actual project.

#### Landing page

That's where the initial instructions for localhost and landing pages (promptswithfriends.com and b2bsaaskit.com) are located. You can remove it and replace it with your own landing page.

- `rm src/assets/free.svg src/assets/b2b7.svg`
- `rm src/components/landing/Prod.astro src/components/landing/B2B.astro src/components/landing/Dev.astro`
- replace `src/pages/index.astro` with:

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

#### Favicon

- replace `public/favicon.ico` with your `.ico` file
- update `<link rel="icon" type="image/svg+xml" href={pwf} />` with your icon in `src/layouts/Layout.astro`

#### Environment variables checker

- `rm src/pages/app/_envCheck.ts`
- remove `await import('./_envCheck');` from files in `src/pages/app/`

WIP
