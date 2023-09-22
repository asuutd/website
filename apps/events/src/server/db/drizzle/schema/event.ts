import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { datetime, int, mysqlEnum, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { organizer } from './organizer';
import { ticket } from './ticket';
import { refCode } from './refcode';
import { tier } from './tier';
import { eventAdmin } from './eventadmin';
import { eventLocation } from './eventlocation';

export const event = mysqlTable('Event', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	start: datetime('start', { mode: 'date', fsp: 3 }).notNull(),
	end: datetime('end', { mode: 'date', fsp: 3 }).notNull(),
	name: varchar('name', { length: 191 }).notNull(),
	image: varchar('image', { length: 191 }),
	refQuantity: int('ref_quantity'),
	organizerId: varchar('organizerId', { length: 191 }),
	ticketImage: varchar('ticketImage', { length: 191 }),
	description: text('description'),
	feeHolder: mysqlEnum('fee_holder', ['USER', 'ORGANIZER'])
});

export const eventRelations = relations(event, ({ one, many }) => ({
	organizer: one(organizer, {
		fields: [event.organizerId],
		references: [organizer.id]
	}),
	tickets: many(ticket),
	refcodes: many(refCode),
	tiers: many(tier),
	admins: many(eventAdmin),
	location: one(eventLocation, {
		fields: [event.id],
		references: [eventLocation.id]
	})
}));
