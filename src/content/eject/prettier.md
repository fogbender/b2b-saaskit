---
title: Removing Prettier
---

It's hard to imagine working on a project without prettier nowadays. But if you don't like it, you can get rid of it in a few pretty simple steps:

- Edit `package.json` to edit "fix" script and remove "fmt" script
- In the terminal, run `rm .prettierrc .github/workflows/prettier.yml`
- In the terminal, run `yarn remove prettier prettier-plugin-tailwindcss` (you can't remove `prettier-plugin-astro` because it's a dependency of Astro)
