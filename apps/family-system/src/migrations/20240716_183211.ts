import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 DROP TABLE "families_rels";`)
};

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`
 CREATE TABLE IF NOT EXISTS "families_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"members_id" integer
);

CREATE INDEX IF NOT EXISTS "families_rels_order_idx" ON "families_rels" ("order");
CREATE INDEX IF NOT EXISTS "families_rels_parent_idx" ON "families_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "families_rels_path_idx" ON "families_rels" ("path");
DO $$ BEGIN
 ALTER TABLE "families_rels" ADD CONSTRAINT "families_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "families"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "families_rels" ADD CONSTRAINT "families_rels_members_fk" FOREIGN KEY ("members_id") REFERENCES "members"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`)
};
