import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		vite: () => ({
			server: {
				fs: {
					allow: ['static']
				}
			},
			resolve: {
				dedupe: ['@fullcalendar/common']
			},
			optimizeDeps: {
				include: ['@fullcalendar/common']
			}
		})
		// hydrate the <div id="svelte"> element in src/app.html
	},

	preprocess: preprocess()
};

export default config;
