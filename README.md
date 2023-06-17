# Welcome to the B2B SaaS Kit!

The B2B SaaS Kit is an open-source springboard for developers looking to quickly stand up a SaaS product where the customer can be a team of users (i.e., a business).

The kit uses TypeScript, Astro, React, Tailwind CSS, and a number of third-party services that take care of essential, yet peripheral requirements, such as secrets management, user authentication, a database, product analytics, customer support, and deployment infrastructure.

The kit is designed with two primary goals in mind:

1. Start with a fully-functional, relatively complex application. Then, modify it to become your own product.

2. You should be able to go from zero to idea validation verdict for the cost of a domain name - all the third-party services used by the kit offer meaningful free-forever starter plans.

## Why "B2B"?

"B2B" means "business-to-business". In the simplest terms, a B2B product is a product where post-signup, a user can create an organization, invite others, and do something as a team.

B2B companies are fairly common - for example, over 40% of <a href="https://www.ycombinator.com/companies" >Y Combinator-funded startups</a> self-identify as B2B - but B2B-specific starter kits appear to be quite rare, hence this effort.

## Get started

### High-level plan

- First, check out https://PromptsWithFriends.com - a web-based SaaS application that was built with this B2B SaaS Kit. _Prompts with Friends_ is a way to collaborate on GPT prompts with others

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

<img width="819" alt="image" src="https://github.com/fogbender/b2b-saaskit/assets/41166/a60efadc-0435-4bd9-ae65-ce516e808b02">

\- you should be able to have a working copy of _Prompts with Friends_ running on http://localhost:3000/app

### Deploy to production

## Working with the codebase

### DB migrations (using Drizzle Kit)

Read more about Drizzle in the official docs: https://orm.drizzle.team/kit-docs/overview

Another popular option to manage migrations is [Prisma](https://www.prisma.io/docs/guides/migrate/developing-with-prisma-migrate), talk to us if you'd like to see Prisma support in the kit.

<details>
<summary>Click to expand</summary>

#### Example: create a new table

First, you would need to make changes in the schema file `src/db/schema.ts`. The changes will only affect your typescript code, not the database. If you try to access that table you will get a runtime error.

```ts
export const example = pgTable("example", {
  exampleId: text("id").primaryKey(),
  value: integer("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

In drizzle migrations happen in two steps, first step generates a migration file, second step applies the migration to the database.

```sh
doppler run yarn drizzle-kit generate:pg
```

Since we are using Supabase Postgres, we need to take care of [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security) policies when creating new tables. So let's open the generated SQL file that will be named something like this `src/db/migrations/1234_some_words.sql`. We need to edit that file before we can apply it to the database. Add this (changing your table name) to the end of the file:

```sql
ALTER TABLE example ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service" ON "public"."example" AS PERMISSIVE FOR ALL TO service_role USING (true);
```

Finally, the migration itself. This is going to just go through your SQL files and run them in order. That simplicity gives your flexibility to do some sophisticated things, like write manual data migrations or skip some steps if you know that the change is already there in the DB (if you edited it manually for example, or when you are trying to run `CREATE POLICY` command which doesn't have `IF NOT EXISTS` option).

```sh
doppler run yarn migrate
```

The B2B SaasKit doesn't automate production migrations for you, so you would have to manually run it with production config to get the changes to your production database.

```sh
doppler run yarn migrate --config prd
```

If you need to redo something you can drop the migration file. Keep in mind that it won't change the state of the database, it will only remove generated migration files.

```sh
doppler run yarn drizzle-kit drop
```

Now if you run `generate:pg` again Drizzle will regenerate the migration files. This could be good if you want to get rid of some intermediate changes you made in your development environment.

</details>

## License

B2B SaaS Kit is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for more details.
