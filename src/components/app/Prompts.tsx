import { DehydratedState, useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { env } from '../../config';
import { AuthProvider } from '../propelauth';
import { TRPCProvider, trpc } from '../trpc';
import { AuthSync } from '../AuthSync';
import { useReducer } from 'react';
import { AppNav } from './Nav';
import { Layout } from './Layout';

export function Prompts(props: { dehydratedState: DehydratedState }) {
	return (
		<TRPCProvider dehydratedState={props.dehydratedState}>
			<AuthProvider authUrl={env.PUBLIC_AUTH_URL}>
				<AuthSync />
				<AppNav />
				<Interal />
			</AuthProvider>
		</TRPCProvider>
	);
}

function Interal() {
	const promptsQuery = trpc.prompts.getPrompts.useQuery(undefined, { staleTime: 1000 });
	const queryClient = useQueryClient();
	const addPromptMutation = trpc.prompts.createPrompt.useMutation({
		onSettled: () => {
			queryClient.invalidateQueries(getQueryKey(trpc.prompts.getPrompts));
		},
	});
	const deletePromptMutation = trpc.prompts.deletePrompt.useMutation({
		onSuccess: (data) => {
			queryClient.setQueryData(
				getQueryKey(trpc.prompts.getPrompts, undefined, 'query'),
				(oldData: typeof promptsQuery.data) =>
					oldData?.filter((prompt) => prompt.promptId !== data.promptId)
			);
		},
		onSettled: () => {
			queryClient.invalidateQueries(getQueryKey(trpc.prompts.getPrompts));
		},
	});
	const [showAddPrompt, toggleShowAddPrompt] = useReducer((state) => !state, false);
	return (
		<Layout title="Prompts with Friends / List">
			<div className="mt-4 px-4 sm:px-6 lg:px-8 border border-gray-300 rounded-md py-8">
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-base font-semibold leading-6 text-gray-900">
							List of all public prompts
						</h1>
						<p className="mt-2 text-sm text-gray-700">
							List of all public prompts that are available to all users.
						</p>
					</div>
					<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
						<button
							type="button"
							className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							onClick={toggleShowAddPrompt}
						>
							{showAddPrompt ? 'Cancel' : 'Add Prompt'}
						</button>
					</div>
				</div>
				{showAddPrompt && (
					<>
						<form
							className="flex flex-col gap-2 border border-gray-300 rounded-md p-2 mt-4"
							onSubmit={(e) => {
								e.preventDefault();
								const form = e.currentTarget;
								const formData = new FormData(form);
								const prompt = formData.get('prompt') as string;
								addPromptMutation.mutate(
									{ prompt },
									{
										onSuccess: () => {
											form.reset();
										},
									}
								);
							}}
						>
							<label className="text-gray-800" htmlFor="prompt">
								Prompt
							</label>
							<input
								className="border border-gray-300 rounded-md p-2"
								type="text"
								name="prompt"
								autoFocus
							/>
							<button className="bg-blue-500 text-white py-2 px-4 rounded-md" type="submit">
								Create
							</button>
						</form>
					</>
				)}
				{promptsQuery.data?.length === 0 ? (
					<div className="-mx-4 mt-8 px-4 py-3 text-sm text-gray-700 border border-gray-300 rounded-md">
						No prompts, be first to create one.
					</div>
				) : (
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
									{prompt.content}
								</td>
								<td className="px-3 py-4 text-sm text-gray-500">{prompt.userId}</td>
								<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
									<button
										className="text-indigo-600 hover:text-indigo-900"
										onClick={() => {
											deletePromptMutation.mutate({ promptId: prompt.promptId });
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
		<div className="mt-8 flow-root">
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
									User
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
