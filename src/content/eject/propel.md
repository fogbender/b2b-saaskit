---
title: Replacing PropelAuth (service)
---

We chose PropelAuth because it's basically the only service that is focused on solving auth for B2B SaaS companies.

We have a lot of files depending on PropelAuth, so removing it is not as easy if you want to reuse our code.

High-level steps:

- remove dependencies with `yarn remove @propelauth/base-elements @propelauth/node @propelauth/react`
- remove Propel-specific files like `rm src/components/propelauth.ts src/lib/propelauth.ts`
- remove Propel-specific environment variables from `src/t3-env.ts`
- _and replace it with something else_

We are considering having example projects where we use different auth providers or use an auth framework (instead of a service) if there's going to be enough demand for it.
