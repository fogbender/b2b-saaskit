### Step 4: Supabase

Supabase is an open source Firebase alternative. It provides a lot of features that you would expect from Firebase like authentication, database, storage, functions, etc. It is open source and you can host it yourself. In this project we are only using it as a Postgres database.

1. Create an account on [Supabase](https://supabase.com/) and create a new project. Name it "b2b localhost", click on "generate a password" link under "Database Password", click "Create new project", keep in mind that it could take a few minutes to create a project.

1. Click on [this link](https://app.supabase.com/project/_/settings/database) to get into "Project Settings" - "Database". Go to "Connection string" and select "URI" (or "Nodejs"), it will look something like `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxxxxxxxxx.supabase.co:5432/postgres` make sure to replace `[YOUR-PASSWORD]` with the actual password, you can alway regenerate it by clicking on "Reset Database Password" right above the "Connection string" field (click "Generage a password" link, then "Copy", then "Reset password").

1. Now set `DATABASE_URL` to that value. You can use Doppler UI (`doppler open`) or CLI to do that (`doppler secrets set DATABASE_URL`).

1. Run migrations with `doppler run yarn migrate` to initialize the database, you should be able to see new tables created in [supabase table editor](https://app.supabase.com/project/_/editor).

1. Now restart `doppler run yarn dev` and you should see the next section of the tutorial.
