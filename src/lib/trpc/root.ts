import type { AstroGlobal } from 'astro';
import { createTRPCServerSideHelpers, createTRPCRouter } from './trpc';
import { helloRouter } from './routers/hello';
import { authRouter } from './routers/auth';
import { promptsRouter } from './routers/prompts';
import { settingsRouter } from './routers/settings';
import { surveysRouter } from './routers/surveys';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	hello: helloRouter,
	auth: authRouter,
	prompts: promptsRouter,
	settings: settingsRouter,
	surveys: surveysRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const createCaller = appRouter.createCaller;
export const createServerSideHelpers = createTRPCServerSideHelpers(appRouter);
// short form for cases when you call it from .astro file
export const createHelpers = (Astro: AstroGlobal) =>
	createServerSideHelpers({
		req: Astro.request,
		resHeaders: Astro.response.headers,
	});
