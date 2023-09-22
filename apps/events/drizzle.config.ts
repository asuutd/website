import type { Config } from 'drizzle-kit';

export default {
	schema: './src/server/db/drizzle/schema.ts',
	driver: 'mysql2',
	dbCredentials: {
		connectionString:
			'mysql://a9mae2kq1vh9qdy5ale0:pscale_pw_FVEPwhhCnBhKC0UrkSnWPo9n7QHxTal6xjXImN3vllN@aws.connect.psdb.cloud/asu_ticketing?ssl={"rejectUnauthorized":true}' ??
			''
	},
	out: './drizzle'
} satisfies Config;
