import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import { pgTable, timestamp, foreignKey, text, jsonb, index, unique } from 'drizzle-orm/pg-core';
import { event } from './event';
import { formResponse } from './formresponse';
import { CustomField } from '@/utils/forms';

export const eventForm = pgTable('EventForm', {
	id: text('id')
		.$defaultFn(() => createId()),
	eventId: text('eventId').notNull(),
	form: jsonb('form').$type<CustomField[]>().notNull(),
	updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 })
		.default(sql`CURRENT_TIMESTAMP(3)`)
		.notNull()
},
(table) => {
	return {
		eventFormEventIdFk: foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: 'EventForm_eventId_fkey',
		}).onDelete('cascade').onUpdate('cascade'),
		eventFormEventIdIdx: index('EventForm_eventId_idx').on(table.eventId),
		eventFormPkey: unique('EventForm_pkey').on(table.id)
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
