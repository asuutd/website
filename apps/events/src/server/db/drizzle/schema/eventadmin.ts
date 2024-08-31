import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, text, primaryKey, pgEnum, uniqueIndex, foreignKey } from 'drizzle-orm/pg-core';
import { event } from './event';
import { user } from './user';

const adminRoleEnum = pgEnum('Admin_Type', ['OWNER', 'SUPER_ADMIN', 'ADMIN']);
export const eventAdmin = pgTable(
	'EventAdmin',
	{
		id: text('id')
			.$defaultFn(() => createId())
			.primaryKey()
			.notNull(),
		eventId: text("eventId").notNull().references(() => event.id, { onUpdate: "cascade" } ),
		userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
		role: adminRoleEnum('role').default('ADMIN').notNull()
	},
	(table) => {
		return {
			eventIdUserIdKey: uniqueIndex("EventAdmin_eventId_userId_key").using("btree", table.eventId, table.userId),
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
