import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';

export const events = writable([]);

export const getData = async (num: number, columns: string) => {
	const { data, error } =
		columns === 'all'
			? await supabase.from('events').select().order('date', { ascending: false }).limit(num)
			: await supabase
					.from('events')
					.select(columns)
					.order('date', { ascending: false })
					.limit(num);

	if (error) return console.error(error);
	console.log(data);
	events.set(data);
};
