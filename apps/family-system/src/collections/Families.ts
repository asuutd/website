import type { CollectionConfig } from 'payload'

export const Families: CollectionConfig = {
  slug: 'families',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'family_name',
      type: 'text',
      label: 'Family Name',
    },
    {
      name: 'jonze_family_tag',
      type: 'text',
      label: 'Jonze Family Tag',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'score',
      type: 'number',
      label: 'Score',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'members',
      type: 'relationship',
      label: 'Members',
      relationTo: 'members',
      hasMany: true,
    }
  ]
}