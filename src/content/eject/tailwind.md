---
title: Removing Tailwind CSS
---

If you don't like Tailwind CSS, you can get rid of it in a few pretty simple steps:

- Remove the line `import '../styles/tailwind.css';` from `src/layouts/Layout.astro`
- In the terminal, run `rm src/styles/tailwind.css tailwind.config.cjs`
- In the terminal, run `yarn remove tailwindcss @tailwindcss/typography`
