import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import { pgTable, timestamp, foreignKey, text, jsonb, index, unique } from 'drizzle-orm/pg-core';
import { event } from './event';
import { formResponse } from './formresponse';
import { CustomField } from '@/utils/forms';

export const eventForm = pgTable('EventForm', {
	id: text('id')
		.primaryKey().notNull().$defaultFn(() => createId()),
	eventId: text('eventId').notNull().references(() => event.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	form: jsonb('form').$type<CustomField[]>().notNull(),
	updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 })
		.defaultNow()
		.notNull()
},
(table) => {
	return {
		eventIdIdx: index("EventForm_eventId_idx").using("btree", table.eventId),
	}
}
)

export const eventFormRelations = relations(eventForm, ({ one, many }) => ({
	event: one(event, {
		fields: [eventForm.eventId],
		references: [event.id]
	}),
	responses: many(formResponse)
}));
