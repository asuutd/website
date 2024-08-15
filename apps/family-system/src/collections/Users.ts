import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
	slug: 'users',
	admin: {
		useAsTitle: 'email',
		description: 'Users that can manage the family system.'
	},
	auth: true,
	fields: [
		// Email added by default
		// Add more fields as needed
	]
};
