import type { Config } from 'drizzle-kit';

const config: Config = {
	schema: './src/server/db/drizzle/schema.ts',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.DATABASE_URL ?? ''
	},
	out: './drizzle/migrations'
};

export default config;