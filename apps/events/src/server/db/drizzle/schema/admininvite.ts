import { relations, sql } from 'drizzle-orm';
import { pgTable, timestamp, uniqueIndex, text, foreignKey } from 'drizzle-orm/pg-core';
import { randomUUID } from 'crypto';
import { event } from './event';
import { user } from './user';

export const adminInvite = pgTable(
	'AdminInvite',
	{
		token: text('token')
			.$defaultFn(() => randomUUID())
			.primaryKey()
			.notNull(),
		eventId: text("eventId").notNull().references(() => event.id, { onUpdate: "cascade" } ),
		email: text('email').notNull().references(() => user.email, { onDelete: "cascade", onUpdate: "cascade" } ),
		expiresAt: timestamp('expiresAt', { precision: 3 }).notNull().default(sql`NOW + '72:00:00'::interval `)
	},
	(table) => ({
		eventIdEmailKey: uniqueIndex("AdminInvite_eventId_email_key").using("btree", table.eventId, table.email),
		eventInviteEventIdFk: foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: 'AdminInvite_eventId_fkey',
		}).onDelete('cascade').onUpdate('cascade'),
		// TODO: this index exists in the prisma schema, is this technically correct? i thought admin invite is just a fallback in case the user doesn't exist in the db, so we can't create a regular eventadmin right away.
		eventInviteEmailFk: foreignKey({
			columns: [table.email],
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
