import { createTRPCRouter, authProcedure, publicProcedure } from '../trpc';

let i = 0;
export const helloRouter = createTRPCRouter({
	hello: authProcedure.query(async ({ ctx }) => {
		const res = await ctx.userPromise;
		if (res.kind === 'ok') {
			return `Oh, so cool, you are already signed in! ${res.user.userId}`;
		}
		return 'Something from the server';
	}),
	getCount: publicProcedure.query(async () => {
		return i;
	}),
	increment: publicProcedure.mutation(async () => {
		return ++i;
	}),
});
