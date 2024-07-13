import type { CollectionConfig } from 'payload'

export const LedgerEntries: CollectionConfig = {
    slug: 'ledger_entries',
    admin: {
        useAsTitle: 'date',
    },
    fields: [
        {
            name: 'amount',
            type: 'number',
            label: 'Amount',
        },
        {
            name: 'description',
            type: 'text',
            label: 'Description',
        },
        {
            name: 'member',
            type: 'relationship',
            label: 'Member',
            relationTo: 'members',
        }
    ]
}