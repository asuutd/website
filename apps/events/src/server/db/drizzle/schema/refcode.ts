import { relations } from 'drizzle-orm';
import { foreignKey, pgTable, serial, text, unique } from 'drizzle-orm/pg-core';
import { user } from './user';
import { event } from './event';
import { ticket } from './ticket';

export const refCode = pgTable(
	'RefCode',
	{
		// TODO: need to figure out how to make this use a specific squeence (RefCode_id_seq)
		id: serial('id').primaryKey(),
		code: text('code').notNull(),
		userId: text('userId').notNull(),
		eventId: text('eventId').notNull()
	},
	(table) => {
		return {
			refCodeUserIdEventIdKey: unique('RefCode_userId_eventId_key').on(table.userId, table.eventId),
			refCodeEventIdFk: foreignKey({
				columns: [table.eventId],
				foreignColumns: [event.id],
				name: 'RefCode_eventId_fkey',
			}).onDelete('cascade').onUpdate('cascade'),
			refCodeUserIdFk: foreignKey({
				columns: [table.userId],
				foreignColumns: [user.id],
				name: 'RefCode_userId_fkey',
			}).onDelete('cascade').onUpdate('cascade')
		};
	}
);

export const refCodeRelations = relations(refCode, ({ one, many }) => ({
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
