---
title: Replacing Supabase (service)
---

We use Supabase just as a database, so it's fairly easy to replace it with something else. We chose Supabase because of the combination of stability, ease of use, and price.

It's easiest to replace Supabase with another cloud Postgres database:

- Change `DATABASE_URL` to a new URL provided by your database provider (this could be a local instance of Postgres)
- Remove RLS-specific code from migrations:

```diff
- ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;
- CREATE POLICY "service" ON "public"."prompt_likes" AS PERMISSIVE FOR ALL TO your_table_name USING (true);
```

If you'd like to use a different database that is [supported by Drizzle ORM](https://orm.drizzle.team/docs/installation-and-db-connection) - like PostgreSQL, MySQL, SQLite, including local and services - change `src/db/schema.ts` and `src/db/db.ts` according to documentation.

To completely remove the database, see the bottom of the "Replacing Drizzle ORM" section.
