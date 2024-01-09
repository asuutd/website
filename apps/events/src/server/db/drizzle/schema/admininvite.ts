import { relations } from 'drizzle-orm';
import { mysqlTable, unique, varchar } from 'drizzle-orm/mysql-core';
import { randomUUID } from 'crypto';
import { event } from './event';
import { user } from './user';

export const adminInvite = mysqlTable(
	'AdminInvite',
	{
		token: varchar('id', { length: 128 })
			.$defaultFn(() => randomUUID())
			.primaryKey(),
		eventId: varchar('eventId', { length: 191 }).notNull(),
		email: varchar('email', { length: 191 }).notNull()
	},
	(t) => ({
		unq: unique().on(t.eventId, t.email)
	})
);

export const adminInviteRelations = relations(adminInvite, ({ one }) => ({
	event: one(event, {
		fields: [adminInvite.eventId],
		references: [event.id]
	}),
	user: one(user, {
		fields: [adminInvite.email],
		references: [user.email]
	})
}));
