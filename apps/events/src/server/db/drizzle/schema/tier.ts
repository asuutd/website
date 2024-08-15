import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, varchar, doublePrecision, timestamp, integer } from 'drizzle-orm/pg-core';
import { event } from './event';
import { code } from './code';
import { ticket } from './ticket';

export const tier = pgTable('Tier', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	price: doublePrecision('price').notNull(),
	start: timestamp('start', { mode: 'date', precision: 3 }).notNull(),
	end: timestamp('end', { mode: 'date', precision: 3 }).notNull(),
	eventId: varchar('eventId', { length: 191 }).notNull(),
	name: varchar('name', { length: 191 }).notNull(),
	limit: integer('limit')
});

export const tierRelations = relations(tier, ({ one, many }) => ({
	event: one(event, {
		fields: [tier.eventId],
		references: [event.id]
	}),
	codes: many(code),
	tickets: many(ticket)
}));
