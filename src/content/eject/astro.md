---
title: Replacing Astro (hard)
---

It's technically possible to replace Astro with other meta-frameworks. But we fill like that's the best tool that can adapt to any team.

Is your team all in on HTML first and doesn't like to write a lot of javascript? Look at the `/setup` and `/eject` pages that ship almost no JS, and even work with JS disabled.

Is your team experienced with simple SPA apps like CRA or Vite? Look at the `/survey` page that has no SSR, no hassle with hydration, no server bills.

If your team worked with SSR frameworks before they can build modern apps with client-side routing, data fetching, and more. That's what we have on our `/`app` page.

If you feel adventurous and want to play with server components, keep in mind that Astro server components do a lot of what is possible in RSCs already, and they are on track to support more in the future.

We do not have plans to support other meta-frameworks, but we would be happy to see this template ported to other frameworks. If you do so, please let us know!
