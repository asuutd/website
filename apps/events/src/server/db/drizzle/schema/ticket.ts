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
		.primaryKey()
		.notNull(),
	codeId: text('codeId').references(() => code.id, { onUpdate: "cascade" } ),
	tierId: text('tierId').references(() => event.id, { onUpdate: "cascade" } ),
	eventId: text('eventId').notNull().references(() => event.id, { onUpdate: "cascade" } ),
	userId: text('userId').notNull(),
	refCodeId: integer('refCodeId').references(() => refCode.id, { onUpdate: "cascade" } ),
	checkedInAt: timestamp('checkedInAt', { mode: 'date', precision: 3 }),
	createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
		.defaultNow()
		.notNull(),
	paymentIntent: text('paymentIntent')
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
