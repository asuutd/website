import type { CollectionConfig } from 'payload'

export const Members: CollectionConfig = {
    slug: 'members',
    admin: {
        useAsTitle: 'name',
    },
    access: {
        create: () => false,
        update: () => false,
        delete: () => false,
    },
    fields: [
        {
            name: 'jonze_member_id',
            type: 'text',
            label: 'Jonze Member ID',
            admin: {
                readOnly: true,
            },
        },
        {
            name: 'jonze_name',
            type: 'text',
            label: 'Jonze Name',
            admin: {
                readOnly: true,
            },
        },
        {
            name: 'jonze_tags',
            type: 'json',
            label: 'Jonze Tags',
            admin: {
                readOnly: true,
            },
        }
    ],
}