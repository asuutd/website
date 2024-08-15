import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, varchar, double } from 'drizzle-orm/pg-core';
import { event } from './event';

export const eventLocation = pgTable('EventLocation', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	long: double('long').notNull(),
	lat: double('lat').notNull(),
	name: varchar('name', { length: 191 })
});

export const eventLocationRelations = relations(eventLocation, ({ one }) => ({
	event: one(event, {
		fields: [eventLocation.id],
		references: [event.id]
	})
}));
