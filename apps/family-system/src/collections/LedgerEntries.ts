import { LedgerEntry } from '@/payload-types'
import type { CollectionConfig, CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { sql, eq } from 'drizzle-orm'

const IncrementFamilyScoreOnEntryChange: CollectionAfterChangeHook<LedgerEntry> = async ({doc, req, previousDoc}) => {
    const familyId = typeof doc.Family === 'number' ? doc.Family : doc.Family.id
    const table = req.payload.db.tables.families

    const score = !previousDoc ? sql`${table.score} + ${doc.amount}` : sql`${table.score} + ${doc.amount} - ${previousDoc.amount}`

    await req.payload.db.drizzle.update(table).set({
            score,
    // @ts-ignore
    }).where(eq(table.id, familyId))

}

const DecrementFamilyScoreOnEntryDeletion: CollectionAfterDeleteHook<LedgerEntry> = async ({doc, req}) => {
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
            IncrementFamilyScoreOnEntryChange,
        ],
        afterDelete: [
            DecrementFamilyScoreOnEntryDeletion
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