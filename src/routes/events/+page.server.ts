import { CALENDAR_API_KEY, CALENDAR_ID } from '$env/static/private';
import type { PageLoad } from '../test/$types';
type Data = {
	start: string;
	end: string;
	title: string;
};

function isValidDate(val: any) {
	const d = new Date(val);
	return d instanceof Date && !isNaN(d.getTime());
}
export const load: PageLoad = async () => {
	const response = await fetch(
		`https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${CALENDAR_API_KEY}`
	);
	if (response.ok) {
		const result = await response.json();
		const data: Data = result.items
			.filter((val) => isValidDate(val.start.dateTime) && isValidDate(val.end.dateTime))
			.map((val) => {
				console.log(val);
				return {
					start: new Date(val.start.dateTime),
					end: new Date(val.end.dateTime),
					title: val.summary
				};
			});
		console.log(data);
		return {
			data
		};
	}
};
