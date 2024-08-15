import { drizzle as neonDrizzleAdapter } from 'drizzle-orm/neon-http';
import { drizzle as postgresDrizzleAdapter } from 'drizzle-orm/node-postgres';
import { neon } from '@neondatabase/serverless';
import { env } from '@/env/server.mjs';
import schema from './schema';
import { Client } from "pg";


const initAdapter = async () => {
	const usingNeonDatabase = new URL(env.DATABASE_URL).host.endsWith('.neon.tech')
	
	if (usingNeonDatabase) {
		return neonDrizzleAdapter(neon(env.DATABASE_URL), { schema });
	}

	const client = new Client({
		connectionString: env.DATABASE_URL,
	});
	await client.connect();

	return postgresDrizzleAdapter(client, { schema });
};

// TODO: need to figure out how to make this work since connecting to db is async
export const drizzle = await initAdapter();

export type Database = typeof drizzle;
