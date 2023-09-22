import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { mysqlTable, varchar, datetime, unique } from 'drizzle-orm/mysql-core';
import { account } from './account';
import { session } from './session';
import { ticket } from './ticket';
import { refCode } from './refcode';
import { eventAdmin } from './eventadmin';
import { organizer } from './organizer';

export const user = mysqlTable(
	'User',
	{
		id: varchar('id', { length: 128 })
			.$defaultFn(() => createId())
			.primaryKey(),
		name: varchar('name', { length: 191 }),
		email: varchar('email', { length: 191 }).notNull(),
		emailVerified: datetime('emailVerified', { mode: 'date', fsp: 3 }),
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
