import { relations } from 'drizzle-orm';
import { pgTable, text, primaryKey, foreignKey } from 'drizzle-orm/pg-core';
import { user } from './user';
import { event } from './event';

export const organizer = pgTable('Organizer', {
	id: text('id'),
	stripeAccountId: text('stripeAccountId')
},
(table) => {
	return {
		organizerIdPk: primaryKey({ name: "Organizer_pkey", columns: [table.id] }),
		organizerIdFk: foreignKey({
			columns: [table.id],
			foreignColumns: [user.id],
			name: 'Organizer_id_fkey',
		}).onDelete('cascade').onUpdate('cascade')
	}
})

export const organizerRelations = relations(organizer, ({ one, many }) => ({
	user: one(user, {
		fields: [organizer.id],
		references: [user.id]
	}),
	events: many(event)
}));
