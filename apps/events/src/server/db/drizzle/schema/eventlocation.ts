import { relations } from 'drizzle-orm';
import { pgTable, text, doublePrecision, foreignKey } from 'drizzle-orm/pg-core';
import { event } from './event';

export const eventLocation = pgTable('EventLocation', {
	id: text("id").primaryKey().notNull().references(() => event.id, { onDelete: "cascade", onUpdate: "cascade" }),
	long: doublePrecision('long').notNull(),
	lat: doublePrecision('lat').notNull(),
	name: text('name').notNull()
}
)

export const eventLocationRelations = relations(eventLocation, ({ one }) => ({
	event: one(event, {
		fields: [eventLocation.id],
		references: [event.id]
	})
}));
