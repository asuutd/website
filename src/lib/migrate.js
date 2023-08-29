import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';
export const client = postgres(process.env.DB_URL);
export const db = drizzle(client);
// this will automatically run needed migrations on the database
migrate(db, { migrationsFolder: './drizzle' })
	.then(() => {
		console.log('Migrations complete!');
		process.exit(0);
	})
	.catch((err) => {
		console.error('Migrations failed!', err);
		process.exit(1);
	});
