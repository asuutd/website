import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { mysqlTable, varchar, double, datetime, int } from 'drizzle-orm/mysql-core';
import { event } from './event';
import { code } from './code';
import { ticket } from './ticket';

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

export const tierRelations = relations(tier, ({ one, many }) => ({
	event: one(event, {
		fields: [tier.eventId],
		references: [event.id]
	}),
	codes: many(code),
	tickets: many(ticket)
}));
