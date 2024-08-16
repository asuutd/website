import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, text, primaryKey, pgEnum, unique, foreignKey } from 'drizzle-orm/pg-core';
import { event } from './event';
import { user } from './user';

const adminRoleEnum = pgEnum('Admin_Type', ['OWNER', 'SUPER_ADMIN', 'ADMIN']);
export const eventAdmin = pgTable(
	'EventAdmin',
	{
		id: text('id')
			.$defaultFn(() => createId()),
		eventId: text('eventId').notNull(),
		userId: text('userId').notNull(),
		role: adminRoleEnum('role').default('ADMIN').notNull()
	},
	(table) => {
		return {
			eventAdminIdPk: primaryKey({ name: "EventAdmin_pkey", columns: [table.id] }),
			eventAdminEventIdFk: foreignKey({
				columns: [table.eventId],
				foreignColumns: [event.id],
				name: 'EventAdmin_eventId_fkey',
			}).onDelete('cascade').onUpdate('cascade'),
			eventAdminUserIdFk: foreignKey({
				columns: [table.userId],
				foreignColumns: [user.id],
				name: 'EventAdmin_userId_fkey',
			}).onDelete('cascade').onUpdate('cascade'),
			eventAdminEventIdUserIdKey: unique('EventAdmin_eventId_userId_key').on(table.eventId, table.userId)
		};
	}
);

export const eventAdminRelations = relations(eventAdmin, ({ one }) => ({
	event: one(event, {
		fields: [eventAdmin.eventId],
		references: [event.id]
	}),
	user: one(user, {
		fields: [eventAdmin.userId],
		references: [user.id]
	})
}));
