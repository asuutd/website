import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "members" ALTER COLUMN "jonze_tags" SET DEFAULT '["#fam-no-family-assigned"]'::jsonb;
  ALTER TABLE "users" ADD COLUMN "enable_a_p_i_key" boolean;
  ALTER TABLE "users" ADD COLUMN "api_key" varchar;
  ALTER TABLE "users" ADD COLUMN "api_key_index" varchar;`)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(sql`
   ALTER TABLE "members" ALTER COLUMN "jonze_tags" SET DEFAULT '["__default"]'::jsonb;
  ALTER TABLE "users" DROP COLUMN IF EXISTS "enable_a_p_i_key";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "api_key";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "api_key_index";`)
}
