---
title: "Postgres database with Supabase"
needsEnv: ["DATABASE_URL"]
---

Supabase (<a href="https://supabase.com" target="_blank">https://supabase.com</a>) is an open source Firebase alternative, providing services like authentication, managed database, storage, functions, etc. In this project, we'll only use Supabase for its managed Postgres database service.

Supabase is free for 2 lightweight projects.

1. Create an account on <a href="https://supabase" target="_blank">Supabase</a>, then:

- Create a new project named "b2b localhost";
- Click on "generate a password" link under "Database Password";
- Open a fresh editor buffer and paste the password there;
- Click "Create new project" - this can take a few minutes to complete.

2. Click on <a href="https://app.supabase.com/project/_/settings/database" target="_blank">"Project Settings" - "Database"</a>, navigate to "Connection string" and copy the URI (it will look something like `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxxxxxxxxx.supabase.co:5432/postgres`).

3. Paste the URI to the editor buffer from step 1, replace `[YOUR-PASSWORD]` with your password, then copy the resulting string.

4. Run `doppler secrets set DATABASE_URL` and set it the string from step 3.

5. Run `doppler run yarn migrate` to initialize the database. You should see your new tables in the <a href="https://app.supabase.com/project/_/editor" target="_blank">Supabase table editor</a>.

6. Restart `doppler run yarn dev` to move to the next section of the tutorial.
