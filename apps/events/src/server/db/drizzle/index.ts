import { drizzle as dzl } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import { env } from '@/env/server.mjs';
import { schema } from './schema';

// create the connection
export const connection = connect({
	url: env.DATABASE_URL
});

export const drizzle = dzl(connection, { schema });
