import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import { defineConfig } from 'astro/config';
import checker from 'vite-plugin-checker';

// https://astro.build/config
export default defineConfig({
	integrations: [react()],
	output: 'hybrid',
	adapter: vercel({
		functionPerRoute: false,
	}),
	// eslint-disable-next-line no-undef
	site: process.env.SITE_URL,
	vite: {
		plugins: [
			checker({
				typescript: true,
				overlay: { initialIsOpen: false, badgeStyle: 'left: 55px; bottom: 8px;' },
				enableBuild: false, // we already check that in `yarn ci:check`
			}),
		],
		optimizeDeps: {
			exclude: ['@resvg/resvg-js'],
		},
		build: {
			sourcemap: true /* B2B:CONFIG consider disabling sourcemaps for production */,
		},
	},
	server: {
		port: 3000,
	},
});
