import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import { pgTable, text, integer, timestamp, foreignKey } from 'drizzle-orm/pg-core';
import { user } from './user';
import { event } from './event';
import { refCode } from './refcode';
import { tier } from './tier';
import { code } from './code';

export const ticket = pgTable('Ticket', {
	id: text('id')
		.$defaultFn(() => createId())
		.primaryKey(),
	codeId: text('codeId'),
	tierId: text('tierId'),
	eventId: text('eventId').notNull(),
	userId: text('userId').notNull(),
	refCodeId: integer('refCodeId'),
	checkedInAt: timestamp('checkedInAt', { mode: 'date', precision: 3 }),
	createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
		.default(sql`CURRENT_TIMESTAMP(3)`)
		.notNull(),
	paymentIntent: text('paymentIntent')
}, (table) => {
	return {
		ticketCodeIdFk: foreignKey({
			columns: [table.codeId],
			foreignColumns: [code.id],
			name: 'Ticket_codeId_fkey',
		}).onDelete('cascade').onUpdate('cascade'),
		ticketTierIdFk: foreignKey({
			columns: [table.tierId],
			foreignColumns: [tier.id],
			name: 'Ticket_tierId_fkey',
		}).onDelete('cascade').onUpdate('cascade'),
		ticketEventIdFk: foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: 'Ticket_eventId_fkey',
		}).onDelete('cascade').onUpdate('cascade'),
		ticketUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: 'Ticket_userId_fkey',
		}).onDelete('cascade').onUpdate('cascade'),
		ticketRefCodeIdFk: foreignKey({
			columns: [table.refCodeId],
			foreignColumns: [refCode.id],
			name: 'Ticket_refCodeId_fkey',
		}).onDelete('cascade').onUpdate('cascade')
	};
});

export const ticketRelations = relations(ticket, ({ one }) => ({
	user: one(user, {
		fields: [ticket.userId],
		references: [user.id]
	}),
	event: one(event, {
		fields: [ticket.eventId],
		references: [event.id]
	}),
	refCode: one(refCode, {
		fields: [ticket.refCodeId],
		references: [refCode.id]
	}),
	tier: one(tier, {
		fields: [ticket.tierId],
		references: [tier.id]
	}),
	code: one(code, {
		fields: [ticket.codeId],
		references: [code.id]
	})
}));
