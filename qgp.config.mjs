// @ts-check
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
	plugins: [
		react(),
		checker({
			typescript: true,
			overlay: { initialIsOpen: false },
		}),
	],
	envPrefix: 'PUBLIC_',
	cacheDir: 'node_modules/.qgp_vite',
	build: { sourcemap: true },
	server: { port: 5173, proxy: { '/api': 'http://localhost:3000' } },
});
