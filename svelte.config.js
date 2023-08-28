import adapter from '@chientrm/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			nodeCompat: true
		}),
		alias: {
			drizzle: './drizzle'
		}

		// hydrate the <div id="svelte"> element in src/app.html
	},

	preprocess: vitePreprocess()
};

export default config;
