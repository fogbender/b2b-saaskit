module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:astro/recommended',
		'plugin:typescript-sort-keys/recommended',
	],
	overrides: [
		{
			files: ['*.astro'],
			parser: 'astro-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
				extraFileExtensions: ['.astro'],
			},
			rules: {
				'@typescript-eslint/no-unsafe-assignment': 'off',
				'deprecation/deprecation': 'off',
			},
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
		'simple-import-sort',
		'typescript-sort-keys',
	],
	root: true,
	rules: {
		'simple-import-sort/imports': 'error',
		'no-empty-pattern': 'off',
		'simple-import-sort/exports': 'error',
		'deprecation/deprecation': 'error',

		'@typescript-eslint/no-misused-promises': 'off',
		'@typescript-eslint/no-floating-promises': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
		'@typescript-eslint/await-thenable': 'off',
		'@typescript-eslint/restrict-template-expressions': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'typescript-sort-keys/interface': 'off',
		'no-empty-pattern': 'error',

		// Stylistic concerns that don't interfere with Prettier
		'padding-line-between-statements': 'off',
		'@typescript-eslint/padding-line-between-statements': 'off',
	},
};
