import { relations } from 'drizzle-orm';
import { pgTable, timestamp, unique, text, foreignKey } from 'drizzle-orm/pg-core';
import { randomUUID } from 'crypto';
import { event } from './event';
import { user } from './user';

export const adminInvite = pgTable(
	'AdminInvite',
	{
		token: text('token')
			.$defaultFn(() => randomUUID())
			.primaryKey(),
		eventId: text('eventId').notNull(),
		email: text('email').notNull(),
		expiresAt: timestamp('expiresAt', { precision: 3 }).notNull()
	},
	(t) => ({
		unq: unique("AdminInvite_eventId_email_key").on(t.eventId, t.email),
		eventInviteEventIdFk: foreignKey({
			columns: [t.eventId],
			foreignColumns: [event.id],
			name: 'AdminInvite_eventId_fkey',
		}).onDelete('cascade').onUpdate('cascade'),
		// TODO: this index exists in the prisma schema, is this technically correct? i thought admin invite is just a fallback in case the user doesn't exist in the db, so we can't create a regular eventadmin right away.
		eventInviteEmailFk: foreignKey({
			columns: [t.email],
			foreignColumns: [user.email],
			name: 'AdminInvite_email_fkey',
		}).onDelete('cascade').onUpdate('cascade')

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
