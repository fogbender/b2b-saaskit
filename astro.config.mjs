import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import { unstable_vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'astro/config';
import checker from 'vite-plugin-checker';

const x = remix({});

x.forEach((y) => {
	console.log(y.name);
});

const remixVite = x.filter(
	(y) => !['remix-hmr-updates', 'remix-hmr-runtime', 'remix-react-refresh-babel'].includes(y.name)
);

// console.log(x);

// console.log(x[0].configureServer);
// const orig = x[0].configureServer;
// x[0].configureServer = (server) => {
// 	console.log('configureServer', server);
// 	// return orig(server);
// 	server.middlewares.use((req, res, next) => {
// 		console.log('middleware', req, res, next);
// 		next();
// 	});
// };

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
			remixVite,
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
