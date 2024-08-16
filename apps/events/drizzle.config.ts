import { defineConfig } from "drizzle-kit"

export default defineConfig({
	schema: './src/server/db/drizzle/schema.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL ?? ''
	},
	out: './src/server/db/drizzle'
});