import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	fetch: fetch.bind(globalThis) // Tell Supabase Client to use Cloudflare Workers' global `fetch` API to make requests
});
console.log(supabase);
