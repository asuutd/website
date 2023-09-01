ALTER TABLE "african_night" ALTER COLUMN "id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "Basketball List" ALTER COLUMN "id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "Dance Interest" ALTER COLUMN "id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "events_people" ALTER COLUMN "id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "fallball_questions" ALTER COLUMN "id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "Mailing List" ALTER COLUMN "id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "Soccer List" ALTER COLUMN "id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "Volleyball List" ALTER COLUMN "id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "african_night" ADD COLUMN "serial" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "Basketball List" ADD COLUMN "serial" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "serial" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "Dance Interest" ADD COLUMN "serial" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "events_people" ADD COLUMN "serial" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "fallball_questions" ADD COLUMN "serial" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "Mailing List" ADD COLUMN "serial" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "Soccer List" ADD COLUMN "serial" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "Volleyball List" ADD COLUMN "serial" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "updated_at";