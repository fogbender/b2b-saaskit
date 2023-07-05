import react from '@astrojs/react';
import { defineConfig } from 'astro/config';
import deno from 'npm:@astrojs/deno';

import {} from 'superjson';
import {} from 'zod';

// https://astro.build/config
export default defineConfig({
	integrations: [react()],
	output: 'hybrid',
	adapter: deno(),
	// eslint-disable-next-line no-undef
	site: Deno.env.get('SITE_URL'),
	experimental: {
		assets: true,
	},
	vite: {
		optimizeDeps: {
			exclude: ['@resvg/resvg-js'],
		},
		build: {
			sourcemap: true /* B2B:CONFIG consider disabling sourcemaps for production */,
		},
	},
});
