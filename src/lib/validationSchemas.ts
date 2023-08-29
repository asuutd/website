import { z } from 'zod';

const netIDRegex = /[a-zA-z]{3}[0-9]{6}/;
const phoneRegex = /[0-9]{3}-[0-9]{3}-[0-9]{4}/;

export const zodSchema = z.object({
	name: z.string().min(1, 'Please enter first name'),
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
		.regex(phoneRegex, 'phone number is not valid'),
	major: z.string(),
	minor: z.string().optional(),
	newsletters: z.boolean(),
	class: z.string().default('Freshman')
});
