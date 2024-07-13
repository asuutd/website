import { LedgerEntry } from '@/payload-types'
import type { CollectionConfig, CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { sql, eq } from 'drizzle-orm'

const UpdateFamilyScore: CollectionAfterChangeHook<LedgerEntry> = async ({doc, req, previousDoc}) => {
    if (previousDoc) {
        // previousDoc is null for new documents. We only want to run this hook on new documents.
        // TODO: handle fully recalculating the family score when updating a ledger entry
        return
    }
    const familyId = typeof doc.Family === 'number' ? doc.Family : doc.Family.id

    const table = req.payload.db.tables.families
    await req.payload.db.drizzle.update(table).set({
            score: sql`${table.score} + ${doc.amount}`,
    // @ts-ignore
    }).where(eq(table.id, familyId))

}

const UpdateFamilyScoreOnDelete: CollectionAfterDeleteHook<LedgerEntry> = async ({doc, req}) => {
    const familyId = typeof doc.Family === 'number' ? doc.Family : doc.Family.id

    const table = req.payload.db.tables.families
    await req.payload.db.drizzle.update(table).set({
            score: sql`${table.score} - ${doc.amount}`,
    // @ts-ignore
    }).where(eq(table.id, familyId))
}

export const LedgerEntries: CollectionConfig = {
    slug: 'ledger_entries',
    admin: {
        useAsTitle: 'description',
        description: 'Ledger entries for the family system. Use this to award or deduct points from families.'
    },
    hooks: {
        afterChange: [
            UpdateFamilyScore,
        ],
        afterDelete: [
            UpdateFamilyScoreOnDelete
        ],
    },
    labels: {
        singular: 'Ledger Entry',
        plural: 'Ledger Entries',
    },
    fields: [
        {
            name: 'amount',
            type: 'number',
            label: 'Amount',
            required: true,
        },
        {
            name: 'description',
            type: 'text',
            label: 'Description',
            required: true,
        },
        {
            name: 'member',
            type: 'relationship',
            label: 'Member',
            relationTo: 'members',
        },
        {
            name: 'Family',
            type: 'relationship',
            label: 'Family',
            relationTo: 'families',
            required: true,
            hasMany: false,
        },
    ]
}