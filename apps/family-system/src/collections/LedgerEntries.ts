import type { CollectionConfig } from 'payload'

export const LedgerEntries: CollectionConfig = {
    slug: 'ledger_entries',
    admin: {
        useAsTitle: 'description',
        description: 'Ledger entries for the family system. Use this to award or deduct points from families.'
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