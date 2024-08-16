import { relations, sql } from 'drizzle-orm';
import { pgTable, text, jsonb, timestamp, primaryKey, foreignKey } from 'drizzle-orm/pg-core';
import { eventForm } from './eventform';
import { user } from './user';
import { CustomResponseField } from '@/utils/forms';

export const formResponse = pgTable(
	'FormResponse',
	{
		formId: text('formId').notNull(),
		userId: text('userId').notNull(),
		response: jsonb('response').$type<Omit<CustomResponseField, 'type'>[]>().notNull(),
		createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
			.default(sql`CURRENT_TIMESTAMP(3)`)
			.notNull()
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.formId, table.userId], name: 'FormResponse_pkey' }),
			formResponseFormIdFk: foreignKey({
				columns: [table.formId],
				foreignColumns: [eventForm.id],
				name: 'FormResponse_formId_fkey',
			}).onDelete('cascade').onUpdate('cascade'),
			formResponseUserIdFk: foreignKey({
				columns: [table.userId],
				foreignColumns: [user.id],
				name: 'FormResponse_userId_fkey',
			}).onDelete('cascade').onUpdate('cascade')
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
