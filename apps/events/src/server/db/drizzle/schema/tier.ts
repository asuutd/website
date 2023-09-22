import { createId } from '@paralleldrive/cuid2';
import { mysqlTable, varchar, double, datetime, int } from 'drizzle-orm/mysql-core';

export const tier = mysqlTable('Tier', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	price: double('price').notNull(),
	start: datetime('start', { mode: 'date', fsp: 3 }).notNull(),
	end: datetime('end', { mode: 'date', fsp: 3 }).notNull(),
	eventId: varchar('eventId', { length: 191 }).notNull(),
	name: varchar('name', { length: 191 }).notNull(),
	limit: int('limit')
});
