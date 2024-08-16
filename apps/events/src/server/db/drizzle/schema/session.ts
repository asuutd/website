import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { user } from './user';

export const session = pgTable(
	'Session',
	{
		id: text('id')
			.$defaultFn(() => createId())
			.primaryKey(),
		sessionToken: text('sessionToken').notNull().unique('Session_sessionToken_key'),
		userId: text('userId').notNull(),
		expires: timestamp('expires', { mode: 'date', precision: 3 }).notNull()
	}
);

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));
