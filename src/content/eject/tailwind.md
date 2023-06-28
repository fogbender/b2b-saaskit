---
title: Removing Tailwind CSS
---

If you don't like Tailwind CSS, you can get rid of it in a few pretty simple steps:

- Remove the line `import '../styles/tailwind.css';` from `src/layouts/Layout.astro`
- In the terminal, run `rm src/styles/tailwind.css tailwind.config.cjs`
- In the terminal, run `yarn remove tailwindcss @tailwindcss/typography prettier-plugin-tailwindcss`

Keep in mind that you don't have to remove Tailwind completely if you want to get rid of it just for particular pages. One approach we recommend is just to have two different layouts one with Tailwind and one without it. You can read more about advanced Tailwind configurations in [this article](https://fogbender.com/blog/separate-tailwind-config-for-landing).
