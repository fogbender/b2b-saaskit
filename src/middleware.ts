import { TRPCError } from '@trpc/server';
import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler<{}> = async (_, resolve) => {
	try {
		return await resolve();
	} catch (error) {
		if (error instanceof TRPCError && error.cause && error.cause instanceof Response) {
			return error.cause;
		}
		return undefined as any as Response;
	}
};
