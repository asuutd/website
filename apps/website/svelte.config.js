import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			drizzle: './drizzle'
		},
		env: {
			dir: '../..'
		}

		// hydrate the <div id="svelte"> element in src/app.html
	},

	preprocess: vitePreprocess()
};

export default config;
