-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
DO $$ BEGIN
 CREATE TYPE "public"."Admin_Type" AS ENUM('ADMIN', 'SUPER_ADMIN', 'OWNER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."Fee_Holder" AS ENUM('USER', 'ORGANIZER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE SEQUENCE "public"."RefCode_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "EventForm" (
	"id" text PRIMARY KEY NOT NULL,
	"eventId" text NOT NULL,
	"form" jsonb NOT NULL,
	"updatedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "EventLocation" (
	"id" text PRIMARY KEY NOT NULL,
	"long" double precision NOT NULL,
	"lat" double precision NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Organizer" (
	"id" text PRIMARY KEY NOT NULL,
	"stripeAccountId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "VerificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Session" (
	"id" text PRIMARY KEY NOT NULL,
	"sessionToken" text NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Event" (
	"id" text PRIMARY KEY NOT NULL,
	"start" timestamp(3) NOT NULL,
	"end" timestamp(3) NOT NULL,
	"name" text NOT NULL,
	"image" text,
	"ticketImage" text,
	"description" text,
	"ref_quantity" integer,
	"organizerId" text,
	"google_pass_class_created" boolean DEFAULT false NOT NULL,
	"fee_holder" "Fee_Holder"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "EventAdmin" (
	"id" text PRIMARY KEY NOT NULL,
	"eventId" text NOT NULL,
	"userId" text NOT NULL,
	"role" "Admin_Type" DEFAULT 'ADMIN' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AdminInvite" (
	"token" text PRIMARY KEY NOT NULL,
	"eventId" text NOT NULL,
	"email" text NOT NULL,
	"expiresAt" timestamp(3) DEFAULT (now() + '72:00:00'::interval) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp(3),
	"image" text DEFAULT '/email_assets/Missing_avatar.svg'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Tier" (
	"id" text PRIMARY KEY NOT NULL,
	"price" double precision NOT NULL,
	"start" timestamp(3) NOT NULL,
	"end" timestamp(3) NOT NULL,
	"eventId" text NOT NULL,
	"name" text NOT NULL,
	"limit" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Code" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"tierId" text NOT NULL,
	"type" text NOT NULL,
	"value" double precision NOT NULL,
	"limit" integer NOT NULL,
	"notes" text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Account" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer NOT NULL,
	"token_type" text,
	"scope" text NOT NULL,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Ticket" (
	"id" text PRIMARY KEY NOT NULL,
	"codeId" text,
	"tierId" text,
	"eventId" text NOT NULL,
	"userId" text NOT NULL,
	"refCodeId" integer,
	"checkedInAt" timestamp(3),
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"paymentIntent" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "RefCode" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"userId" text NOT NULL,
	"eventId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "FormResponse" (
	"formId" text NOT NULL,
	"userId" text NOT NULL,
	"response" jsonb NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "FormResponse_pkey" PRIMARY KEY("formId","userId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "EventForm" ADD CONSTRAINT "EventForm_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "EventLocation" ADD CONSTRAINT "EventLocation_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Organizer" ADD CONSTRAINT "Organizer_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Event" ADD CONSTRAINT "Event_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "public"."Organizer"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "EventAdmin" ADD CONSTRAINT "EventAdmin_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "EventAdmin" ADD CONSTRAINT "EventAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AdminInvite" ADD CONSTRAINT "AdminInvite_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AdminInvite" ADD CONSTRAINT "AdminInvite_email_fkey" FOREIGN KEY ("email") REFERENCES "public"."User"("email") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Tier" ADD CONSTRAINT "Tier_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Code" ADD CONSTRAINT "Code_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "public"."Tier"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "public"."Tier"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_refCodeId_fkey" FOREIGN KEY ("refCodeId") REFERENCES "public"."RefCode"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "public"."Code"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RefCode" ADD CONSTRAINT "RefCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RefCode" ADD CONSTRAINT "RefCode_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FormResponse" ADD CONSTRAINT "FormResponse_formId_fkey" FOREIGN KEY ("formId") REFERENCES "public"."EventForm"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "FormResponse" ADD CONSTRAINT "FormResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "EventForm_eventId_idx" ON "EventForm" USING btree ("eventId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken" USING btree ("identifier" text_ops,"token" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken" USING btree ("token" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session" USING btree ("sessionToken" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "EventAdmin_eventId_userId_key" ON "EventAdmin" USING btree ("eventId" text_ops,"userId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "AdminInvite_eventId_email_key" ON "AdminInvite" USING btree ("eventId" text_ops,"email" text_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User" USING btree ("email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Code_code_tierId_key" ON "Code" USING btree ("code" text_ops,"tierId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account" USING btree ("provider" text_ops,"providerAccountId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "RefCode_userId_eventId_key" ON "RefCode" USING btree ("userId" text_ops,"eventId" text_ops);
*/