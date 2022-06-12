import adapter from '@sveltejs/adapter-auto';
import sveltePreprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		vite: () => ({
			server: {
				fs: {
					allow: ['static']
				}
			}
		})
		// hydrate the <div id="svelte"> element in src/app.html
	},
	preprocess: sveltePreprocess()
};

export default config;
