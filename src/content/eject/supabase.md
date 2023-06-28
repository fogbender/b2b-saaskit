---
title: Replacing Supabase (service)
---

We use Supabase just as a database, so it's fairly easy to replace it with something else. We chose Supabase because of the combination of stability, ease of use, and price.

It's easiest if you just want to replace it with some other cloud Postgres database. What you need is:

- change `DATABASE_URL` to a new URL provided by your database provider (that could be local instance of Postgres)
- remove RLS specific code from migrations:

```diff
- ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;
- CREATE POLICY "service" ON "public"."prompt_likes" AS PERMISSIVE FOR ALL TO your_table_name USING (true);
```

If you want to use a different database that is [supported by Drizzle ORM](https://orm.drizzle.team/docs/installation-and-db-connection) (PostgreSQL, MySQL, SQLite including local and services) you would need to change `src/db/schema.ts` and `src/db/db.ts` according to the documentation.

If you want to completely remove the database, see the bottom of the "Replacing Drizzle ORM" section.
