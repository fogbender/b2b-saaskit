import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import reactVite from '@vitejs/plugin-react';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	integrations: [react()],
	output: 'hybrid',
	adapter: vercel(),
	// eslint-disable-next-line no-undef
	site: process.env.SITE_URL,
	experimental: {
		hybridOutput: true,
	},
	vite: {
		optimizeDeps: {
			exclude: ['@resvg/resvg-js'],
		},
		plugins: [reactVite({ include: 'src/components/app/**/*.{js,jsx,ts,tsx}' })],
	},
});
