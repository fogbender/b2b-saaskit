// MIT License
// Copyright (c) 2022 Shoubhit Dash
// https://github.com/t3-oss/create-t3-app/blob/next/LICENSE

/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */
type CreateAstroContextOptions = Partial<{
	/** The incoming request. */
	req: Request;
	/** The outgoing headers. */
	resHeaders: Headers;
}>;

/** Replace this with an object if you want to pass things to `createContextInner`. */
type CreateContextOptions = {
	userId?: string;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
const createInnerTRPCContext = (opts: CreateContextOptions) => {
	return opts;
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 * @see https://trpc.io/docs/server/context#inner-and-outer-context
 */
export const createTRPCContext = (opts: CreateAstroContextOptions) => {
	const contextInner = createInnerTRPCContext({});
	return {
		...contextInner,
		...opts,
	};
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
import { createServerSideHelpers } from '@trpc/react-query/server';
import { AnyRouter, initTRPC, TRPCError } from '@trpc/server';
import { parse } from 'cookie';
import superjson from 'superjson';
import { unthunk } from 'unthunk';
import { z } from 'zod';
import { ZodError } from 'zod';

import { AUTH_COOKIE_NAME, HTTP_ONLY_AUTH_COOKIE_NAME } from '../../constants';
import { propelauth } from '../propelauth';

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		};
	},
});

/**
 * 2.5 ssr helper
 */
export const createTRPCServerSideHelpers =
	<T extends AnyRouter>(router: T) =>
	(ctx: ReturnType<typeof createTRPCContext>) =>
		createServerSideHelpers<T>({
			router,
			ctx,
			transformer: superjson,
		});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/**
 * Procedure that requires request and response headers
 *
 * This will make sure that you can only call this procedure if you are handing API request and you
 * will send the response back to the client.
 */
export const apiProcedure = publicProcedure.use(async ({ ctx, next }) => {
	if (!ctx.req || !ctx.resHeaders) {
		throw new Error('You are missing `req` or `resHeaders` in your call.');
	}

	const req = ctx.req;
	const newCtx = unthunk({
		req,
		resHeaders: ctx.resHeaders,
		parsedCookies: () => parse(req.headers.get('cookie') || ''),
		accessToken: () => {
			const { parsedCookies } = newCtx;
			if (parsedCookies[AUTH_COOKIE_NAME] && parsedCookies[HTTP_ONLY_AUTH_COOKIE_NAME]) {
				const httpOnlyCookie = new URLSearchParams(parsedCookies[HTTP_ONLY_AUTH_COOKIE_NAME]);
				return httpOnlyCookie.get('accessToken') || undefined;
			}

			return;
		},
		userOrgId: () => {
			const { parsedCookies } = newCtx;
			if (newCtx.accessToken) {
				const publicCookie = new URLSearchParams(parsedCookies[AUTH_COOKIE_NAME]);
				return publicCookie.get('orgId') || undefined;
			}

			return;
		},
		userPromise: async () => {
			return await propelauth
				.validateAccessTokenAndGetUser('Bearer ' + newCtx.accessToken)
				.then((user) => ({ kind: 'ok' as const, user }))
				.catch((error) => ({ kind: 'error' as const, error }));
		},
	});
	// context is merged, not replaced
	return next({
		ctx: newCtx,
	});
});

export const authProcedure = apiProcedure.use(async ({ ctx, next }) => {
	const user = await ctx.userPromise;
	if (user.kind === 'error') {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'Could not validate access token.',
			// optional: pass the original error to retain stack trace
			cause: user.error,
		});
	}

	// context is merged, not replaced
	return next({
		ctx: { user: user.user },
	});
});

export const orgProcedure = authProcedure
	.use(async ({ ctx, rawInput, next }) => {
		const { orgId: inputOrgId } = z.object({ orgId: z.string().optional() }).parse(rawInput);
		const requiredOrgId = inputOrgId || ctx.userOrgId;
		if (requiredOrgId) {
			for (const orgId in ctx.user.orgIdToOrgMemberInfo) {
				const orgMemberInfo = ctx.user.orgIdToOrgMemberInfo[orgId];
				if (orgMemberInfo?.orgId === requiredOrgId) {
					return next({
						ctx: { requiredOrgId },
					});
				}
			}
		}

		throw new TRPCError({
			code: 'FORBIDDEN',
			message: `This route requires user access to the organization ${requiredOrgId}.`,
		});
	})
	.input(z.object({ orgId: z.string().optional() }));
