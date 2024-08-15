import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import { pgTable, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user';
import { event } from './event';
import { refCode } from './refcode';
import { tier } from './tier';
import { code } from './code';

export const ticket = pgTable('Ticket', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	codeId: varchar('codeId', { length: 191 }),
	tierId: varchar('tierId', { length: 191 }),
	eventId: varchar('eventId', { length: 191 }).notNull(),
	userId: varchar('userId', { length: 191 }).notNull(),
	refCodeId: integer('refCodeId'),
	checkedInAt: timestamp('checkedInAt', { mode: 'date', precision: 3 }),
	createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
		.default(sql`CURRENT_TIMESTAMP(3)`)
		.notNull(),
	paymentIntent: varchar('paymentIntent', { length: 191 })
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
