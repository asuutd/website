import { writable } from 'svelte/store';
import { supabase } from '$lib/supabaseClient';

export const personId = writable([]);

export const getPerson = async (firstName, lastName) => {
	const { data, error } = await supabase
		.from('people')
		.select('id')
		.eq('first_name', firstName)
		.eq('last_name', lastName);
	console.log('I got here');
	if (data.length === 0) {
		console.log('Error here');
		throw new Error('Invalid First or Last Name');
	}
	console.log(data);
	personId.set(data);
	console.log(personId);
};

export const getPersonByNetId = async (netID) => {
	const { data, error } = await supabase.from('user').select('id').eq('netID', netID);
	if (data.length === 0) {
		console.log('Error here');
		throw new Error('You are not registered');
	}
	personId.set(data);
};

export const getPeople = async () => {
	const { data, error } = await supabase.from('people').select('*');
	if (data && data.length === 0) {
		console.log('Error here');
		throw new Error('Invalid First or Last Name');
	}
	console.log(data);
	data && personId.set(data);
	console.log(personId);
};

export const createPerson = async (firstName, lastName, isMember) => {
	const { data, error } = await supabase
		.from('people')
		.insert({ first_name: firstName, last_name: lastName, is_member: isMember });
	if (error) return console.error(error);

	return data;
};
