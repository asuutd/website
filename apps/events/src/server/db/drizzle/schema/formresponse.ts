import { relations } from 'drizzle-orm';
import { pgTable, text, jsonb, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { eventForm } from './eventform';
import { user } from './user';
import { CustomResponseField } from '@/utils/forms';

export const formResponse = pgTable(
	'FormResponse',
	{
		formId: text('formId').notNull().references(() => eventForm.id, { onDelete: "cascade", onUpdate: "cascade" } ),
		userId: text('userId').notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
		response: jsonb('response').$type<Omit<CustomResponseField, 'type'>[]>().notNull(),
		createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
			.defaultNow()
			.notNull()
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.formId, table.userId], name: 'FormResponse_pkey' }),
		};
	}
);

export const formResponseRelations = relations(formResponse, ({ one }) => ({
	event: one(eventForm, {
		fields: [formResponse.formId],
		references: [eventForm.id]
	}),
	user: one(user, {
		fields: [formResponse.userId],
		references: [user.id]
	})
}));
