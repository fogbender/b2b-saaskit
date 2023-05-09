import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { serverEnv } from '../t3-env';

export const sql = postgres(serverEnv.DATABASE_URL);

export const db = drizzle(sql);
