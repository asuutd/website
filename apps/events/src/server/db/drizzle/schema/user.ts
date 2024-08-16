import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { index, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { account } from './account';
import { session } from './session';
import { ticket } from './ticket';
import { refCode } from './refcode';
import { eventAdmin } from './eventadmin';
import { organizer } from './organizer';

export const user = pgTable(
	'User',
	{
		id: text('id')
			.$defaultFn(() => createId())
			.primaryKey(),
		name: text('name'),
		email: text('email').notNull(),
		emailVerified: timestamp('emailVerified', { mode: 'date', precision: 3 }),
		image: text('image').default("/email_assets/Missing_avatar.svg")
	},
	(table) => {
		return {
			userEmailKey: unique('User_email_key').on(table.email),
			// TODO: only creating this index to replicate prisma schema - should we have 2 indexes on the same column? seems like this one is redundant because of the unique index but idk
			userEmailIdx: index('User_email_idx').on(table.email)
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
