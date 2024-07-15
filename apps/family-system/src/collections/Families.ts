import { Family } from '@/payload-types'
import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { RefreshFamilyScores } from '@/components/RefreshFamilyScores'

const generateTagFromFamilyName: CollectionBeforeChangeHook<Family> = async ({ data, originalDoc }) => {
  // This hook generates tags for new families based on the family name.
  
  if (originalDoc) {
    // originalDoc is null for new documents. We only want to run this hook on new documents.
    return data
  }

  if (!data.family_name) {
    // If the family name is not set, we don't want to run this hook. This shouldn't happen since this hook runs after validation, but it doesn't hurt to be defensive.
    throw new Error('Family name is required')
  }

  return {
    ...data,
    jonze_family_tag: '#fam-'+ data.family_name.replaceAll(' ', '-').toLowerCase()
  }
}

export const Families: CollectionConfig = {
  slug: 'families',
  admin: {
    useAsTitle: 'family_name',
    description: 'Use this collection to create new families, update family names, and update the people included within a family.',
    components: {
      beforeListTable: [
        RefreshFamilyScores
      ]
    }
  },
  hooks: {
    beforeChange: [
      generateTagFromFamilyName
    ],
    afterChange: [
      // TODO: sync tags back to users, sync member data from jonze
    ]
  },
  fields: [
    {
      name: 'family_name',
      type: 'text',
      label: 'Family Name',
      required: true,
    },
    {
      name: 'jonze_family_tag',
      type: 'text',
      label: 'Jonze Family Tag',
      admin: {
        readOnly: true,
      },
      required: true,
      unique: true,
    },
    {
      name: 'score',
      type: 'number',
      label: 'Score',
      required: true,
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    }
  ]
}