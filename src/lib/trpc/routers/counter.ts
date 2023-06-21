import { createTRPCRouter, publicProcedure } from '../trpc';

let i = 0;
export const counterRouter = createTRPCRouter({
	getCount: publicProcedure.query(async () => {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return i;
	}),
	increment: publicProcedure.mutation(() => {
		return ++i;
	}),
});
