import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { serialize, parse } from 'cookie';
import jwt from 'jsonwebtoken';

import { createTRPCRouter, apiProcedure } from '../trpc';
import { propelauth } from '../../propelauth';
import { AUTH_COOKIE_NAME, HTTP_ONLY_AUTH_COOKIE_NAME } from '../../../constants';

export const authRouter = createTRPCRouter({
	authSync: apiProcedure
		.input(
			z.object({
				isLoggedIn: z.boolean(),
				accessToken: z.string().optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const currentCookies = parse(ctx.req.headers.get('cookie') || '');
			const set = (key: string, value: string) => {
				ctx.resHeaders.append(
					'set-cookie',
					serialize(key, value, {
						path: '/',
						httpOnly: !key.startsWith('js_'),
						secure: true,
						sameSite: 'strict',
						maxAge: 365 * 24 * 3600,
					})
				);
			};
			const reset = () => {
				if (currentCookies[AUTH_COOKIE_NAME] || currentCookies[HTTP_ONLY_AUTH_COOKIE_NAME]) {
					set(AUTH_COOKIE_NAME, '');
					set(HTTP_ONLY_AUTH_COOKIE_NAME, '');
				}
			};
			if (!input.isLoggedIn || !input.accessToken) {
				reset();
				return 'session cleared';
			}
			const decodedJwt = jwt.decode(input.accessToken);
			// console.log(decodedJwt);
			if (!decodedJwt || typeof decodedJwt === 'string') {
				reset();
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Could not decode access token.',
				});
			}
			const res = await propelauth
				.validateAccessTokenAndGetUser('Bearer ' + input.accessToken)
				.then((user) => ({ kind: 'ok' as const, user }))
				.catch((e) => ({ kind: 'error' as const, error: e.message }));
			if (res.kind === 'error') {
				reset();
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'Could not validate access token.',
					// optional: pass the original error to retain stack trace
					cause: res.error,
				});
			}
			const publicCookie = {
				userId: res.user.userId,
				exp: String(decodedJwt.exp),
			};
			const httpOnlyCookie = {
				accessToken: input.accessToken!,
			};
			set(AUTH_COOKIE_NAME, '' + new URLSearchParams(publicCookie));
			set(HTTP_ONLY_AUTH_COOKIE_NAME, '' + new URLSearchParams(httpOnlyCookie));
			return 'everything went well';
		}),
});
