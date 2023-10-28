module.exports = {
	root: true,
	extends: ["plugin:svelte/recommended", "plugin:svelte/prettier", "../../.eslintrc.cjs"],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		project: './tsconfig.json',
    	extraFileExtensions: ['.svelte']
	},
    rules: {
      '@typescript-eslint/naming-convention': 'off',
    },
	settings: {
		"import/resolver": {
		  "typescript": {
			"project": [
			  "apps/website/tsconfig.json",
			],
		  }
		}
	  },
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
		  files: ['*.svelte'],
		  parser: 'svelte-eslint-parser',
		  parserOptions: {
			  parser: {
				js: 'espree',
				ts: '@typescript-eslint/parser',
				typescript: '@typescript-eslint/parser'
			}
		  }
		}
	  ]
};
