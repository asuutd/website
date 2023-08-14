import { drizzle } from 'drizzle-orm/postgres-js';
import { DB_URL } from '$env/static/private';
import pkg from 'pg';
import postgres from 'postgres';
const { Client } = pkg;
export const client = postgres(DB_URL);
export const db = drizzle(client);
