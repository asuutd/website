-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
DO $$ BEGIN
 CREATE TYPE "factor_type" AS ENUM('totp', 'webauthn');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "factor_status" AS ENUM('unverified', 'verified');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "aal_level" AS ENUM('aal1', 'aal2', 'aal3');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "code_challenge_method" AS ENUM('s256', 'plain');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "action" AS ENUM('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "equality_op" AS ENUM('eq', 'neq', 'lt', 'lte', 'gt', 'gte');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"date" timestamp with time zone,
	"num_attendants" bigint,
	"description" text,
	"image" text,
	"type" text,
	"GIF" text,
	"link" text,
	"name" text,
	"gray_by" timestamp with time zone,
	"importance" smallint,
	"button_text" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fallball_questions" (
	"id" bigint PRIMARY KEY NOT NULL,
	"q1" integer,
	"q2" text,
	"q3" text,
	"people_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Soccer List" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"name" text,
	"netID" text,
	"email" text,
	"phone_number" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Basketball List" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"name" text,
	"netID" text,
	"email" text,
	"phone_number" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Volleyball List" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"name" text,
	"netID" text,
	"email" text,
	"phone_number" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"event_id" uuid,
	"meeting_feedback" text,
	"people_id" uuid,
	"meeting_ideas" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Dance Interest" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"name" text,
	"netID" text,
	"email" text,
	"phone_number" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events_people" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"people_id" uuid,
	"event_id" uuid,
	"comments" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "attendance_count" (
	"event_id" uuid,
	"name" text,
	"created_at" timestamp with time zone,
	"type" text,
	"participants" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Mailing List" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"email" text,
	"first_name" text,
	"last_name" text,
	CONSTRAINT "Mailing List_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "detailed_attendance" (
	"people_id" uuid,
	"first_name" text,
	"last_name" text,
	"netID" text,
	"name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "people_attendance_count" (
	"people_id" uuid,
	"name" text,
	"events_attended" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "people" (
	"created_at" timestamp with time zone DEFAULT now(),
	"first_name" text,
	"last_name" text,
	"is_paid" boolean,
	"paid_at" timestamp with time zone,
	"major" text,
	"netID" text NOT NULL,
	"phone_number" text,
	"email" text,
	"class" text,
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"minor" varchar,
	"name" text,
	CONSTRAINT "people_netID_key" UNIQUE("netID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "african_night" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"suggestions" text,
	"people_id" uuid,
	"artist_designer" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fallball_questions" ADD CONSTRAINT "fallball_questions_people_id_fkey" FOREIGN KEY ("people_id") REFERENCES "people"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_people_id_fkey" FOREIGN KEY ("people_id") REFERENCES "people"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events_people" ADD CONSTRAINT "events_people_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events_people" ADD CONSTRAINT "events_people_people_id_fkey" FOREIGN KEY ("people_id") REFERENCES "people"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "african_night" ADD CONSTRAINT "african_night_people_id_fkey" FOREIGN KEY ("people_id") REFERENCES "people"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/