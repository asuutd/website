import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, varchar, text, int, unique } from 'drizzle-orm/pg-core';
import { user } from './user';

export const account = pgTable(
	'Account',
	{
		id: varchar('id', { length: 128 })
			.$defaultFn(() => createId())
			.primaryKey(),
		userId: varchar('userId', { length: 191 }).notNull(),
		type: varchar('type', { length: 191 }).notNull(),
		provider: varchar('provider', { length: 191 }).notNull(),
		providerAccountId: varchar('providerAccountId', { length: 191 }).notNull(),
		refreshToken: text('refresh_token'),
		accessToken: text('access_token'),
		expiresAt: int('expires_at'),
		tokenType: varchar('token_type', { length: 191 }),
		scope: varchar('scope', { length: 191 }),
		idToken: text('id_token'),
		sessionState: varchar('session_state', { length: 191 })
	},
	(table) => {
		return {
			accountProviderProviderAccountIdKey: unique('Account_provider_providerAccountId_key').on(
				table.provider,
				table.providerAccountId
			)
		};
	}
);

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	})
}));
