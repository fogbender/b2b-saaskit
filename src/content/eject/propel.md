---
title: Replacing PropelAuth (service)
---

We chose PropelAuth because it's basically the only service focused on solving authentication for B2B SaaS companies.

We have a lot of files depending on PropelAuth, so removing it is not easy if you want to reuse our code.

High-level steps:

- Remove dependencies with `yarn remove @propelauth/base-elements @propelauth/node @propelauth/react`
- Remove PropelAuth-specific files, like `rm src/components/propelauth.ts src/lib/propelauth.ts`
- Remove PropelAuth-specific environment variables from `src/t3-env.ts`
- _And replace it with something else_
