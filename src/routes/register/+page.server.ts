import { z } from 'zod';
import type { Actions } from './$types';

const netIDRegex = /[a-zA-z]{3}[0-9]{6}/;
const phoneRegex = /[0-9]{3}-[0-9]{3}-[0-9]{4}/;

const zodSchema = z.object({
	first_name: z.string().min(1, 'Please enter first name'),
	last_name: z.string().min(1, 'Please enter last name'),
	email: z
		.string()
		.min(1, 'Please provide your email')
		.email("Email doesn't look right")
		.toLowerCase(),
	netID: z
		.string()
		.min(1, { message: 'netID is required' })
		.regex(netIDRegex, 'netID is not valid')
		.refine(
			(val) => {
				if (!val) return false;
				if (val.length !== 9) return false;
				if (!/[a-zA-Z]{3}/.test(val.slice(0, 3))) return false;
				if (!/[0-9]{6}/.test(val.slice(3))) return false;
				return true;
			},
			{ message: 'netIDs follow the format abc123456' }
		),
	phone: z
		.string()
		.min(1, 'Phone number is required')
		.regex(phoneRegex, 'phone number is not valid')
});

export const actions = {
	default: async ({ request }) => {
		// TODO log the user in
		console.log("HELLONIFO")
		const formData = Object.fromEntries(await request.formData());
		console.log(formData);
		const talentData = await zodSchema.safeParseAsync(formData);
		let errors: Record<string, string> = {}; 

		if (!talentData.success) {
			
			talentData.error.errors.forEach(error => {
				console.log(error.path[0], error.message)
				errors[`${error.path[0]}_error`] = error.message
			})
			console.log(errors)
			// Loop through the errors array and create a custom errors array
			return errors
		  }

		  return 
	}

	
} satisfies Actions;
