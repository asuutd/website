import { pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';

export const verificationToken = pgTable(
	'VerificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date', precision: 3 }).notNull()
	},
	(table) => {
		return {
			verificationTokenIdentifierTokenKey: unique('VerificationToken_identifier_token_key').on(
				table.identifier,
				table.token
			),
			verificationTokenTokenKey: unique('VerificationToken_token_key').on(table.token)
		};
	}
);
