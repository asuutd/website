import { drizzle } from 'drizzle-orm/node-postgres';
import { DB_URL } from '$env/static/private';
import { Pool } from 'pg';
export const pool = new Pool({ connectionString: DB_URL });
export const db = drizzle(pool);
