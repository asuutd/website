import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { timestamp, integer, pgEnum, pgTable, text, boolean, foreignKey } from 'drizzle-orm/pg-core';
import { organizer } from './organizer';
import { ticket } from './ticket';
import { refCode } from './refcode';
import { tier } from './tier';
import { eventAdmin } from './eventadmin';
import { eventLocation } from './eventlocation';
import { eventForm } from './eventform';

const feeHolderEnum = pgEnum('Fee_Holder', ['USER', 'ORGANIZER']);

export const event = pgTable('Event', {
	id: text('id')
		.$defaultFn(() => createId())
		.primaryKey(),
	start: timestamp('start', { mode: 'date', precision: 3 }).notNull(),
	end: timestamp('end', { mode: 'date', precision: 3 }).notNull(),
	name: text('name').notNull(),
	image: text('image'),
	refQuantity: integer('ref_quantity'),
	organizerId: text('organizerId'),
	ticketImage: text('ticketImage'),
	description: text('description'),
	// TODO: this should be non nullable and have a default, but this isn't the case in the prisma schema.
	feeHolder: feeHolderEnum('fee_holder'),
	google_pass_class_created: boolean('google_pass_class_created').default(false).notNull()
},
(table) => {
	return {
		eventOrganizerIdFk: foreignKey({
			columns: [table.organizerId],
			foreignColumns: [organizer.id],
			name: 'Event_organizerId_fkey',
		}).onDelete('cascade').onUpdate('cascade'),
	}
}
)

export const eventRelations = relations(event, ({ one, many }) => ({
	organizer: one(organizer, {
		fields: [event.organizerId],
		references: [organizer.id]
	}),
	location: one(eventLocation, {
		fields: [event.id],
		references: [eventLocation.id]
	}),
	tickets: many(ticket),
	refcodes: many(refCode),
	tiers: many(tier),
	admins: many(eventAdmin),
	forms: many(eventForm)
}));
