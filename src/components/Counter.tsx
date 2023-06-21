import { trpc, TRPCProvider } from './trpc';

export function Counter() {
	return (
		<TRPCProvider>
			<CounterInternal />
		</TRPCProvider>
	);
}

const CounterInternal = () => {
	const counterQuery = trpc.counter.getCount.useQuery();
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
