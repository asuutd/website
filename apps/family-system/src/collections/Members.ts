import type { CollectionConfig } from 'payload'

export const Members: CollectionConfig = {
    slug: 'members',
    admin: {
        useAsTitle: 'jonze_name',
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
            required: true,
            unique: true,
            admin: {
                readOnly: true,
            },
        },
        {
            name: 'jonze_name',
            type: 'text',
            label: 'Jonze Name',
            required: true,
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
            jsonSchema: {
                uri: '',
                fileMatch: [],
                schema: {
                    type: 'array',
                    items: {
                        type: 'string',
                    }
                },
            }
        }
    ],
}