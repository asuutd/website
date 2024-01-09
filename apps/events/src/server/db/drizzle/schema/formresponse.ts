import { relations, sql } from 'drizzle-orm';
import { mysqlTable, varchar, json, datetime, primaryKey } from 'drizzle-orm/mysql-core';
import { eventForm } from './eventform';
import { user } from './user';
import { CustomResponseField } from '@/utils/forms';

export const formResponse = mysqlTable(
	'FormResponse',
	{
		formId: varchar('formId', { length: 191 }).notNull(),
		userId: varchar('userId', { length: 191 }).notNull(),
		response: json('response').$type<Omit<CustomResponseField, 'type'>[]>().notNull(),
		createdAt: datetime('createdAt', { mode: 'date', fsp: 3 })
			.default(sql`CURRENT_TIMESTAMP(3)`)
			.notNull()
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.formId, table.userId] })
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
