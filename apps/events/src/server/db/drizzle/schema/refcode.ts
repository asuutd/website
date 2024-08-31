import { relations } from 'drizzle-orm';
import { foreignKey, pgTable, serial, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { user } from './user';
import { event } from './event';
import { ticket } from './ticket';

export const refCode = pgTable(
	'RefCode',
	{
		// TODO: need to figure out how to make this use a specific squeence (RefCode_id_seq)
		id: serial('id').primaryKey().notNull(),
		code: text('code').notNull(),
		userId: text('userId').notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
		eventId: text('eventId').notNull().references(() => event.id, { onDelete: "cascade", onUpdate: "cascade" } )
	},
	(table) => {
		return {
			refCodeUserIdEventIdKey: uniqueIndex("RefCode_userId_eventId_key").using("btree", table.userId, table.eventId)
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
