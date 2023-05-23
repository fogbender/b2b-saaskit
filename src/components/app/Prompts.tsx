import { DehydratedState, useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { useReducer, useRef, useState } from 'react';

import { env } from '../../config';
import { AuthSync } from '../AuthSync';
import { AuthProvider, useRequireActiveOrg } from '../propelauth';
import { trpc, TRPCProvider } from '../trpc';
import { Layout } from './Layout';
import { AppNav } from './Nav';

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
	const runPromptMutation = trpc.prompts.runPrompt.useMutation({
		onSettled: () => {
			queryClient.invalidateQueries(getQueryKey(trpc.prompts.getDefaultKey));
		},
	});
	const [showAddPrompt, toggleShowAddPrompt] = useReducer((state) => !state, false);
	const { activeOrg } = useRequireActiveOrg();
	const orgId = activeOrg?.orgId || '';
	const promptsQuery = trpc.prompts.getPrompts.useQuery(
		{},
		{
			enabled: !!orgId,
			staleTime: 1000,
		}
	);
	const keysQuery = trpc.settings.getKeys.useQuery(
		{ orgId },
		{
			enabled: !!orgId,
		}
	);
	const hasKey = (keysQuery.data?.length || 0) !== 0;
	const runButtonRef = useRef<HTMLButtonElement>(null);
	const storeButtonRef = useRef<HTMLButtonElement>(null);

	const [promptValue, setPromptValue] = useState('');

	const promptButtonsDisabled = promptValue === '';

	const defaultKeyQuery = trpc.prompts.getDefaultKey.useQuery(undefined, {
		enabled: !!orgId && keysQuery.isSuccess && !hasKey,
	});
	const hasAnyKey = hasKey || (defaultKeyQuery.data?.isSet && !!defaultKeyQuery.data.canUse);

	return (
		<Layout title="Prompts with Friends / Prompts">
			<div className="mt-4 px-4 sm:px-6 lg:px-8 border border-gray-300 rounded-md py-8 flex flex-col gap-10">
				{showAddPrompt && (
					<>
						<form
							className="flex flex-col gap-2 border border-gray-300 rounded-md p-2 mt-4"
							onSubmit={(e) => {
								e.preventDefault();
								const form = e.currentTarget;
								const formData = new FormData(form);
								const prompt = formData.get('prompt') as string;
								const response = (formData.get('response') as string) || '';

								if (storeButtonRef.current === document.activeElement) {
									addPromptMutation.mutate(
										{ orgId, prompt, response },
										{
											onSuccess: () => {
												setPromptValue('');
												form.reset();
												runPromptMutation.reset();
											},
										}
									);
								} else if (runButtonRef.current) {
									if (!runButtonRef.current.disabled) {
										runButtonRef.current.click();
										return;
									}
								}
							}}
						>
							<label className="text-gray-800" htmlFor="prompt">
								Prompt
							</label>
							<textarea
								value={promptValue}
								className="border border-gray-300 rounded-md p-2"
								rows={5}
								name="prompt"
								autoFocus
								onChange={(e) => {
									setPromptValue(e.target.value);
									runPromptMutation.reset();
								}}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && e.metaKey) {
										e.currentTarget.form?.requestSubmit();
									}
								}}
							/>
							{runPromptMutation.data?.message && (
								<input type="hidden" name="response" value={runPromptMutation.data.message} />
							)}
							{runPromptMutation.data?.message && (
								<textarea
									className="border border-gray-300 rounded-md p-2 disabled:opacity-50"
									rows={5}
									disabled
									value={runPromptMutation.data.message}
								/>
							)}
							<div className="flex gap-2 flex-col sm:flex-row justify-around">
								<button
									ref={runButtonRef}
									className="w-32 bg-blue-500 text-white py-2 px-4 rounded-md disabled:opacity-50"
									type="button"
									disabled={
										promptButtonsDisabled ||
										!hasAnyKey ||
										runPromptMutation.isLoading ||
										runPromptMutation.isSuccess
									}
									onClick={(e) => {
										const form = e.currentTarget.form;
										const formData = new FormData(form!);
										const prompt = formData.get('prompt') as string;
										runPromptMutation.mutate({ orgId, prompt });
									}}
								>
									Run{runPromptMutation.isLoading ? 'ning' : ''}
								</button>
								<button
									ref={storeButtonRef}
									disabled={promptButtonsDisabled}
									className="w-32 bg-indigo-500 text-white py-2 px-4 rounded-md disabled:opacity-50"
									type="submit"
								>
									{runPromptMutation.data?.message ? 'Store' : 'Create'}
								</button>
								<button
									type="button"
									className="w-32 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
									onClick={() => {
										setPromptValue('');
										toggleShowAddPrompt();
									}}
								>
									Cancel
								</button>
							</div>
							{!hasKey && (
								<div className="text-sm text-gray-500">
									You need to have a key{' '}
									<a className="text-blue-500 hover:underline" href="/app/settings">
										set up
									</a>{' '}
									to run a prompt{' '}
									{defaultKeyQuery.data?.isSet && (
										<>
											without any limits. You have{' '}
											<code className="bg-gray-100 p-1 rounded-md">
												{defaultKeyQuery.data.requestsRemaining}
											</code>{' '}
											requests until {defaultKeyQuery.data.resetsAt?.toLocaleString()}
										</>
									)}
								</div>
							)}
							{runPromptMutation.error && (
								<div className="text-sm text-red-500">{runPromptMutation.error.message}</div>
							)}
							{runPromptMutation.data?.error && (
								<div className="text-sm text-red-500">{runPromptMutation.data?.error}</div>
							)}
							{addPromptMutation.error && (
								<div className="text-sm text-red-500">{addPromptMutation.error.message}</div>
							)}
						</form>
					</>
				)}
				{!showAddPrompt && (
					<div className="">
						<button
							type="button"
							className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							onClick={toggleShowAddPrompt}
						>
							Add Prompt
						</button>
					</div>
				)}

				{!showAddPrompt && promptsQuery.data?.length === 0 && (
					<div className="flex flex-col text-sm text-gray-700 gap-3">
						<div>No prompts yet!</div>
						<div>Press ☝️ button to create one</div>
					</div>
				)}

				{(promptsQuery.data?.length || 0) > 0 && (
					<div className="sm:flex sm:items-center">
						<div className="flex flex-col gap-2">
							<h1 className="text-base font-semibold leading-6 text-gray-900">
								List of your team's prompts
							</h1>
							<p className="text-sm text-gray-700">
								List of all the prompts that your team has created
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
									{prompt.content}
								</td>
								<td className="px-3 py-4 text-sm text-gray-500">{prompt.userId}</td>
								<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8 gap-2 flex">
									<button
										className="text-indigo-600 hover:text-indigo-900"
										onClick={() => {
											deletePromptMutation.mutate({ promptId: prompt.promptId });
										}}
									>
										Run<span className="sr-only">, prompt</span>
									</button>
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
