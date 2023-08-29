ALTER TABLE "account" DROP CONSTRAINT "account_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "african_night" DROP CONSTRAINT "african_night_people_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_people_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "events_people" DROP CONSTRAINT "events_people_people_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "fallball_questions" DROP CONSTRAINT "fallball_questions_people_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT "session_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user" RENAME TO "people";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_people_id_fk" FOREIGN KEY ("userId") REFERENCES "people"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "african_night" ADD CONSTRAINT "african_night_people_id_people_id_fk" FOREIGN KEY ("people_id") REFERENCES "people"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_people_id_people_id_fk" FOREIGN KEY ("people_id") REFERENCES "people"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events_people" ADD CONSTRAINT "events_people_people_id_people_id_fk" FOREIGN KEY ("people_id") REFERENCES "people"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fallball_questions" ADD CONSTRAINT "fallball_questions_people_id_people_id_fk" FOREIGN KEY ("people_id") REFERENCES "people"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_people_id_fk" FOREIGN KEY ("userId") REFERENCES "people"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
