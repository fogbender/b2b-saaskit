import { Link } from 'react-router-dom';

import { useRequireActiveOrg } from '../propelauth';
import { trpc } from '../trpc';
import { Layout } from './Layout';

export function Prompts() {
	const trpcUtils = trpc.useContext();

	const { activeOrg } = useRequireActiveOrg();
	const orgId = activeOrg?.orgId || '';
	const promptsQuery = trpc.prompts.getPrompts.useQuery(
		{},
		{
			enabled: !!orgId,
			staleTime: 1000,
		}
	);
	const deletePromptMutation = trpc.prompts.deletePrompt.useMutation({
		onMutate: async ({ promptId }) => {
			// cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await trpcUtils.prompts.getPrompts.cancel({});
			// snapshot the previous value
			const previousPrompts = trpcUtils.prompts.getPrompts.getData({});
			// optimistically update to the new value
			trpcUtils.prompts.getPrompts.setData({}, (oldData) =>
				oldData?.filter((prompt) => prompt.promptId !== promptId)
			);
			// return a context object with the snapshotted value
			return { previousPrompts };
		},
		// if the mutation fails, use the context returned from onMutate to roll back
		onError: (_err, _variables, context) => {
			if (context?.previousPrompts) {
				trpcUtils.prompts.getPrompts.setData({}, context.previousPrompts);
			}
		},
		// always refetch after error or success:
		onSettled: () => {
			trpcUtils.prompts.getPrompts.invalidate({});
		},
	});

	return (
		<Layout title="Prompts with Friends / Prompts">
			<div className="mt-4 flex flex-col gap-10 rounded-md border border-gray-300 px-4 py-8 sm:px-6 lg:px-8">
				<div className="">
					<Link
						to="/app/prompts/create"
						type="button"
						className="rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Add Prompt
					</Link>
				</div>

				{promptsQuery.data?.length === 0 && (
					<div className="flex flex-col gap-3 text-sm text-gray-700">
						<div>No prompts yet!</div>
						<div>Press ☝️ button to create one</div>
					</div>
				)}

				{(promptsQuery.data?.length || 0) > 0 && (
					<div className="sm:flex sm:items-center">
						<div className="flex flex-col gap-2">
							<h1 className="text-base font-semibold leading-6 text-gray-900">
								Prompts created by your organization
							</h1>
							<p className="text-sm text-gray-700">
								List of all the prompts created by you and your friends
							</p>
						</div>
					</div>
				)}

				{(promptsQuery.data?.length || 0) > 0 && (
					<Table>
						{promptsQuery.data?.map((prompt, index) => (
							<tr
								key={prompt.promptId}
								className={`${index % 2 === 0 ? undefined : 'bg-gray-50'} ${
									deletePromptMutation.isLoading &&
									deletePromptMutation.variables?.promptId === prompt.promptId
										? 'opacity-50'
										: ''
								}`}
							>
								<td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
									<Link
										to={`/app/prompts/${prompt.promptId}`}
										className="text-indigo-600 underline hover:text-indigo-900"
									>
										{prompt.title}
									</Link>
								</td>
								<td className="px-3 py-4 text-sm text-gray-500">
									{prompt._meta.user?.name || prompt._meta.user?.email || prompt.userId}
								</td>
								<td className="relative flex gap-2 whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
									<Link
										to={`/app/prompts/${prompt.promptId}/edit`}
										className="text-indigo-600 hover:text-indigo-900"
									>
										Edit<span className="sr-only">, prompt</span>
									</Link>
									<button
										className="text-indigo-600 hover:text-indigo-900"
										onClick={() => {
											const confirm = window.confirm(
												'Are you sure you want to delete this prompt?'
											);
											if (confirm) {
												deletePromptMutation.mutate({ promptId: prompt.promptId });
											}
										}}
									>
										Delete<span className="sr-only">, prompt</span>
									</button>
								</td>
							</tr>
						))}
					</Table>
				)}
			</div>
		</Layout>
	);
}

const Table = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flow-root">
			<div className="">
				<div className="inline-block min-w-full py-2 align-middle">
					<table className="min-w-full divide-y divide-gray-300">
						<thead>
							<tr>
								<th
									scope="col"
									className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
								>
									Prompt
								</th>
								<th
									scope="col"
									className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
								>
									Creator
								</th>
								<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
									<span className="sr-only">Delete</span>
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
