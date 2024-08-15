import type { BasePayload, CollectionConfig } from 'payload';
import { recalculateScores } from '@/utils/scores';
import { LedgerEntry, Member } from '@/payload-types';
import { z } from 'zod';
import { zodToJsonSchema } from "zod-to-json-schema";
import { arrayContains, inArray, sql } from 'drizzle-orm';


const jonzeAttendanceSchema = z.object({
  id: z.string(),
  memId: z.string(),
  eventId: z.string(),
  responseId: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
})

export type JonzeAttendance = z.infer<typeof jonzeAttendanceSchema>

export const createLedgerEntryForEventAttendance = async (payload: BasePayload, a: JonzeAttendance) => {
  const memberDocs = await payload.find({
    collection: 'members',
    where: {
      jonze_member_id: {
        equals: a.memId
      }
    }
  })
  
  let member: Member = memberDocs.docs[0];
  if (!member) {
    member = await payload.create({
      collection: 'members',
      data: {
        jonze_member_id: a.memId,
        jonze_name: "__No Name"
      }
    })
  }
  
  const thing = await payload.db.drizzle
		.select({familyId: payload.db.tables.families.id})
		.from(payload.db.tables.families)
		.where(
			inArray(payload.db.tables.families.jonze_family_tag, member.jonze_tags)
		).limit(1)
  
  const [{familyId}] = thing
  
  const PTS_FOR_EVENT_ATTENDANCE = 10 as const
  
  const newLedgerEntry = await payload.create({
    collection: 'ledger_entries',
    data: {
      amount: PTS_FOR_EVENT_ATTENDANCE,
      Family: familyId,
      description: "Checked into event",
      metadata: {
        awardType: "jonze_attendance_marked",
        hookPayload: a
      }
    }
  })
  
  return newLedgerEntry
}


const metadataSchema = z.discriminatedUnion("awardType", [
  z.object({awardType: z.literal("jonze_attendance_marked"), hookPayload: jonzeAttendanceSchema})
])

const metadataJsonSchemaDef = (zodToJsonSchema(metadataSchema, "metadataSchema"))['definitions']!['metadataSchema']

export const LedgerEntries: CollectionConfig = {
	slug: 'ledger_entries',
	admin: {
		useAsTitle: 'description',
		description:
			'Ledger entries for the family system. Use this to award or deduct points from families.'
	},
	hooks: {
		afterChange: [
			async ({ req, doc }) => {
				const entry = doc as unknown as LedgerEntry;
				await recalculateScores(req.payload, [
					typeof entry.Family === 'number' ? entry.Family : entry.Family.id
				]);
			}
		],
		afterDelete: [
			async ({ req, doc }) => {
				const entry = doc as unknown as LedgerEntry;
				await recalculateScores(req.payload, [
					typeof entry.Family === 'number' ? entry.Family : entry.Family.id
				]);
			}
		]
	},
	labels: {
		singular: 'Ledger Entry',
		plural: 'Ledger Entries'
	},
	fields: [
		{
			name: 'amount',
			type: 'number',
			label: 'Amount',
			required: true
		},
		{
			name: 'description',
			type: 'text',
			label: 'Description',
			required: true
		},
		{
			name: 'member',
			type: 'relationship',
			label: 'Member',
			relationTo: 'members',
			hasMany: false,
			required: false
		},
		{
			name: 'Family',
			type: 'relationship',
			label: 'Family',
			relationTo: 'families',
			required: true,
			hasMany: false
		},
		{
			name: "metadata",
			type: 'json',
			jsonSchema: {
				uri: 'a://b/foo.json',
				fileMatch: ['a://b/foo.json'],
				schema: metadataJsonSchemaDef
			}
		}
	]
};
