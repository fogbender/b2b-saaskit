import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { websiteTitle } from '../../constants';
import { useRequireActiveOrg } from '../propelauth';
import { trpc } from '../trpc';
import { Layout } from './Layout';
import { CopyToClipboardBtn, JsonSnippet } from './Prompt';
import {
	defaultPrivacyLevel,
	detectTemplates,
	Message,
	PrivacyLevel,
	PromptState,
	resolveTemplates,
	updateTemplateValue,
} from './utils';

const defaultPrompts = {
	empty: [
		{
			role: 'user',
			content: '',
		},
	],
	pirate: [
		{
			role: 'system',
			content: `Talk like a pirate.`,
		},
		{
			role: 'user',
			content: `Your name is {{name||Brick Tamland}}. You love lamp.`,
		},
	],
} satisfies { [name: string]: Message[] };

export function CreatePrompt() {
	const state = useLocation().state as PromptState;

	const [title, setTitle] = useState('Create a prompt');
	const [defaultTemplate, setDefaultTemplate] = useState(
		state?.prompt?.template || defaultPrompts.empty
	);
	const [hasEdits, setHasEdits] = useState(false);
	return (
		<Layout>
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<h3 className="text-2xl font-bold">
						{websiteTitle} / {title}
					</h3>
					<select
						className="rounded-md border border-gray-300 p-1 text-sm"
						onChange={(e) => {
							const newTemplate = defaultPrompts[e.target.value as keyof typeof defaultPrompts];
							if (newTemplate) {
								const confirmed =
									!hasEdits ||
									window.confirm(
										'Are you sure you want to change the template? This will overwrite your current prompt.'
									);
								if (confirmed) {
									setHasEdits(false);
									setDefaultTemplate(newTemplate);
								}
							}
						}}
					>
						<option>Select a template</option>
						{Object.keys(defaultPrompts).map((name) => (
							<option key={name} value={name}>
								{name}
							</option>
						))}
					</select>
				</div>
				<div className="flex w-full flex-col gap-4 sm:w-2/3 md:w-1/2">
					<legend className="text-lg font-medium text-gray-900">Instructions</legend>
					<p>
						Each prompt consists of a sequence of messages. Each message is of type to{' '}
						<span className="italic">system</span>, <span className="italic">user</span>, or{' '}
						<span className="italic">assistant</span>.
					</p>
					<p>A user message is a question or set of instructions to AI from a human.</p>
					<p>An assistant message is a response from AI.</p>
					<p>
						A system message is a set of general instructions to the AI assistant - e.g., "I'm
						playing a game where every time I respond, I must provide an answer and then follow up
						with my own question related to science, theology, or history."
					</p>
				</div>
				<EditPromptControls
					promptName={state?.prompt?.title}
					promptDescription={state?.prompt?.description}
					promptTags={state?.prompt?.tags}
					promptPrivacyLevel={defaultPrivacyLevel(state?.prompt?.privacyLevel)}
					setTitle={setTitle}
					template={defaultTemplate}
					setHasEdits={setHasEdits}
				/>
			</div>
		</Layout>
	);
}

const actions = [
	'user',
	'assistant',
	'system',
	'delete',
	'regenerate',
	'move up',
	'move down',
] as const;

const messageKeys = new WeakMap<Message, number>();
const getMessageKey = (message: Message) => {
	let key = messageKeys.get(message);
	if (!key) {
		key = Math.random();
		messageKeys.set(message, key);
	}
	return key;
};

export const EditPromptControls = ({
	promptId,
	promptName,
	promptDescription,
	promptTags,
	promptPrivacyLevel,
	template: initialMessages,
	setTitle,
	setHasEdits,
}: {
	promptId?: string; // if present, edit existing prompt
	promptName?: string;
	promptDescription?: string;
	promptTags?: string[];
	promptPrivacyLevel?: PrivacyLevel;
	template: Message[];
	setTitle?: (title: string) => void;
	setHasEdits?: (hasEdits: boolean) => void;
}) => {
	const queryClient = useQueryClient();
	const [messages, setMessagesOriginal] = useState<Message[]>(initialMessages);
	useEffect(() => {
		setMessagesOriginal(initialMessages);
	}, [initialMessages]);
	const setMessages: typeof setMessagesOriginal = (action) => {
		setHasEdits?.(true);
		setMessagesOriginal(action);
	};
	const len = messages.length;
	const initialLen = initialMessages.length;
	useEffect(() => {
		const n = Math.max(0, len - initialLen);
		if (n >= 0) {
			setTitle?.(`Create a pro${'o'.repeat(n)}mpt`);
		}
	}, [len, initialLen]);

	const templates = useMemo(() => {
		return detectTemplates(messages);
	}, [messages]);

	const runPromptMutation = trpc.prompts.runPrompt.useMutation({
		onSettled: () => {
			queryClient.invalidateQueries(getQueryKey(trpc.prompts.getDefaultKey));
		},
	});

	const runPromptMutationNewMessage = () =>
		runPromptMutation.mutate(
			{
				messages: resolveTemplates(messages),
			},
			{
				onSuccess(e) {
					if (e.message) {
						setMessages((messages) => [
							...messages,
							{
								role: 'assistant',
								content: e.message,
							},
							{
								role: 'user',
								content: '',
							},
						]);
					}
				},
			}
		);

	const runPromptMutationRegenerate = (index: number) =>
		runPromptMutation.mutate(
			{
				messages: resolveTemplates(messages.slice(0, index)),
			},
			{
				onSuccess(e) {
					if (e.message) {
						setMessages((messages) => {
							const newMessage = {
								role: 'assistant',
								content: e.message,
							} satisfies Message;
							const oldMessage = messages[index];
							if (oldMessage) {
								const key = getMessageKey(oldMessage);
								if (key) {
									messageKeys.set(newMessage, key);
								}
							}
							return messages.slice(0, index).concat(newMessage, messages.slice(index + 1));
						});
					}
				},
			}
		);

	const { hasAnyKey, hasKey, defaultKeyData } = useKeys();

	const navigate = useNavigate();

	const addPromptMutation = trpc.prompts.createPrompt.useMutation({
		onSettled: () => {
			queryClient.invalidateQueries(getQueryKey(trpc.prompts.getPrompts));
		},
		onSuccess: (promptId) => {
			navigate(`/app/prompts/${promptId}`);
		},
	});
	const [saved, setSaved] = useState<string>();
	const updatePromptMutation = trpc.prompts.updatePrompt.useMutation({
		onSettled: () => {
			queryClient.invalidateQueries(getQueryKey(trpc.prompts.getPrompts));
		},
		onSuccess: (promptId) => {
			setSaved(promptId);
			setTimeout(() => setSaved((x) => (x === promptId ? undefined : x)), 500);
		},
	});

	const promptIsBeingSaved = addPromptMutation.isLoading || updatePromptMutation.isLoading;

	const deletePromptMutation = trpc.prompts.deletePrompt.useMutation({
		onSuccess: () => {
			navigate(`/app/prompts`);
		},
		onSettled: () => {
			queryClient.invalidateQueries(getQueryKey(trpc.prompts.getPrompts));
		},
	});

	return (
		<div className="mb-36 mt-4 flex flex-col gap-10">
			<div className="flex flex-col gap-4">
				<InProgress show={runPromptMutation.isLoading} />
				<fieldset className="flex flex-col gap-8 bg-gradient-to-r">
					<div>
						<legend className="text-lg font-medium text-gray-900">Messages</legend>
					</div>
					{messages.map((message, index) => (
						<div className="flex gap-3" key={getMessageKey(message)}>
							<div className="flex flex-col justify-between">
								<label className="block text-sm font-medium text-gray-700">
									{(message.role === 'user'
										? 'User'
										: message.role === 'assistant'
										? 'Assistant'
										: 'System') + ': '}
								</label>
								<div className="flex w-32 flex-col items-start">
									{actions
										.filter((x) => {
											if (x === 'move up') {
												return index > 0;
											}
											if (x === 'move down') {
												return index < messages.length - 1;
											}
											if (x === 'regenerate') {
												return index > 0 && message.role === 'assistant';
											}
											return x !== message.role;
										})
										.map((action) => (
											<button
												key={action}
												className="text-sm text-blue-700 hover:text-rose-600"
												onClick={() => {
													if (action === 'delete') {
														const confirm =
															message.content.trim() === '' ||
															window.confirm('Are you sure you want to delete this message?');
														if (confirm) {
															setMessages((messages) => messages.filter((_, i) => i !== index));
														}
													} else if (action === 'regenerate') {
														runPromptMutationRegenerate(index);
													} else if (action === 'move up') {
														setMessages((messages) => {
															const newMessages = [...messages].filter((_, i) => i !== index);
															newMessages.splice(index - 1, 0, message);
															return newMessages;
														});
													} else if (action === 'move down') {
														setMessages((messages) => {
															const newMessages = [...messages].filter((_, i) => i !== index);
															newMessages.splice(index + 1, 0, message);
															return newMessages;
														});
													} else {
														setMessages((messages) => {
															const key = getMessageKey(message);
															const newMessages = structuredClone(messages);
															const x = newMessages[index];
															if (x) {
																messageKeys.set(x, key); // to preserve key
																x.role = action;
															}
															return newMessages;
														});
													}
												}}
											>
												{action === 'delete'
													? 'Delete'
													: action === 'regenerate'
													? 'Regenerate'
													: action === 'move up'
													? 'Move up'
													: action === 'move down'
													? 'Move down'
													: 'Change to ' + action}
											</button>
										))}
								</div>
							</div>
							<div className="mt-1 w-full">
								<textarea
									ref={onMount}
									value={message.content}
									onChange={(e) => {
										const newText = e.currentTarget.value;
										setMessages((messages) => {
											const key = getMessageKey(message);
											const newMessages = structuredClone(messages);
											const x = newMessages[index];
											if (x) {
												messageKeys.set(x, key); // to preserve the same key
												x.content = newText;
											}
											return newMessages;
										});
									}}
									onKeyDown={(e) => {
										if (e.key === 'Enter' && e.metaKey) {
											runPromptMutationNewMessage();
										} else if (e.key === 'Backspace') {
											if (e.currentTarget.value === '') {
												const confirm = window.confirm(
													'Are you sure you want to delete this message?'
												);
												if (confirm) {
													setMessages((messages) => messages.filter((_, i) => i !== index));
												}
											}
										}
									}}
									className={clsx(
										message.role === 'system'
											? 'bg-gray-200'
											: message.role === 'assistant'
											? 'bg-yellow-50'
											: '',
										'block min-h-[8rem] w-full resize-y overflow-y-scroll whitespace-pre-wrap rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
									)}
								></textarea>
							</div>
						</div>
					))}
				</fieldset>
				<form
					className="flex flex-wrap gap-4 self-center"
					onSubmit={(e) => {
						e.preventDefault();
						const { submitter } = e.nativeEvent as any as { submitter: HTMLButtonElement };
						if (submitter.name === 'generate') {
							runPromptMutationNewMessage();
							return;
						}
						setMessages((messages) => [
							...messages,
							{
								role: submitter.name as Message['role'],
								content: '',
							},
						]);
						setTimeout(() => {
							submitter.scrollIntoView({ block: 'nearest' });
						}, 0);
					}}
				>
					<button
						className="font-medium text-blue-700 hover:text-rose-600 disabled:opacity-50"
						name="generate"
						disabled={
							!hasAnyKey ||
							runPromptMutation.isLoading ||
							!messages.find((x) => x.content.trim().length > 0)
						}
					>
						Generate response
					</button>
					<button className="font-medium text-blue-700 hover:text-rose-600" name="user">
						+ user message
					</button>
					<button className="font-medium text-blue-700 hover:text-rose-600" name="assistant">
						+ assistant message
					</button>
					<button className="font-medium text-blue-700 hover:text-rose-600" name="system">
						+ system message
					</button>
				</form>
				<div>
					{hasKey === false && (
						<div className="text-sm text-gray-500">
							You need to have a key{' '}
							<a className="text-blue-500 hover:underline" href="/app/settings">
								set up
							</a>{' '}
							to run a prompt{' '}
							{defaultKeyData?.isSet && (
								<>
									without any limits. You have{' '}
									<code className="rounded-md bg-gray-100 p-1">
										{defaultKeyData.requestsRemaining}
									</code>{' '}
									requests until {defaultKeyData.resetsAt?.toLocaleString()}
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
				</div>
				{templates.size > 0 && (
					<div>
						<div className="text-lg font-medium text-gray-900">Template values</div>
						{[...templates.entries()].map(([key, value]) => (
							<div key={key} className="mt-4">
								<label
									className="block text-sm font-medium capitalize text-gray-700"
									htmlFor={'template_' + key}
								>
									{key}
								</label>
								<div className="mt-1 w-full">
									<input
										type="text"
										name="template"
										id={'template_' + key}
										className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										placeholder="Template value"
										value={value.values().next().value}
										onChange={(e) => {
											const value = e.currentTarget.value;
											setMessages((data) => updateTemplateValue(data, key, value));
										}}
									/>
								</div>
							</div>
						))}
					</div>
				)}
				<div className="rounded-md border border-gray-300 px-4 py-8 sm:px-6 lg:px-8">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							const form = e.currentTarget;
							const formData = new FormData(form);
							const data = {
								...(Object.fromEntries(formData) as {
									title: string;
									description: string;
									privacyLevel: PrivacyLevel;
								}),
								tags:
									formData
										.get('tags')
										?.toString()
										.split(',')
										.map((x) => x.trim()) ?? [],
								template: messages,
							};
							if (promptId) {
								updatePromptMutation.mutate({ promptId, ...data });
							} else {
								addPromptMutation.mutate(data);
							}
						}}
					>
						<fieldset>
							<legend className="text-lg font-medium text-gray-900">
								Save, publish, or copy prompt
							</legend>
							<div className="mt-4">
								<label className="block text-sm font-medium text-gray-700" htmlFor="promptName">
									Name
								</label>
								<div className="mt-1 w-full">
									<input
										type="text"
										name="title"
										id="promptName"
										className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										placeholder="Prompt name"
										defaultValue={promptName}
									/>
								</div>
							</div>
							<div className="mt-4">
								<label
									className="block text-sm font-medium text-gray-700"
									htmlFor="promptDescription"
								>
									Description
								</label>
								<div className="mt-1 w-full">
									<input
										type="text"
										name="description"
										id="promptDescription"
										className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										placeholder="Prompt description"
										defaultValue={promptDescription}
									/>
								</div>
							</div>
							<div className="mt-4">
								<label className="block text-sm font-medium text-gray-700" htmlFor="promptTags">
									Tags, coma-separated
								</label>
								<div className="mt-1 w-full">
									<input
										type="text"
										name="tags"
										id="promptTags"
										className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										placeholder="Tags"
										defaultValue={promptTags?.join(', ')}
									/>
								</div>
							</div>
							<div className="mt-4">
								<label
									className="block text-sm font-medium text-gray-700"
									htmlFor="promptPrivacyLevel"
								>
									Visibility
								</label>
								<div className="mt-1 w-full">
									<select
										id="promptPrivacyLevel"
										name="privacyLevel"
										className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
										defaultValue={promptPrivacyLevel}
									>
										<option value="public">Public (indexed by Google)</option>
										<option value="unlisted">
											Unlisted (only people with the link can access it)
										</option>
										<option value="team">
											Team (only members of your organization can access it)
										</option>
										<option value="private">Private (only you can access it)</option>
									</select>
								</div>
							</div>
						</fieldset>
						<fieldset className="mt-8 flex flex-col items-start gap-4">
							{messages.length > 0 && <JsonSnippet messages={messages} />}
							{messages.length > 0 && <CopyToClipboardBtn messages={messages} />}
							<button
								className="min-w-[6rem] rounded bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
								type="submit"
								disabled={promptIsBeingSaved}
							>
								{promptId && (promptIsBeingSaved ? 'Saving' : 'Save')}
								{!promptId && (promptIsBeingSaved ? 'Publishing' : 'Publish')}
							</button>
							{promptId && (
								<button
									className="min-w-[6rem] rounded bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
									type="button"
									disabled={deletePromptMutation.isLoading}
									onClick={() => {
										const confirmed = confirm('Are you sure you want to delete this prompt?');
										if (confirmed) {
											deletePromptMutation.mutate({ promptId });
										}
									}}
								>
									Delete
									{deletePromptMutation.isLoading ? 'ing' : ''}
								</button>
							)}
							<span
								className={clsx(
									'text-gray-600 opacity-0',
									saved && saved === promptId ? 'opacity-100' : 'transition-opacity duration-1000'
								)}
							>
								Saved
							</span>
						</fieldset>
						<div className="mt-4">
							{addPromptMutation.error && (
								<div className="text-sm text-red-500">{addPromptMutation.error.message}</div>
							)}
						</div>
						<div className="mt-4">
							{updatePromptMutation.error && (
								<div className="text-sm text-red-500">{updatePromptMutation.error.message}</div>
							)}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

function onMount(el: HTMLTextAreaElement | null) {
	if (el) {
		el.setSelectionRange(el.value.length, el.value.length);
	}
}

function useKeys() {
	const { activeOrg } = useRequireActiveOrg();
	const orgId = activeOrg?.orgId || '';
	const keysQuery = trpc.settings.getKeys.useQuery({ orgId }, { enabled: !!orgId });
	const hasKey = keysQuery.data === undefined ? undefined : (keysQuery.data?.length || 0) !== 0;
	const defaultKeyQuery = trpc.prompts.getDefaultKey.useQuery(undefined, {
		enabled: !!orgId && keysQuery.isSuccess && !hasKey,
	});

	const hasAnyKey = hasKey || (defaultKeyQuery.data?.isSet && !!defaultKeyQuery.data.canUse);
	const defaultKeyData = defaultKeyQuery.data;
	return {
		hasKey,
		hasAnyKey,
		defaultKeyData,
	};
}

const InProgress = ({ show }: { show: boolean }) => {
	const gradient = `
	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}`;
	return (
		<>
			<style>{gradient}</style>
			{show && (
				<div
					className="fixed inset-0 bottom-auto
				h-2 animate-[gradient_3s_ease_infinite] bg-gradient-to-r from-red-500 to-blue-500 bg-[length:200%_200%]"
				></div>
			)}
		</>
	);
};
