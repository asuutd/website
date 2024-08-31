import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, text, integer, uniqueIndex } from 'drizzle-orm/pg-core';
import { user } from './user';

export const account = pgTable(
	'Account',
	{
		id: text('id')
			.$defaultFn(() => createId())
			.primaryKey()
			.notNull(),
		userId: text('userId').notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
		type: text('type').notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refreshToken: text('refresh_token'),
		accessToken: text('access_token'),
		expiresAt: integer('expires_at').notNull(),
		tokenType: text('token_type'),
		scope: text('scope').notNull(),
		idToken: text('id_token'),
		sessionState: text('session_state')
	},
	(table) => {
		return {
		providerProviderAccountIdKey: uniqueIndex("Account_provider_providerAccountId_key").using("btree", table.provider, table.providerAccountId),
	}
	}
);

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	})
}));
