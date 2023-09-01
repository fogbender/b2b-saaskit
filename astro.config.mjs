import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';

// https://astro.build/config
export default defineConfig({
	integrations: [
		solid({
			include: ['src/components/solid/**/*'],
		}),
		react(),
	],
	output: 'hybrid',
	adapter: vercel({
		functionPerRoute: false,
	}),
	// eslint-disable-next-line no-undef
	site: process.env.SITE_URL,
	vite: {
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
