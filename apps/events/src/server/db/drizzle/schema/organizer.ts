import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { user } from './user';
import { event } from './event';

export const organizer = mysqlTable('Organizer', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	stripeAccountId: varchar('stripeAccountId', { length: 191 })
});

export const organizerRelations = relations(organizer, ({ one, many }) => ({
	user: one(user, {
		fields: [organizer.id],
		references: [user.id]
	}),
	events: many(event)
}));
