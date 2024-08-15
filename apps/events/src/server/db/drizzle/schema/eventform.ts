import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import { pgTable, varchar, json, timestamp } from 'drizzle-orm/pg-core';
import { event } from './event';
import { formResponse } from './formresponse';
import { CustomField } from '@/utils/forms';

export const eventForm = pgTable('EventForm', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	eventId: varchar('eventId', { length: 191 }).notNull(),
	form: json('form').$type<CustomField[]>().notNull(),
	updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 })
		.default(sql`CURRENT_TIMESTAMP(3)`)
		.notNull()
});

export const eventFormRelations = relations(eventForm, ({ one, many }) => ({
	event: one(event, {
		fields: [eventForm.eventId],
		references: [event.id]
	}),
	responses: many(formResponse)
}));
