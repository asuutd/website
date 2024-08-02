import { GlobalConfig } from 'payload'

export const BoxAccessToken: GlobalConfig = {
  slug: 'box_access_token',
  admin: {
    hidden: false
  },
  access: {
    read: () => false,
    update: () => false
  },
  fields: [
    {
      type: 'json',
      name: 'access_token',
      required: true,
      defaultValue: null,
      validate: () => true,
      jsonSchema: {
				uri: '',
				fileMatch: [],
				schema: {
				  anyOf: [
						  {	type: 'object' },
							{ type: 'null' }
						]
				}
			}
      
    }
  ]
}