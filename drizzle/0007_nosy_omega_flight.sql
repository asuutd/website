DO $$ BEGIN
 CREATE TYPE "user_type" AS ENUM('member', 'paid', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"created_at" timestamp with time zone DEFAULT now(),
	"user_type" "user_type" DEFAULT 'member',
	"paid_at" timestamp with time zone,
	"major" text,
	"netID" text,
	"phone_number" text,
	"email" text NOT NULL,
	"class" text,
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"minor" varchar,
	"name" text,
	"emailVerified" timestamp,
	"image" text,
	CONSTRAINT "user_netID_unique" UNIQUE("netID"),
	CONSTRAINT "people_netID_key" UNIQUE("netID")
);
--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "account_userId_people_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_userId_people_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
