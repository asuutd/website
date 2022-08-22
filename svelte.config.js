import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()

		// hydrate the <div id="svelte"> element in src/app.html
	},

	preprocess: preprocess()
};

export default config;
