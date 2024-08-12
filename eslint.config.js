import eslint from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import markdown from 'eslint-plugin-markdown';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: [
			//
			'.astro',
			'src/.astro',
			'dist',
			'.vscode',
			'.vercel',
			'src/db/migrations',
			'src/env.d.ts',
		],
	},

	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...eslintPluginAstro.configs['all'],
	{
		files: ['src/pages/demo/htmx/*.astro', 'src/components/landing/B2B.astro'],
		rules: {
			'astro/no-unused-css-selector': 'off',
		},
	},
	{
		files: ['**/*.md', '**/*.md/*.{js,jsx,ts,tsx,astro}'],
		plugins: {
			markdown,
		},
		processor: 'markdown/markdown',
	},
	{
		plugins: {
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
		},
	},
	{
		plugins: {
			'react-refresh': reactRefresh,
		},
		rules: {
			'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		},
	},
	// TODO: typescript-sort-keys with 'typescript-sort-keys/interface': 'off'
	// TODO: deprecation with 'deprecation/deprecation': 'error'
	{
		rules: {
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
			'no-empty-pattern': 'error',

			// Stylistic concerns that don't interfere with Prettier
			'no-mixed-spaces-and-tabs': 'off',
			'padding-line-between-statements': 'off',
			'@typescript-eslint/padding-line-between-statements': 'off',
		},
	},
	{
		files: ['**/*.cjs'],
		rules: {
			'no-undef': 'off',
			'@typescript-eslint/no-require-imports': 'off',
		},
	}
);
