import { pgTable, varchar, datetime, unique } from 'drizzle-orm/pg-core';

export const verificationToken = pgTable(
	'VerificationToken',
	{
		identifier: varchar('identifier', { length: 191 }).notNull(),
		token: varchar('token', { length: 191 }).notNull(),
		expires: datetime('expires', { mode: 'date', fsp: 3 }).notNull()
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
