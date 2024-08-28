import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ["class"],
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		'./node_modules/preline/dist/*.js'
	],
	safelist: ["dark"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		extend: {
			colors: {
				border: "hsl(var(--border) / <alpha-value>)",
				input: "hsl(var(--input) / <alpha-value>)",
				ring: "hsl(var(--ring) / <alpha-value>)",
				// background: "hsl(var(--background) / <alpha-value>)",
				// foreground: "hsl(var(--foreground) / <alpha-value>)",
				// primary: {
				// 	DEFAULT: "hsl(var(--primary) / <alpha-value>)",
				// 	foreground: "hsl(var(--primary-foreground) / <alpha-value>)"
				// },
				// secondary: {
				// 	DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
				// 	foreground: "hsl(var(--secondary-foreground) / <alpha-value>)"
				// },
				destructive: {
					DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
					foreground: "hsl(var(--destructive-foreground) / <alpha-value>)"
				},
				muted: {
					DEFAULT: "hsl(var(--muted) / <alpha-value>)",
					foreground: "hsl(var(--muted-foreground) / <alpha-value>)"
				},
				// accent: {
				// 	DEFAULT: "hsl(var(--accent) / <alpha-value>)",
				// 	foreground: "hsl(var(--accent-foreground) / <alpha-value>)"
				// },
				popover: {
					DEFAULT: "hsl(var(--popover) / <alpha-value>)",
					foreground: "hsl(var(--popover-foreground) / <alpha-value>)"
				},
				card: {
					DEFAULT: "hsl(var(--card) / <alpha-value>)",
					foreground: "hsl(var(--card-foreground) / <alpha-value>)"
				}
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)"
			},
			fontFamily: {
				sans: [...fontFamily.sans],
				epilogue: ['"Epilogue"', 'sans-serif']
			}
		}
	},
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#096888',

					secondary: '#46616a',

					accent: '#87b7f2',

					neutral: '#4B5563',

					'base-100': '#e4f3f9',

					info: '#97B1DD',

					success: '#24E08B',

					warning: '#F9D36C',

					error: '#EB5674'
				}
			}
		]
	},

	plugins: [require('flowbite/plugin'), require('daisyui'), require('preline/plugin')]
};

export default config;
