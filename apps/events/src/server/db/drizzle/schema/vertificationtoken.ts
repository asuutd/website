import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const verificationToken = pgTable("VerificationToken", {
	identifier: text("identifier").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { precision: 3, mode: 'date' }).notNull(),
},
(table) => {
	return {
		identifierTokenKey: uniqueIndex("VerificationToken_identifier_token_key").using("btree", table.identifier, table.token),
		tokenKey: uniqueIndex("VerificationToken_token_key").using("btree", table.token),
	}
});
