import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/edge';

// https://astro.build/config
export default defineConfig({
	integrations: [react()],
	output: 'server',
	adapter: vercel(),
});
