import { createTRPCRouter, publicProcedure } from '../trpc';

let i = 0;
export const helloRouter = createTRPCRouter({
	getCount: publicProcedure.query(async () => {
		return i;
	}),
	increment: publicProcedure.mutation(async () => {
		return ++i;
	}),
});
