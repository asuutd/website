import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, varchar, timestamp, unique } from 'drizzle-orm/pg-core';
import { account } from './account';
import { session } from './session';
import { ticket } from './ticket';
import { refCode } from './refcode';
import { eventAdmin } from './eventadmin';
import { organizer } from './organizer';

export const user = pgTable(
	'User',
	{
		id: varchar('id', { length: 128 })
			.$defaultFn(() => createId())
			.primaryKey(),
		name: varchar('name', { length: 191 }),
		email: varchar('email', { length: 191 }).notNull(),
		emailVerified: timestamp('emailVerified', { mode: 'date', precision: 3 }),
		image: varchar('image', { length: 191 })
	},
	(table) => {
		return {
			userEmailKey: unique('User_email_key').on(table.email)
		};
	}
);

export const userRelations = relations(user, ({ one, many }) => ({
	accounts: many(account),
	sessions: many(session),
	tickets: many(ticket),
	refcodes: many(refCode),
	admin_accounts: many(eventAdmin),
	organizer: one(organizer, { fields: [user.id], references: [organizer.id] })
}));
