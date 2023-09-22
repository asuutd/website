import type { Config } from 'drizzle-kit';

export default {
	schema: './src/server/db/drizzle/schema.ts',
	driver: 'mysql2',
	dbCredentials: {
		connectionString: process.env.DATABASE_URL ?? ''
	},
	out: './drizzle'
} satisfies Config;
