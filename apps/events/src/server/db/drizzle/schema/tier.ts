import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, text, doublePrecision, timestamp, integer,foreignKey } from 'drizzle-orm/pg-core';
import { event } from './event';
import { code } from './code';
import { ticket } from './ticket';

export const tier = pgTable('Tier', {
	id: text('id')
		.$defaultFn(() => createId())
		.primaryKey()
		.notNull(),
	price: doublePrecision('price').notNull(),
	start: timestamp('start', { mode: 'date', precision: 3 }).notNull(),
	end: timestamp('end', { mode: 'date', precision: 3 }).notNull(),
	eventId: text('eventId').notNull().references(() => event.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	name: text('name').notNull(),
	limit: integer('limit')
}
)

export const tierRelations = relations(tier, ({ one, many }) => ({
	event: one(event, {
		fields: [tier.eventId],
		references: [event.id]
	}),
	codes: many(code),
	tickets: many(ticket)
}));
