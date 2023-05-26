import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { useReducer } from 'react';

import { useRequireActiveOrg } from '../propelauth';
import { trpc } from '../trpc';
import { Layout } from './Layout';

export function Settings() {
	const { activeOrg } = useRequireActiveOrg();
	const orgId = activeOrg?.orgId;
	const keysQuery = trpc.settings.getKeys.useQuery(
		{ orgId: orgId || '' },
		{
			enabled: !!orgId,
			staleTime: 1000,
		}
	);
	const queryClient = useQueryClient();
	const addKeyMutation = trpc.settings.createKey.useMutation({
		onSettled: () => {
			queryClient.invalidateQueries(getQueryKey(trpc.settings.getKeys));
		},
	});
	const deleteKeyMutation = trpc.settings.deleteKey.useMutation({
		onSuccess: (data) => {
			queryClient.setQueryData(
				getQueryKey(trpc.settings.getKeys, undefined, 'query'),
				(oldData: typeof keysQuery.data) => oldData?.filter((item) => item.keyId !== data.keyId)
			);
		},
		onSettled: () => {
			queryClient.invalidateQueries(getQueryKey(trpc.settings.getKeys));
		},
	});

	const [showAddKey, toggleShowAddKey] = useReducer((state) => !state, false);
	return (
		<Layout title="Prompts with Friends / Settings">
			<div className="mt-4 px-4 sm:px-6 lg:px-8 border border-gray-300 rounded-md py-8">
				<div className="flex flex-col items-center justify-center w-full">
					<div className="flex flex-col text-start w-full gap-2">
						<div className="sm:flex sm:items-center">
							<div className="sm:flex-auto">
								<h1 className="font-medium text-xl">Configure OpenAI Key</h1>
								<p className="mt-2 text-sm text-gray-700">
									In order to run prompts you need to provide your own OpenAI key. You can get one
									by signing up for OpenAI and going to the{' '}
									<a
										className="text-blue-500 hover:text-blue-700 underline"
										href="https://platform.openai.com/account/api-keys"
									>
										API Keys
									</a>{' '}
									page. Be careful you are going to share access to this token to your whole{' '}
									<a
										className="text-blue-500 hover:text-blue-700 underline"
										href="https://94269089.propelauthtest.com/org"
									>
										Team
									</a>
									. Actual token is not going to be shared, just the ability to use it through
									Prompts with Friends.
								</p>
							</div>
							<div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
								<button
									type="button"
									className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
									onClick={toggleShowAddKey}
								>
									{showAddKey ? 'Cancel' : keysQuery.data?.length ? 'Replace Key' : 'Add Key'}
								</button>
							</div>
						</div>
						{showAddKey && (
							<form
								className="flex flex-col gap-2 border border-gray-300 rounded-md p-2 mt-4"
								onSubmit={(e) => {
									e.preventDefault();
									const form = e.currentTarget;
									const formData = new FormData(form);
									addKeyMutation.mutate(Object.fromEntries(formData) as any, {
										onSuccess: () => {
											form.reset();
										},
									});
								}}
							>
								<label className="text-gray-800" htmlFor="keySecret">
									Secret Key{' '}
									<span className="text-gray-600">
										(get{' '}
										<a
											className="text-blue-500 hover:text-blue-700 underline"
											href="https://platform.openai.com/account/api-keys"
										>
											here
										</a>
										)
									</span>
								</label>
								<input type="hidden" name="orgId" value={orgId} />
								<input
									className="border border-gray-300 rounded-md p-2"
									type="text"
									id="keySecret"
									name="keySecret"
									autoFocus
								/>
								<label className="text-gray-800" htmlFor="keyType">
									GPT version{' '}
									<span className="text-gray-600">(select GPT-4 if you have access to it)</span>
								</label>
								<select
									id="keyType"
									name="keyType"
									className="mt-2 block rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-indigo-600 accent-indigo-600 focus:outline-indigo-500 sm:text-sm sm:leading-6 h-[42px]"
								>
									<option value="gpt-3">GPT-3</option>
									<option value="gpt-4">GPT-4</option>
								</select>
								<button
									className="bg-blue-500 text-white py-2 px-4 rounded-md disabled:opacity-50"
									type="submit"
									disabled={addKeyMutation.isLoading}
								>
									{addKeyMutation.isLoading
										? 'Storing...'
										: keysQuery.data?.length
										? 'Replace'
										: 'Store'}
								</button>
								{addKeyMutation.isError && (
									<div>
										Error!{' '}
										{addKeyMutation.error?.data?.zodError && (
											<pre>{JSON.stringify(addKeyMutation.error.data.zodError, null, 2)}</pre>
										)}
									</div>
								)}
							</form>
						)}
					</div>
					<div className="flex flex-col rounded-lg border border-gray-200 w-full mt-4 pb-4 gap-4 space-between divide-y divide-gray-200">
						<div className="flex flex-row w-full px-6 pt-6 pb-2">
							<div className="flex flex-col">
								<h2 className="font-medium text-lg">Organization key</h2>
								<p className="text-sm text-gray-600">
									You can see here the key that is getting used by default for your organization.
								</p>
							</div>
						</div>
						<div className="flex flex-row w-full gap-4 space-between overflow-y-auto">
							<table className="min-w-full divide-y divide-gray-300">
								<thead>
									<tr>
										<th
											scope="col"
											className="px-3 pl-4 sm:pl-6 lg:pl-8 py-3.5 text-left text-sm font-semibold text-gray-900"
										>
											Key
										</th>
										<th
											scope="col"
											className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
										>
											Type
										</th>
										<th
											scope="col"
											className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
										>
											Added
										</th>
										<th
											scope="col"
											className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
										>
											Last used
										</th>
										<th scope="col">
											<span className="sr-only">Actions</span>
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200 bg-white">
									{keysQuery.isLoading && (
										<tr>
											<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
												Loading...
											</td>
										</tr>
									)}
									{!keysQuery.isLoading && keysQuery.data?.length === 0 && (
										<tr>
											<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
												No keys are configured,{' '}
												<button
													className="text-blue-500 hover:text-blue-700 underline"
													onClick={(e) => {
														e.preventDefault();
														toggleShowAddKey();
													}}
												>
													add one
												</button>{' '}
												to start using prompts.
											</td>
										</tr>
									)}
									{keysQuery.data?.map((key, index) => (
										<tr
											key={key.keyId}
											className={`${index % 2 === 0 ? undefined : 'bg-gray-50'} ${
												deleteKeyMutation.isLoading &&
												deleteKeyMutation.variables?.keyId === key.keyId
													? 'opacity-50'
													: ''
											}`}
										>
											<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
												{key.keyPublic}
											</td>
											<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
												{key.keyType}
											</td>
											<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
												{key.createdAt.toLocaleString()}
											</td>
											<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
												{key.lastUsedAt ? key.lastUsedAt.toLocaleString() : 'Never'}
											</td>
											<td className="flex relative whitespace-nowrap py-4 justify-end text-sm font-medium gap-2 pr-4">
												<button
													type="button"
													className="text-indigo-600 hover:text-indigo-900 p-1 focus:outline-indigo-500"
													onClick={() => {
														const confirm = window.confirm(
															'Are you sure you want to delete this key?'
														);
														if (confirm) {
															deleteKeyMutation.mutate({ keyId: key.keyId });
														}
													}}
												>
													Delete
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}
