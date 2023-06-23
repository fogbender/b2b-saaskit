import type { DehydratedState } from '@tanstack/react-query';

import { trpc, TRPCProvider } from './trpc';

export function Counter({ dehydratedState }: { dehydratedState?: DehydratedState }) {
	return (
		<TRPCProvider dehydratedState={dehydratedState}>
			<CounterInternal />
		</TRPCProvider>
	);
}

const CounterInternal = () => {
	const counterQuery = trpc.counter.getCount.useQuery(undefined, {
		staleTime: 1000,
	});
	const trpcUtils = trpc.useContext();
	const incrementMutation = trpc.counter.increment.useMutation({
		async onSettled() {
			await trpcUtils.counter.getCount.invalidate();
		},
	});

	return (
		<div className="container mx-auto mt-8">
			Count: {counterQuery.data ?? 'loading...'}
			<br />
			<button
				disabled={incrementMutation.isLoading}
				className="rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-400"
				onClick={() => {
					incrementMutation.mutate();
				}}
			>
				Increase count
			</button>
		</div>
	);
};
