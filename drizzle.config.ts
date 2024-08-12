import { defineConfig } from 'drizzle-kit';

export const dbFolder = './src/db';

export default defineConfig({
	dialect: 'postgresql', // supports "sqlite" | "mysql"
	schema: `${dbFolder}/schema.ts`,
	out: dbFolder,
	dbCredentials: {
		// used by "push" and "pull" commands
		url: process.env.DATABASE_URL!,
	},
});
