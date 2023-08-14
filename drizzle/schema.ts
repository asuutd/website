import {
	pgTable,
	pgEnum,
	pgSchema,
	uuid,
	timestamp,
	bigint,
	text,
	smallint,
	varchar,
	foreignKey,
	integer,
	unique,
	boolean
} from 'drizzle-orm/pg-core';

export const factorType = pgEnum('factor_type', ['totp', 'webauthn']);
export const factorStatus = pgEnum('factor_status', ['unverified', 'verified']);
export const aalLevel = pgEnum('aal_level', ['aal1', 'aal2', 'aal3']);
export const codeChallengeMethod = pgEnum('code_challenge_method', ['s256', 'plain']);
export const action = pgEnum('action', ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR']);
export const equalityOp = pgEnum('equality_op', ['eq', 'neq', 'lt', 'lte', 'gt', 'gte']);

import { sql } from 'drizzle-orm';

export const events = pgTable('events', {
	id: uuid('id')
		.default(sql`uuid_generate_v4()`)
		.primaryKey()
		.notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
	date: timestamp('date', { withTimezone: true, mode: 'string' }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	numAttendants: bigint('num_attendants', { mode: 'number' }),
	description: text('description'),
	image: text('image'),
	type: text('type'),
	gif: text('GIF'),
	link: text('link'),
	name: text('name'),
	grayBy: timestamp('gray_by', { withTimezone: true, mode: 'string' }),
	importance: smallint('importance'),
	buttonText: varchar('button_text')
});

export const fallballQuestions = pgTable('fallball_questions', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
	q1: integer('q1'),
	q2: text('q2'),
	q3: text('q3'),
	peopleId: uuid('people_id').references(() => people.id)
});

export const soccerList = pgTable('Soccer List', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
	name: text('name'),
	netId: text('netID'),
	email: text('email'),
	phoneNumber: text('phone_number')
});

export const basketballList = pgTable('Basketball List', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
	name: text('name'),
	netId: text('netID'),
	email: text('email'),
	phoneNumber: text('phone_number')
});

export const volleyballList = pgTable('Volleyball List', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
	name: text('name'),
	netId: text('netID'),
	email: text('email'),
	phoneNumber: text('phone_number')
});

export const comments = pgTable('comments', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
	eventId: uuid('event_id').references(() => events.id),
	meetingFeedback: text('meeting_feedback'),
	peopleId: uuid('people_id').references(() => people.id),
	meetingIdeas: text('meeting_ideas')
});

export const danceInterest = pgTable('Dance Interest', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
	name: text('name'),
	netId: text('netID'),
	email: text('email'),
	phoneNumber: text('phone_number')
});

export const eventsPeople = pgTable('events_people', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
	peopleId: uuid('people_id').references(() => people.id),
	eventId: uuid('event_id').references(() => events.id),
	comments: text('comments')
});

export const attendanceCount = pgTable('attendance_count', {
	eventId: uuid('event_id'),
	name: text('name'),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }),
	type: text('type'),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	participants: bigint('participants', { mode: 'number' })
});

export const mailingList = pgTable(
	'Mailing List',
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
		email: text('email'),
		firstName: text('first_name'),
		lastName: text('last_name')
	},
	(table) => {
		return {
			mailingListEmailKey: unique('Mailing List_email_key').on(table.email)
		};
	}
);

export const detailedAttendance = pgTable('detailed_attendance', {
	peopleId: uuid('people_id'),
	firstName: text('first_name'),
	lastName: text('last_name'),
	netId: text('netID'),
	name: text('name')
});

export const peopleAttendanceCount = pgTable('people_attendance_count', {
	peopleId: uuid('people_id'),
	name: text('name'),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	eventsAttended: bigint('events_attended', { mode: 'number' })
});

export const people = pgTable(
	'people',
	{
		createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
		firstName: text('first_name'),
		lastName: text('last_name'),
		isPaid: boolean('is_paid'),
		paidAt: timestamp('paid_at', { withTimezone: true, mode: 'string' }),
		major: text('major'),
		netId: text('netID').notNull(),
		phoneNumber: text('phone_number'),
		email: text('email'),
		class: text('class'),
		id: uuid('id')
			.default(sql`uuid_generate_v4()`)
			.primaryKey()
			.notNull(),
		minor: varchar('minor'),
		name: text('name')
	},
	(table) => {
		return {
			peopleNetIdKey: unique('people_netID_key').on(table.netId)
		};
	}
);

export const africanNight = pgTable('african_night', {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
	suggestions: text('suggestions'),
	peopleId: uuid('people_id').references(() => people.id),
	artistDesigner: text('artist_designer')
});
