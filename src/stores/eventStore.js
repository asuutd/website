import { writable } from 'svelte/store';
import { supabase } from '../supabaseClient';

export const events = writable([]);

export const getData = async () => {
	console.log('Hello');
	const { data, error } = await supabase.from('events').select();

	if (error) return console.error(error);
	console.log(data);
	events.set(data);
};
