import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { mysqlTable, varchar, primaryKey } from 'drizzle-orm/mysql-core';
import { event } from './event';
import { user } from './user';

export const eventAdmin = mysqlTable(
	'EventAdmin',
	{
		id: varchar('id', { length: 128 })
			.$defaultFn(() => createId())
			.primaryKey(),
		eventId: varchar('eventId', { length: 191 }).notNull(),
		userId: varchar('userId', { length: 191 }).notNull()
	},
	(table) => {
		return {
			eventAdminId: primaryKey(table.id)
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
