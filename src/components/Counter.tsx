import { useRef } from 'react';

import { trpc, TRPCProvider } from './trpc';

export function Counter(props: React.ComponentProps<typeof CounterInteral>) {
	return (
		<TRPCProvider>
			<CounterInteral {...props} />
		</TRPCProvider>
	);
}

const CounterInteral = ({ counter }: { counter: number }) => {
	const incrementMutation = trpc.hello.increment.useMutation();
	const keepOld = useRef(counter);
	if (incrementMutation.data) {
		keepOld.current = incrementMutation.data;
	}

	return (
		<div>
			Count: {keepOld.current}
			<br />
			<button
				className="px-4 py-2 bg-blue-500 text-white rounded"
				onClick={() => {
					incrementMutation.mutate();
				}}
			>
				Increase count
			</button>
			<details>
				<summary>Reveal secret</summary>
				If you are a fan of Theo this would probably look crazy to you.
				<pre>
					{`
// import vercel from '@astrojs/vercel/serverless';

let i = 0;
export const helloRouter = createTRPCRouter({
	increment: publicProcedure.mutation(async () => {
		return ++i;
	}),
});`}
				</pre>
			</details>
		</div>
	);
};
