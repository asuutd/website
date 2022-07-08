module.exports = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			fontFamily: {
				epilogue: ['"Epilogue"', 'sans-serif']
			}
		}
	},
	plugins: [require('flowbite/plugin'), require('daisyui')]
};
