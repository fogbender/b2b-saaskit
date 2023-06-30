---
title: Removing Prettier (easy)
---

These days, it's pretty hard to imagine working on a project without [Prettier](https://prettier.io/)! That said, if you're not a fan, you can get rid of it in a few pretty simple steps:

- Open `package.json`, change the "fix" script to "yarn lint:fix,", remove the "fmt" script
- In the terminal, run `rm .prettierrc .github/workflows/prettier.yml`
- In the terminal, run `yarn remove prettier prettier-plugin-tailwindcss` (you can't remove `prettier-plugin-astro` because it's a dependency of Astro)
