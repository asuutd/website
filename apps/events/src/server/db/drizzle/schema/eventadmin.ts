import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, varchar, primaryKey, pgEnum } from 'drizzle-orm/pg-core';
import { event } from './event';
import { user } from './user';

const adminRoleEnum = pgEnum('role', ['OWNER', 'SUPER_ADMIN', 'ADMIN']);
export const eventAdmin = pgTable(
	'EventAdmin',
	{
		id: varchar('id', { length: 128 })
			.$defaultFn(() => createId())
			.primaryKey(),
		eventId: varchar('eventId', { length: 191 }).notNull(),
		userId: varchar('userId', { length: 191 }).notNull(),
		role: adminRoleEnum('role').default('ADMIN').notNull()
	},
	(table) => {
		return {
			eventAdminId: primaryKey({ columns: [table.id] })
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
