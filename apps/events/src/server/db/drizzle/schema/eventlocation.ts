import { relations } from 'drizzle-orm';
import { pgTable, text, doublePrecision, foreignKey } from 'drizzle-orm/pg-core';
import { event } from './event';

export const eventLocation = pgTable('EventLocation', {
	id: text('id').notNull(),
	long: doublePrecision('long').notNull(),
	lat: doublePrecision('lat').notNull(),
	name: text('name').notNull()
},
(table) => {
	return {
		eventLocationEventIdFk: foreignKey({
			columns: [table.id],
			foreignColumns: [event.id],
			name: 'EventLocation_eventId_fkey',
		}).onDelete('cascade').onUpdate('cascade')
	}
}
)

export const eventLocationRelations = relations(eventLocation, ({ one }) => ({
	event: one(event, {
		fields: [eventLocation.id],
		references: [event.id]
	})
}));
