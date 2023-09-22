import { relations } from 'drizzle-orm';
import { mysqlTable, serial, varchar, unique } from 'drizzle-orm/mysql-core';
import { user } from './user';
import { event } from './event';
import { ticket } from './ticket';

export const refCode = mysqlTable(
	'RefCode',
	{
		id: serial('id').primaryKey(),
		code: varchar('code', { length: 191 }).notNull(),
		userId: varchar('userId', { length: 191 }).notNull(),
		eventId: varchar('eventId', { length: 191 }).notNull()
	},
	(table) => {
		return {
			refCodeUserIdEventIdKey: unique('RefCode_userId_eventId_key').on(table.userId, table.eventId)
		};
	}
);

export const eventRelations = relations(refCode, ({ one, many }) => ({
	user: one(user, {
		fields: [refCode.userId],
		references: [user.id]
	}),
	event: one(event, {
		fields: [refCode.eventId],
		references: [event.id]
	}),
	tickets: many(ticket)
}));
