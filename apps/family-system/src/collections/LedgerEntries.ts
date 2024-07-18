import type { CollectionConfig } from 'payload'
import { recalculateScores } from '@/utils/scores'
import { LedgerEntry } from '@/payload-types'

export const LedgerEntries: CollectionConfig = {
    slug: 'ledger_entries',
    admin: {
        useAsTitle: 'description',
        description: 'Ledger entries for the family system. Use this to award or deduct points from families.'
    },
    hooks: {
        afterChange: [
            async ({req, doc}) => {
                const entry = (doc as unknown as LedgerEntry)
                await recalculateScores(req.payload, [typeof entry.Family === 'number' ? (entry.Family) : entry.Family.id])
            }
        ],
        afterDelete: [
            async ({req, doc}) => {
                const entry = (doc as unknown as LedgerEntry)
                await recalculateScores(req.payload, [typeof entry.Family === 'number' ? (entry.Family) : entry.Family.id])
            }
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
            hasMany: false,
            required: false,
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