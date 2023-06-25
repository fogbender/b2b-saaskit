/** @type {import('@typescript-eslint/experimental-utils').TSESLint.Linter.Config} */
module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:astro/recommended',
		'plugin:typescript-sort-keys/recommended',
	],
	overrides: [
		{
			extends: ['plugin:@typescript-eslint/recommended-requiring-type-checking'],
			files: ['*.astro'],
			parser: 'astro-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
				extraFileExtensions: ['.astro'],
			},
			rules: {
				'@typescript-eslint/no-unsafe-assignment': 'off',
				'@typescript-eslint/no-unsafe-return': 'off',
				'@typescript-eslint/no-unsafe-member-access': 'off',
				'@typescript-eslint/restrict-plus-operands': 'off',
				'deprecation/deprecation': 'off',
			},
		},
		{
			files: ['*.ts', '*.tsx'],
			extends: ['plugin:@typescript-eslint/recommended-requiring-type-checking'],
			rules: {
				'@typescript-eslint/no-unsafe-assignment': 'off',
				'@typescript-eslint/no-unsafe-member-access': 'off',
				'@typescript-eslint/no-floating-promises': 'off',
				'@typescript-eslint/no-misused-promises': 'off',
				'@typescript-eslint/no-unsafe-argument': 'off',
				'@typescript-eslint/no-unsafe-return': 'off',
				'@typescript-eslint/restrict-plus-operands': 'off',
				'@typescript-eslint/restrict-template-expressions': 'off',
			},
		},
		{
			files: ['*.json', '*.jsonc'],
			excludedFiles: ['package.json'],
			parser: 'jsonc-eslint-parser',
			extends: ['plugin:jsonc/recommended-with-json'],
		},
		{
			extends: ['plugin:markdown/recommended'],
			files: ['**/*.md', '**/*.md/*.{js,jsx,ts,tsx,astro}'],
			processor: 'markdown/markdown',
		},
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: true,
		tsconfigRootDir: __dirname,
	},
	plugins: [
		'@typescript-eslint',
		'astro',
		'deprecation',
		'simple-import-sort',
		'typescript-sort-keys',
		'react-refresh',
	],
	root: true,
	rules: {
		'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		'simple-import-sort/imports': 'error',
		'no-empty-pattern': 'off',
		'simple-import-sort/exports': 'error',
		'deprecation/deprecation': 'error',

		'@typescript-eslint/await-thenable': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'typescript-sort-keys/interface': 'off',
		'no-empty-pattern': 'error',

		// Stylistic concerns that don't interfere with Prettier
		'no-mixed-spaces-and-tabs': 'off',
		'jsx-a11y/no-autofocus': 'off',
		'jsx-a11y/click-events-have-key-events': 'off',
		'padding-line-between-statements': 'off',
		'@typescript-eslint/padding-line-between-statements': 'off',
	},
};
