import { drizzle } from 'drizzle-orm/node-postgres';
import { DB_URL } from '$env/static/private';
import pkg from 'pg';
const { Pool } = pkg;
export const pool = new Pool({ connectionString: DB_URL });
export const db = drizzle(pool);
