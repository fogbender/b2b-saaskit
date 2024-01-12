![wink](https://github.com/fogbender/b2b-saaskit/assets/41166/4f00bef4-8db5-4568-9fe5-bcbfe08619a5)

# Welcome to the B2B SaaS Kit!

The B2B SaaS Kit is an open-source starter toolkit for developers looking to quickly stand up a SaaS product where the customer can be a team of users (i.e., a business).

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

[Drizzle ORM](https://orm.drizzle.team/kit-docs/overview)

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

   - Node.js 18 or Node.js 20

   ⚠️ Warning: Will not work with Node.js 19 due to bug in `set-cookie` implementation that was fixed in Node.js 20
   ⚠️ Astro 4 requires Node.js 18.17 or 20.3 or later

2. Clone repo, start app

```
git clone https://github.com/fogbender/b2b-saaskit.git
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

### DB migrations with Drizzle ORM

We're using Drizzle ORM to manage database migrations in B2B SaaS Kit. For details on Drizzle, see https://orm.drizzle.team/kit-docs/overview.

Another popular ORM option is [Prisma](https://www.prisma.io/docs/guides/migrate/developing-with-prisma-migrate) - if you'd like to use Prisma instead of Drizzle and need help, please get in touch with us.

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
- `publicProcedure` is a way to add a remote call that doesn't perform any checks in the middle (i.e., without any middlewares). For examples of procedure builders that do perform additional checks, see `authProcedure` or `orgProcedure` in `src/lib/trpc/trpc.ts`.
- Such checks are often implemented with "middlewares". tRPC middlewares add data to the `ctx` object, which is passed as input to all tRPC functions. Middleware are commonly used to perform access control checks or input validation.
- `query` and `mutation` correspond to `useQuery` and `useMutation` in TanStack Query, respectively. You can think of these as `GET` and `POST` requests.
- We're using a simple variable to store the counter value to illustrate that it lives outside the frontend code. In a real app, similar functionality would be handled by a database, whose role is to persist data across frontend nodes and server restarts.
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
- [`trpc.useContext`](https://trpc.io/docs/client/react/useContext) is a tRPC wrapper around `queryClient`. Its main purpose is to update the cache (used for [optimistic updates](https://tanstack.com/query/v4/docs/react/guides/optimistic-updates) and re-fetch queries. In our example, we'd like to see the new value for the counter immediately after clicking the "Increase count" button.
- `useMutation` is similar to `useQuery`, but it must be called manually with `incrementMutation.mutate()` and it'll never auto re-fetch like `useQuery`. (By default, `useQuery` re-fetches on window focus.) Conceptually, calling `useMutation` is similar to making a "POST" request - in our example, calling it causes the counter value to increase.
- `onSettled` is called after the mutation completes, either successfully or with an error. Because we know that the counter value has changed on the server, we know the value in `counterQuery.data` is out of date. To get the current value, we invalide the `getCounter` cache, which immediately triggers a `useQuery` re-fetch.
- `invalidate()` returns a Promise that gets resolved once the new value of the counter is fetched. While we're waiting on this Promise in `incrementMutation.onSettled`, the value of `incrementMutation.isLoading` is set to `true`, until the new value of `counterQuery` is available.
- We use `{incrementMutation.isLoading}` to place the button in `disabled` state - this prevents the user from clicking the button multiple times, ensuring the same user can only increment the counter by one with each click.

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

#### CSR, SSR, and SSG

So far, what we've done is called "Client-side Render" (CSR), meaning the client starts off with no known state (counter is undefined), and builds it up by querying the server. If you're familiar with CRA (Create React App) or Vite, this is exactly how those frameworks work.

This approach may work well for an app where the user is an authenticated human operating a web browser, but if the user is a search engine retrieving a blog post for indexing or a messaging system trying to unfurl a URL to display useful metadata, not so much. To get actual content, the search engine or messaging system would have to run the JavaScript to build up the state of the page in question by querying the server - something they may simply be unwilling to do due to cost or performance constraints.

Mechanisms that return pre-rendered content to the caller can either assemble it "on the fly", while processing a request (also called "server-side render", or SSR), or by simply reading it from disk (also called "build-time generation" or "static site generation", or SSG). For example, say you've got a site with tens of thousands of products, and each product page needs to display the name of the product in question - instead of generating tens of thousands of static pages, which might be prohibitively expensive, you can generate the title for each product page "at request time". Alternatively, say you've got a `robots.txt` file, where the content differs between staging and production environments - this file would be generated and written to disk "at build time", generally during deployment.

SSR is often mentioned in discussions that involve generating `og:image` tags and other SEO-focused operations.

Our setup lets us do both SSR and SSG - let's take a look how.

First, we'll change our `src/pages/counter.astro` to the following:

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

You can think of `export const prerender = ...` as a per-route switch between SSG and SSR. `prerender = true` means "build-time" (SSG), and `prerender = false` means "request-time" (SSR). If `export const prerender` isn't defined, its default value depends on the value of `output` in the `astro.config.mjs` settings file. In our case, `output` is `hybrid`, which means `prerender = true` by default. For more info on this, see https://docs.astro.build/en/guides/server-side-rendering/.

If you're familiar with other full-stack frameworks, using `prerender = false` is similar to `getServerSideProps` in Next.js and `loader` in Remix, while `prerender = true` is similar to getStaticProps in Next.js.

`createHelpers` is a utility that allows you to perform tRPC procedures server-side.

`await helpers.counter.getCount.fetch();` is the first important part of our tRPC SSR integration. If you call `fetch()` or `prefetch()` on any tRPC procedure before rendering the app, you are pre-populating the TanStack Query cache for those queries.

This means two things.

One, during SSR, `useQuery` is usually set to `loading` state and `data` is `undefined`. Now, the queries that we have successfully prefetched will return actual data. In our case, `trpc.counter.getCount.useQuery().data` in the React code will be set to `0` instead of `undefined`.

Two, during client rendering, the query will have an initial value that can be displayed to a user right away. Our recommended rule of thumb is to prefetch on the server and do background updates on the client for SSG pages, and to prefetch on the server and do no background re-fetches on the client for SSR pages. To control this behavior, we use the `staleTime` `useQuery` option (more on this later).

`dehydratedState={helpers.dehydrate()}` is the second important part of the integration: it allows components to use query cache during SSR, as well as perform actual serialization of the cache into HTML, so that we can use the same data to perform "hydration" of the client components.

To take advantage of these features, we must make some changes in our React code in the `src/components/Counter.tsx` file:

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
+               staleTime: 1000, // one second
+       });
        const trpcUtils = trpc.useContext();
```

We need to pass `dehydratedState` we got from the Astro Component into `TRPCProvider`, so that when we rerun the same query, we can use values from the cache.

Note that we are also passing `staleTime` to `useQuery` - this prevents TanStack Query from re-fetching data that we already got from the server (because of `prerender=false`, each page load will get fresh data from the server).

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
