![wink](https://github.com/fogbender/b2b-saaskit/assets/41166/4f00bef4-8db5-4568-9fe5-bcbfe08619a5)

# Welcome to the B2B SaaS Kit!

The B2B SaaS Kit is an open-source springboard for developers looking to quickly stand up a SaaS product where the customer can be a team of users (i.e., a business).

The kit uses TypeScript, Astro, React, Tailwind CSS, and a number of third-party services that take care of essential, yet peripheral requirements, such as secrets management, user authentication, a database, product analytics, customer support, payments, and deployment infrastructure.

The kit is designed with two primary goals in mind:

1. Start with a fully-functional, relatively complex application. Then, modify it to become your own product.

2. You should be able to build an app to validate your idea for the cost of a domain name - all the third-party services used by the kit offer meaningful free-forever starter plans.

## Why "B2B"?

"B2B" means "business-to-business". In the simplest terms, a B2B product is a product where post-signup, a user can create an organization, invite others, and do something as a team.

B2B companies are fairly common - for example, over 40% of <a href="https://www.ycombinator.com/companies" >Y Combinator-funded startups</a> self-identify as B2B - but B2B-specific starter kits appear to be quite rare, hence this effort.

## What's in the kit?

### Backbone

[<img src="public/readme-images/Astro.png" width="200" />](https://astro.build) &nbsp;&nbsp; [<img src="public/readme-images/React.png" width="200" />](https://react.dev) &nbsp;&nbsp; [<img src="public/readme-images/TailwindCSS.png" width="200" />](https://tailwindcss.com)

### Not optional

[<img src="public/readme-images/Doppler.png" width="200" />](https://doppler.com) &nbsp;&nbsp; [<img src="public/readme-images/Supabase.png" width="200" />](https://supabase.com) &nbsp;&nbsp; [<img src="public/readme-images/PropelAuth.png" width="200" />](https://propelauth.com)

### Optional

[<img src="public/readme-images/Stripe.png" width="200" />](https://stripe.com) &nbsp;&nbsp; [<img src="public/readme-images/Vercel.png" width="200" />](https://vercel.com) &nbsp;&nbsp; [<img src="public/readme-images/Fogbender.png" width="200" />](https://fogbender.com) &nbsp;&nbsp; [<img src="public/readme-images/PostHog.png" width="200" />](https://posthog.com)

### Also featuring

[Prettier](https://prettier.io/)

[ESLint](https://eslint.org/)

[GitHub](https://github.com)

## Get started

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

## Working with the codebase

### DB migrations

We're using Drizzle Kit to manage database migrations in B2B SaaS Kit. For details on Drizzle, see https://orm.drizzle.team/kit-docs/overview.

Another popular option is [Prisma](https://www.prisma.io/docs/guides/migrate/developing-with-prisma-migrate) - if you'd like to use Prisma instead of Drizzle and need help, please get in touch with us.

<details>
<summary>Click to expand</summary>

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

### tRPC (type-safe tool to talk to your backend)

For better organization of our backend code, we are using [tRPC](https://trpc.io/). It has built-in features like middleware, serialization, and validation that you would expect from a backend framework. But its excellent integration with [TanStack Query](https://tanstack.com/query/latest) (formerly React Query) and [Zod](https://zod.dev/) is what makes it so easy to call backend functions from the frontend while keeping type safety and ease of refactoring.

<details>
<summary>Click to expand</summary>

#### Example: create new endpoints

Backend routing for tRPC starts from `appRouter` in the `src/lib/trpc/root.ts` file. You can add new endpoints by adding a new router to the `appRouter`:

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

Now let's create the new router file `src/lib/trpc/routers/counter.ts`:

```ts
import { createTRPCRouter, publicProcedure } from '../trpc';

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

Let's quickly overview what's happening here:

- `createTRPCRouter` creates a new router that will be mounted on the `appRouter` from the previous step. You can keep nesting routers as much as you want.
- `publicProcedure` is a regular procedure that doesn't have any middleware. You can check out `authProcedure` and `orgProcedure` which are defined in `src/lib/trpc/trpc.ts` for inspiration. The main way middleware is used is by adding data to the `ctx` object and performing checks like making sure that the user has access to the requested resource.
- the difference between `query` and `mutation` is that one corresponds to `useQuery` in TanStack Query and the other to `useMutation`. You can just think of it as `GET` and `POST` requests.
- we are just using a simple variable to store the counter value to illustrate that it lives outside the frontend code. In a real app, that would be a database call so that you can persist the value across server restarts.
- we are using `await new Promise((resolve) => setTimeout(resolve, 300));` to simulate a network latency. This is useful for testing loading states during development.

Now that we have the backend code, let's call it from the frontend. We'll add a new page `src/components/Counter.tsx`:

```tsx
import { trpc, TRPCProvider } from './trpc';

export function Counter() {
	return (
		<TRPCProvider>
			<CounterInteral />
		</TRPCProvider>
	);
}

const CounterInteral = () => {
  const counterQuery = trpc.counter.getCount.useQuery();
	const trpcUtils = trpc.useContext();
	const incrementMutation = trpc.counter.increment.useMutation({
		async onSettled() {
			await trpcUtils.counter.getCount.invalidate();
		},
	});

	return (
		<div className="container mx-auto mt-8">
			Count: {counterQuery.data ?? 'loading...'}
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

Now let's quickly overview what's happening here:

- we need to wrap our components in `TRPCProvider` otherwise `useQuery` and `useMutation` won't work. Usually, this is done higher up in the component tree.
- `const counterQuery = trpc.counter.getCount.useQuery();` is how we call the backend endpoint. You can think of `counter.getCount` as a path to the endpoint that corresponds to `counterRouter` from the previous step. If you used TanStack Query before you might think of `trpc.[path].useQuery()` as an equivalent to `useQuery({ queryKey: [path], queryFn: () => fetch('http://localhost:3000/api/trpc/[path]') })`.
- [`trpc.useContext`](https://trpc.io/docs/client/react/useContext) is tRPC wrapper around `queryClient` the main use of which is to update the cache (used for [optimistic updates](https://tanstack.com/query/v4/docs/react/guides/optimistic-updates) and cause queries to re-fetch. In this example we want to see the new value of the counter after we incremented it.
- `useMutation` is similar to `useQuery`, but you need to manually call it with `incrementMutation.mutate()` and it won't be re-fetched automatically like `useQuery` would (by default `useQuery` will re-fetch on window focus), so you should use it similarly to "POST" requests. In this case it will cause counter value to be changed.
- `onSettled` is a callback that is called after the mutation is completed (either successfully or with an error). Because we know that the counter value has changed on the server, the value in `counterQuery`.data` is now out-of-date. To see the new value we need to re-fetch `getCounter` by invalidating its cache (which will cause it to be re-fetched right away).
- `invalidate()` returns a promise that is going to be resolved once the new value of the counter is fetched. Because we are waiting for this promise in `incrementMutation.onSettled` the value of `incrementMutation.isLoading` is going to be `true` until the new value of `counterQuery` is fetched.
- In our app we use `{incrementMutation.isLoading}` to set our button in the `disabled` state, which will prevent the user from clicking it multiple times, thus ensuring that one user can only increment the counter by one.

Now that we have a `Counter` component let's add a page that would show it. For that we are going to create `src/pages/counter.astro` file with the following content:

```astro
---
import { Counter } from '../components/Counter';
import Layout from '../layouts/Layout.astro';
---

<Layout title="Counter">
	<Counter client:only="react" />
</Layout>
```

And you can see this page at http://localhost:3000/counter

If you used CRA (crate-react-app) or Vite before everything you've seen so far should have seemed very familiar (except for how nicely our backend code is integrated with our frontend code). The main characteristic of the classic SPA approach is that you see "Loading..." while fresh data from the server is fetched. If you used Next or Remix before you might be wondering if we can do something similar to `getServerSideProps` or `getStaticProps` to improve the loading experience. There are too many options on how to achieve that to cover in this guide, so we are going to focus just on the basics of tRPC prefetch.

Let's change our `src/pages/counter.astro` to the following:

```astro
---
import { Counter } from '../components/Counter';
import Layout from '../layouts/Layout.astro';
import { createHelpers } from '../lib/trpc/root';

export const prerender = false;

const helpers = createHelpers(Astro);
const count = await helpers.counter.getCount.fetch();
---

<Layout title={'Counter initial value is ' + count}>
	<Counter client:load dehydratedState={helpers.dehydrate()} />
</Layout>
```

Code between `---` (usually called frontmatter) runs on the server and is not sent to users.
You can think of `export const prerender = ...` as a switch between SSG and SSR per route. By default (when using `output: "hybrid"`) pages are going to be pre-rendered into HTML during the build time (so `prerender = true` is similar to `getStaticProps`), and to switch our page to SSR (similar to `getServerSideProps`) we need to set `prerender` to `false`.
`createHelpers` is a utility that allows you to perform tRPC procedures server side.
`await helpers.counter.getCount.fetch();` is the first important part of our tRPC SSR integration. If you call `fetch()` or `prefetch()` on any tRPC procedure before you start rendering the app you are pre-populating TanStack Query cache for those queries. That means two things. One is that during SSR usually `useQuery` is set to `loading` state and `data` is `undefined`. Now the queries that we have successfully prefetch will return actual data. So in this case `trpc.counter.getCount.useQuery().data` in our React code is going to be `0` (or whatever the value is on the server) instead of `undefined`. And two, now during client rendering that query will have an initial value and you might use that value to show to your users or choose to refetch it in the background. The rule of thumb that I recommend is that you can prefetch on the server + fetch updates in the background on the client for SSG pages, and prefetch on the server and do not re-fetch it on the client for SSR pages. To control this behavior we use `staleTime` option (more on that later).
`dehydratedState={helpers.dehydrate()}` is the second important part of the integration. It will allow components to use the query cache during SSR as well as perform actual serialization of the query cache into HTML so that we can use the same data to perform "hydration" of the client components.

Now we need to make some changes in our React code in the `src/components/Counter.tsx` file:

```diff
+import type { DehydratedState } from '@tanstack/react-query';
+
 import { trpc, TRPCProvider } from './trpc';
 
-export function Counter() {
+export function Counter({ dehydratedState }: { dehydratedState?: DehydratedState }) {
        return (
-               <TRPCProvider>
+               <TRPCProvider dehydratedState={dehydratedState}>
                        <CounterInteral />
                </TRPCProvider>
        );
 }
 
 const CounterInteral = () => {
-       const counterQuery = trpc.counter.getCount.useQuery();
+       const counterQuery = trpc.counter.getCount.useQuery(undefined, {
+               staleTime: 1000,
+       });
        const trpcUtils = trpc.useContext();
```

We need to pass `dehydratedState` that we got from Astro Component into `TRPCProvider` so that when we use the same queries we can use values from the cache.
Note that we also are passing `staleTime` to the query to prevent TanStack Query from re-fetching data that we already got from the server (because of `prerender=false` each page load will get fresh data from the server). In case of SSG (`prerender=true`) the time between when the query cache was created and the `useQuery` is called on the client could be much bigger, so there's more of a chance that the data is outdated and you do need to get fresh data from the server.



Read more

- https://trpc.io/docs/client/react/useQuery
- https://trpc.io/docs/client/react/useMutation
- https://trpc.io/docs/client/react/infer-types
- https://tanstack.com/query/v4/docs/react/guides/ssr
- https://trpc.io/docs/client/nextjs/server-side-helpers

</details>

## License

B2B SaaS Kit is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for more details.
