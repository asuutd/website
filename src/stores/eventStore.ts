import { writable } from 'svelte/store';
import { supabase } from '../supabaseClient';

export const events = writable([]);

export const getData = async (num: number) => {
	const { data, error } = await supabase
		.from('events')
		.select()
		.order('date', { ascending: false })
		.limit(num);

	if (error) return console.error(error);
	console.log(data);
	events.set(data);
};
