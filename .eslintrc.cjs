module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:astro/recommended',
		'plugin:jsx-a11y/recommended',
		'plugin:typescript-sort-keys/recommended',
	],
	overrides: [
		{
			extends: [
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
				'plugin:@typescript-eslint/strict',
			],
			files: ['*.astro'],
			parser: 'astro-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
				extraFileExtensions: ['.astro'],
			},
			rules: {
				'@typescript-eslint/consistent-type-definitions': 'off',
				'@typescript-eslint/no-empty-function': 'off',
				'@typescript-eslint/no-unsafe-assignment': 'off',
				'@typescript-eslint/no-unsafe-return': 'off',
				'deprecation/deprecation': 'off',
			},
		},
		{
			files: ['*.ts', '*.tsx'],
			extends: [
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
				'plugin:@typescript-eslint/strict',
			],
			rules: {
				'@typescript-eslint/consistent-type-definitions': 'off',
				'@typescript-eslint/prefer-nullish-coalescing': 'off',
				'@typescript-eslint/no-unsafe-return': 'off',
				'@typescript-eslint/no-floating-promises': 'off',
				'@typescript-eslint/no-unsafe-assignment': 'off',
				'@typescript-eslint/no-misused-promises': 'off',
			},
		},
		{
			files: ['*.json', '*.jsonc'],
			excludedFiles: ['package.json'],
			parser: 'jsonc-eslint-parser',
			rules: {
				'jsonc/sort-keys': 'error',
			},
			extends: ['plugin:jsonc/recommended-with-json'],
		},
		{
			extends: ['plugin:markdown/recommended'],
			files: ['**/*.md'],
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
		'jsx-a11y',
		'simple-import-sort',
		'typescript-sort-keys',
	],
	root: true,
	rules: {
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/padding-line-between-statements': 'off',
		'deprecation/deprecation': 'error',
		'jsx-a11y/no-autofocus': 'off',
		'no-empty-pattern': 'off',
		'padding-line-between-statements': 'off',
		'simple-import-sort/exports': 'error',
		'simple-import-sort/imports': 'error',
	},
};
