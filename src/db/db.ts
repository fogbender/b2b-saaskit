import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import type { serverEnv } from '../t3-env';

export const sql = postgres((process.env as typeof serverEnv).DATABASE_URL);

export const db = drizzle(sql);
