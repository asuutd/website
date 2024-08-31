import { relations } from 'drizzle-orm';
import { pgTable, text, primaryKey, foreignKey } from 'drizzle-orm/pg-core';
import { user } from './user';
import { event } from './event';

export const organizer = pgTable("Organizer", {
	id: text("id").primaryKey().notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	stripeAccountId: text("stripeAccountId"),
});

export const organizerRelations = relations(organizer, ({ one, many }) => ({
	user: one(user, {
		fields: [organizer.id],
		references: [user.id]
	}),
	events: many(event)
}));
