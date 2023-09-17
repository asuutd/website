import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';

export const events = writable([]);

export const getData = async (num: number, columns: string) => {
	const { data, error } =
		columns === 'all'
			? await supabase.from('events').select().limit(num).order('importance', { ascending: true })
			: await supabase
					.from('events')
					.select(columns)
					.limit(num)
					.order('importance', { ascending: true });

	if (error) return console.error(error);
	console.log(data);
	events.set(data);
};
