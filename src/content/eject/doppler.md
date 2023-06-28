---
title: Removing Doppler (service)
---

It's pretty easy to remove Doppler from your project if you don't want to use it:

- Download secrets `doppler secrets download --format env --no-file > .env.local` or manually fill in `.env.local` with your secrets
- Open `package.json`, change the "full:check" script to "yarn fix && yarn ci:check"
- Set production secrets in your hosting provider
