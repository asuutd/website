DO $$ BEGIN
 CREATE TYPE "aal_level" AS ENUM('aal1', 'aal2', 'aal3');
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
 CREATE TYPE "code_challenge_method" AS ENUM('s256', 'plain');
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
DO $$ BEGIN
 CREATE TYPE "factor_status" AS ENUM('unverified', 'verified');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "factor_type" AS ENUM('totp', 'webauthn');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT account_provider_providerAccountId PRIMARY KEY("provider","providerAccountId")
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
CREATE TABLE IF NOT EXISTS "Basketball List" (
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
CREATE TABLE IF NOT EXISTS "events_people" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"people_id" uuid,
	"event_id" uuid,
	"comments" text
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
CREATE TABLE IF NOT EXISTS "Mailing List" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"email" text,
	"first_name" text,
	"last_name" text,
	CONSTRAINT "Mailing List_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL
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
CREATE TABLE IF NOT EXISTS "users" (
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
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "people_netID_key" UNIQUE("netID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT verificationToken_identifier_token PRIMARY KEY("identifier","token")
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
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "african_night" ADD CONSTRAINT "african_night_people_id_users_id_fk" FOREIGN KEY ("people_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_people_id_users_id_fk" FOREIGN KEY ("people_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events_people" ADD CONSTRAINT "events_people_people_id_users_id_fk" FOREIGN KEY ("people_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events_people" ADD CONSTRAINT "events_people_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fallball_questions" ADD CONSTRAINT "fallball_questions_people_id_users_id_fk" FOREIGN KEY ("people_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
