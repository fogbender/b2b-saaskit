import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
