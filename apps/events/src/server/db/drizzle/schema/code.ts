import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, text, doublePrecision, integer, unique } from 'drizzle-orm/pg-core';
import { tier } from './tier';
import { ticket } from './ticket';

export const code = pgTable(
	'Code',
	{
		id: text('id')
			.$defaultFn(() => createId())
			.primaryKey()
			.notNull(),
		code: text('code').notNull(),
		tierId: text('tierId').notNull().references(() => tier.id, { onDelete: "cascade", onUpdate: "cascade" } ),
		type: text('type').notNull(),
		value: doublePrecision('value').notNull(),
		limit: integer('limit').notNull(),
		notes: text('notes').default('')
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
