import type { CollectionConfig } from 'payload';
import { defaultFamily } from '@/utils/scores';

export const Members: CollectionConfig = {
	slug: 'members',
	admin: {
		useAsTitle: 'jonze_name',
		description:
			"Member data is automatically synced from Jonze and can't be updated here. If you need to manually sync, click the button below.",
		components: {
			beforeListTable: [
				{
					path: '@/components/SyncJonzeMembers',
					exportName: 'SyncJonzeMembers'
				}
			]
		}
	},
	access: {
		create: () => false,
		update: () => false,
		delete: () => false
	},
	fields: [
		{
			name: 'jonze_member_id',
			type: 'text',
			label: 'Jonze Member ID',
			required: true,
			unique: true,
			admin: {
				readOnly: true
			}
		},
		{
			name: 'jonze_name',
			type: 'text',
			label: 'Jonze Name',
			required: true,
			admin: {
				readOnly: true
			}
		},
		{
			name: 'jonze_tags',
			type: 'json',
			label: 'Jonze Tags',
			admin: {
				readOnly: true
			},
			defaultValue: [defaultFamily.jonze_family_tag],
			jsonSchema: {
				uri: 'a://b/foo.json', // required
				fileMatch: ['a://b/foo.json'], // required
				schema: {
					type: 'array',
					items: {
						type: 'string'
					}
				}
			}
		}
	]
};
