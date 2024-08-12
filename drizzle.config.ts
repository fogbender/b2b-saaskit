import { defineConfig } from 'drizzle-kit';

export const migrationsFolder = './src/db/migrations';

export default defineConfig({
	dialect: 'postgresql', // supports "sqlite" | "mysql"
	schema: './src/db',
	out: migrationsFolder,
	dbCredentials: {
		// used by "push" and "pull" commands
		url: process.env.DATABASE_URL!,
	},
});
