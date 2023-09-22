import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { mysqlTable, varchar, datetime, unique } from 'drizzle-orm/mysql-core';
import { user } from './user';

export const session = mysqlTable(
	'Session',
	{
		id: varchar('id', { length: 128 })
			.$defaultFn(() => createId())
			.primaryKey(),
		sessionToken: varchar('sessionToken', { length: 191 }).notNull(),
		userId: varchar('userId', { length: 191 }).notNull(),
		expires: datetime('expires', { mode: 'date', fsp: 3 }).notNull()
	},
	(table) => {
		return {
			sessionSessionTokenKey: unique('Session_sessionToken_key').on(table.sessionToken)
		};
	}
);

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));
