![wink](https://github.com/fogbender/b2b-saaskit/assets/41166/4f00bef4-8db5-4568-9fe5-bcbfe08619a5)

# Welcome to the B2B SaaS Kit!

The B2B SaaS Kit is an open-source springboard for developers looking to quickly stand up a SaaS product where the customer can be a team of users (i.e., a business).

The kit uses TypeScript, Astro, React, Tailwind CSS, and a number of third-party services that take care of essential, yet peripheral requirements, such as secrets management, user authentication, a database, product analytics, customer support, payments, and deployment infrastructure.

The kit is designed with two primary goals in mind:

1. Start with a fully-functional, relatively complex application. Then, modify it to become your own product.

2. You should be able to build an app to validate your idea for the cost of a domain name - all the third-party services used by the kit offer meaningful free-forever starter plans.

# Why "B2B"?

"B2B" means "business-to-business". In the simplest terms, a B2B product is a product where post-signup, a user can create an organization, invite others, and do something as a team.

B2B companies are fairly common - for example, over 40% of <a href="https://www.ycombinator.com/companies" >Y Combinator-funded startups</a> self-identify as B2B - but B2B-specific starter kits appear to be quite rare, hence this effort.

## What's in the kit?

### Core

[<img src="public/readme-images/Astro.png" width="200" />](https://astro.build) &nbsp;&nbsp; [<img src="public/readme-images/React.png" width="200" />](https://react.dev) &nbsp;&nbsp; [<img src="public/readme-images/TailwindCSS.png" width="200" />](https://tailwindcss.com)

### Required third-party SaaS

[<img src="public/readme-images/Doppler.png" width="200" />](https://doppler.com) &nbsp;&nbsp; [<img src="public/readme-images/Supabase.png" width="200" />](https://supabase.com) &nbsp;&nbsp; [<img src="public/readme-images/PropelAuth.png" width="200" />](https://propelauth.com)

### Optional third-party SaaS

[<img src="public/readme-images/Stripe.png" width="200" />](https://stripe.com) &nbsp;&nbsp; [<img src="public/readme-images/Vercel.png" width="200" />](https://vercel.com) &nbsp;&nbsp; [<img src="public/readme-images/Fogbender.png" width="200" />](https://fogbender.com) &nbsp;&nbsp; [<img src="public/readme-images/PostHog.png" width="200" />](https://posthog.com)

### Also featuring

[tRPC](https://trpc.io/)

[Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)

[Prettier](https://prettier.io/)

[ESLint](https://eslint.org/)

[GitHub](https://github.com)

# Get started

### High-level plan

- First, check out https://PromptsWithFriends.com - it's an example app built with this kit. _Prompts with Friends_ is a way to collaborate on GPT prompts with others

- Next, get your own copy of _Prompts with Friends_ running locally on your machine

- Then, learn how to deploy your version to production

- Lastly, build your own product by modifying the app

### Get it running locally

1. Install prerequisites

   - Node.js 18

2. Clone repo, start app

```
git clone git@github.com:fogbender/b2b-saaskit.git
cd b2b-saaskit
corepack enable
corepack prepare yarn@1.22.19 --activate
yarn
yarn dev
```

3. Open http://localhost:3000 in a browser tab - you should see a page titled "Welcome to Prompts with Friends"

4. You'll find detailed configuration instructions on http://localhost:3000/setup. Once you're here -

<img width="819" alt="image" src="https://github.com/fogbender/b2b-saaskit/assets/41166/a77dcb91-7384-4c02-93ab-bc1b1977bc1c">

\- you should be able to have a working copy of _Prompts with Friends_ running on http://localhost:3000/app

### Deploy to production

Please refer to section `9. Production deployment to Vercel` of the [setup guide](http://promptswithfriends.com/setup)

# Working with the codebase

### DB migrations with Drizzle

We're using Drizzle Kit to manage database migrations in B2B SaaS Kit. For details on Drizzle, see https://orm.drizzle.team/kit-docs/overview.

Another popular option is [Prisma](https://www.prisma.io/docs/guides/migrate/developing-with-prisma-migrate) - if you'd like to use Prisma instead of Drizzle and need help, please get in touch with us.

<details>
<summary>Expand</summary>

#### Example: create a new table

First, you'd have to make a few changes in `src/db/schema.ts`. The changes you make will only affect your TypeScript code, not the actual table data.

```ts
export const example = pgTable("example", {
  exampleId: text("id").primaryKey(),
  value: integer("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

If you try to access the `example` table, you'll get a runtime error. To fix this, you have to run a "migration", which applies a set of updates - which may include some combination of schema and data changes - to the database.

Drizzle migrations happen in two steps: the first step generates a migration file, the second step applies the migration to the database.

To generate a migration file, run

```sh
doppler run yarn drizzle-kit generate:pg
```

This will generate a file called something like `src/db/migration/1234_xyz.sql`. Under normal circumstances, you wouldn't have to worry about this file - it will contain an auto-generated set of SQL statements needed to apply the changes expressed in your `schema.ts` to the database. However, since we're using Supabase Postgres, we have to take care of [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security) policies when creating new tables.

To do this, open the migration file and add the following to end, making sure to change `example` to the table name you're using:

```sql
ALTER TABLE example ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service" ON "public"."example" AS PERMISSIVE FOR ALL TO service_role USING (true);
```

Finally, run the migration:

```sh
doppler run yarn migrate
```

If you open your Postgres console (e.g., Supabase or psql), you'll see the new table.

Migrating your development database will not migrate the production one. To migrate production, run `migrate` with production configuration:

```sh
doppler run yarn migrate --config prd
```

</details>

### tRPC: Type-safe remote calls

We settled on [tRPC](https://trpc.io/) to take care of the "API" part of the app. tRPC's excellent integration with [TanStack Query](https://tanstack.com/query/latest) (formerly React Query) and [Zod](https://zod.dev/) sealed the deal for us, because we considered ease of refactoring and typesafety very important for a codebase that's meant to be heavily modified. There are other reasons to like tRPC: it ships with a set of great features, like middlewares, serialization, input validation, and error handling.

<details>
<summary>Expand</summary>

#### Example: add an endpoint

Backend routing for tRPC starts with `export const appRouter` in the `src/lib/trpc/root.ts` file.

To add a new endpoint - say, a simple counter - add a `counterRouter` to `appRouter`:

```diff
+ import { counterRouter } from './routers/counter';

export const appRouter = createTRPCRouter({
	hello: helloRouter,
	auth: authRouter,
	prompts: promptsRouter,
	settings: settingsRouter,
	surveys: surveysRouter,
+	counter: counterRouter
});
```

Next, create a router file called `src/lib/trpc/routers/counter.ts`:

```ts
import { createTRPCRouter, publicProcedure } from "../trpc";

let i = 0;
export const counterRouter = createTRPCRouter({
  getCount: publicProcedure.query(async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return i;
  }),
  increment: publicProcedure.mutation(() => {
    return ++i;
  }),
});
```

What's happening here?

- `createTRPCRouter` creates a new router mounted in `appRouter`. Routers can be nested ad infinitum.
- `publicProcedure` is a regular function that doesn't have any middleware (XXX explain). (Check out `authProcedure` and `orgProcedure` in `src/lib/trpc/trpc.ts` for inspiration.) The main way middleware is used is by adding data to the `ctx` object and performing checks like making sure that the user has access to the requested resource.
- `query` and `mutation` correspond to `useQuery` and `useMutation` in TanStack Query, respectively. You can think of these as `GET` and `POST` requests.
- We are using a simple variable to store the counter value to illustrate that it lives outside the frontend code. In a real app, similar functionality would be handled by a database, to persist data across frontend nodes and server restarts.
- We are using `await new Promise((resolve) => setTimeout(resolve, 300));` to simulate network latency - useful for testing loading states during development.

Now that we have the backend code in place, let's call it from a new page `src/components/Counter.tsx`:

```tsx
import { trpc, TRPCProvider } from "./trpc";

export function Counter() {
  return (
    <TRPCProvider>
      <CounterInternal />
    </TRPCProvider>
  );
}

const CounterInternal = () => {
  const counterQuery = trpc.counter.getCount.useQuery();
  const trpcUtils = trpc.useContext();
  const incrementMutation = trpc.counter.increment.useMutation({
    async onSettled() {
      await trpcUtils.counter.getCount.invalidate();
    },
  });

  return (
    <div className="container mx-auto mt-8">
      Count: {counterQuery.data ?? "loading..."}
      <br />
      <button
        disabled={incrementMutation.isLoading}
        className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-400"
        onClick={() => {
          incrementMutation.mutate();
        }}
      >
        Increase count
      </button>
    </div>
  );
};
```

What's happening here?

- We're wrapping our components in `TRPCProvider`, otherwise `useQuery` and `useMutation` won't work. Usually, this is done higher up in the component tree.
- `const counterQuery = trpc.counter.getCount.useQuery();` is how we call the backend endpoint. You can think of `counter.getCount` as a path to the endpoint that corresponds to `counterRouter` from the previous step. If you've used TanStack Query, you can think of `trpc.[path].useQuery()` as the equivalent of `useQuery({ queryKey: [path], queryFn: () => fetch('http://localhost:3000/api/trpc/[path]') })`.
- [`trpc.useContext`](https://trpc.io/docs/client/react/useContext) is a tRPC wrapper around `queryClient`. Its main purpose is to update the cache (used for [optimistic updates](https://tanstack.com/query/v4/docs/react/guides/optimistic-updates) and re-fetch queries. In our example, we'd like to see the new value for the counter right after clicking the "Increase count" button.
- `useMutation` is similar to `useQuery`, but it must be called manually with `incrementMutation.mutate()` and it'll never auto re-fetch like `useQuery`. (By default, `useQuery` re-fetches on window focus.) Conceptually, calling `useMutation` is similar to making a "POST" request - in our example, calling it causes the counter value to increase.
- `onSettled` is called after the mutation is completed, either successfully or with an error. Because we know that the counter value has changed on the server, we know the value in `counterQuery`.data`is out of date. To get the current value, we invalide the`getCounter`cache, which immediately triggers a`useQuery` re-fetch.
- `invalidate()` returns a Promise that is resolved once the new value of the counter is fetched. While we're waiting on this Promise in `incrementMutation.onSettled`, the value of `incrementMutation.isLoading` is going to be `true` until the new value of `counterQuery` is available.
- We use `{incrementMutation.isLoading}` to place the button in `disabled` state - this prevents the user from clicking the button multiple times, thus ensuring the same user can only increment the counter by one with each click.

Now that we have a `Counter` component, let's add a way to show it by creating a `src/pages/counter.astro` file with the following content:

```astro
---
import { Counter } from "../components/Counter";
import Layout from "../layouts/Layout.astro";
---

<Layout title="Counter">
  <Counter client:only="react" />
</Layout>
```

To see it in action, open http://localhost:3000/counter.

If you've used CRA (Create React App) or Vite before, everything we've done here so far should seem very familiar (except for how elegantly the backend integrates with the frontend).

The main characteristic of the classic SPA (Single-page application) approach is that you see "Loading..." indicators where fresh data is fetched from the server. (XXX this seems out of place, remove?)

If you've used Next or Remix before, you might be wondering if we can do something similar to `getServerSideProps` or `getStaticProps` to improve the loading experience (XXX what's wrong with it?). The answer is "yes"! - in more ways that one can imagine - though all the ways but one fall outside the scope of this guide. As such, let's focus on the basics of tRPC prefetch.

Let's change our `src/pages/counter.astro` to the following:

```astro
---
import { Counter } from "../components/Counter";
import Layout from "../layouts/Layout.astro";
import { createHelpers } from "../lib/trpc/root";

export const prerender = false;

const helpers = createHelpers(Astro);
const count = await helpers.counter.getCount.fetch();
---

<Layout title={"Counter initial value is " + count}>
  <Counter client:load dehydratedState={helpers.dehydrate()} />
</Layout>
```

Note that in Astro, the code between `---` (called "frontmatter") runs on the server and is not sent to the client.

You can think of `export const prerender = ...` as a per-route switch between SSG and SSR (XXX must be defined). By default, (when using `output: "hybrid"` (XXX - where?)) pages are pre-rendered to HTML at build time (so `prerender = true` is similar to `getStaticProps`), and to switch our page to SSR (similar to `getServerSideProps`), we need to set `prerender` to `false`.

`createHelpers` is a utility that allows you to perform tRPC procedures server-side.

`await helpers.counter.getCount.fetch();` is the first important part of our tRPC SSR integration. If you call `fetch()` or `prefetch()` on any tRPC procedure before rendering the app, you are pre-populating the TanStack Query cache for those queries.

This means two things.

One, during SSR, `useQuery` is usually set to `loading` state and `data` is `undefined`. Now, the queries that we have successfully prefetched will return actual data. In our case, `trpc.counter.getCount.useQuery().data` in the React code is initially going to be `0` instead of `undefined`.

Two, during client rendering, the query will have an initial value that can be displayed to a user or refetched in the background (XXX why?). Our recommended rule of thumb is to prefetch on the server and do background updates on the client for SSG pages, and to prefetch on the server and do no background re-fetches on the client for SSR pages. To control this behavior, we use the `staleTime` `useQuery` option (more on this later).

`dehydratedState={helpers.dehydrate()}` is the second important part of the integration: it allows components to use query cache during SSR, as well as perform actual serialization of the cache into HTML, so that we can use the same data to perform "hydration" of the client components.

Now, we need to make some changes in our React code in the `src/components/Counter.tsx` file:

```diff
+import type { DehydratedState } from '@tanstack/react-query';
+
 import { trpc, TRPCProvider } from './trpc';

-export function Counter() {
+export function Counter({ dehydratedState }: { dehydratedState?: DehydratedState }) {
        return (
-               <TRPCProvider>
+               <TRPCProvider dehydratedState={dehydratedState}>
                        <CounterInternal />
                </TRPCProvider>
        );
 }

 const CounterInternal = () => {
-       const counterQuery = trpc.counter.getCount.useQuery();
+       const counterQuery = trpc.counter.getCount.useQuery(undefined, {
+               staleTime: 1000,
+       });
        const trpcUtils = trpc.useContext();
```

We need to pass `dehydratedState` we got from the Astro Component into `TRPCProvider`, so that when we use the same queries, we can use values from the cache.

Note that we are also passing `staleTime` to `useQuery` - this prevents TanStack Query from re-fetching data that we already got from the server (because of `prerender=false` each page load will get fresh data from the server).

In the case of SSG (`prerender=true`), the time between query cache creation on the server and the `useQuery` call on the client could be much larger, making it more likely that the data is outdated - in this case, it's a good idea to get fresh data from the server on page load.

Read more:

- https://trpc.io/docs/client/react/useQuery
- https://trpc.io/docs/client/react/useMutation
- https://trpc.io/docs/client/react/infer-types
- https://tanstack.com/query/v4/docs/react/guides/ssr
- https://trpc.io/docs/client/nextjs/server-side-helpers

</details>

# License

B2B SaaS Kit is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for more details.
