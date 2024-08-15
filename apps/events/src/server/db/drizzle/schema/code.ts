import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, varchar, numeric, integer, unique } from 'drizzle-orm/pg-core';
import { tier } from './tier';
import { ticket } from './ticket';

export const code = pgTable(
	'Code',
	{
		id: varchar('id', { length: 128 })
			.$defaultFn(() => createId())
			.primaryKey(),
		code: varchar('code', { length: 191 }).notNull(),
		tierId: varchar('tierId', { length: 191 }).notNull(),
		type: varchar('type', { length: 191 }).notNull(),
		value: numeric('value').notNull(),
		limit: integer('limit').notNull(),
		notes: varchar('notes', { length: 191 }).notNull().default('')
	},
	(table) => {
		return {
			codeCodeTierIdKey: unique('Code_code_tierId_key').on(table.code, table.tierId)
		};
	}
);

export const codeRelations = relations(code, ({ one, many }) => ({
	tier: one(tier, {
		fields: [code.tierId],
		references: [tier.id]
	}),
	tickets: many(ticket)
}));
