import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { websiteTitle } from '../../constants';
import type { PromptPrivacyLevel } from '../../lib/trpc/routers/prompts';
import { RouterOutput, trpc } from '../trpc';
import { Layout } from './Layout';
import { Message, resolveTemplates, useRedirectToLoginPage } from './utils';

export function Prompt() {
	const navigate = useNavigate();
	const { redirectToLogin } = useRedirectToLoginPage();
	const { promptId } = useParams<{ promptId: string }>();
	const trpcUtils = trpc.useContext();
	const promptQuery = trpc.prompts.getPrompt.useQuery(
		{
			promptId: promptId!,
		},
		{
			enabled: !!promptId,
			staleTime: 1000,
			retry: (retry, error) => {
				return retry < 3 && !error.data?.code;
			},
		}
	);

	const likeMutation = trpc.prompts.likePrompt.useMutation({
		onError: (error) => {
			if (error.data?.code === 'UNAUTHORIZED') {
				redirectToLogin(window.location.pathname);
			}
		},
		onSettled: () => {
			trpcUtils?.prompts.getPrompt.invalidate({ promptId });
		},
	});
	const errorCode = promptQuery.error?.data?.code;
	// to make error message sticky when react query tries to refetch
	const [stickyErrorCode, setStickyErrorCode] = useState(errorCode);
	useEffect(() => {
		if (errorCode) {
			setStickyErrorCode(errorCode);
		}
	}, [errorCode]);
	useEffect(() => {
		if (promptQuery.status === 'success') {
			setStickyErrorCode(undefined);
		}
	}, [promptQuery.status]);

	const data = promptQuery.data;

	if (stickyErrorCode) {
		if (stickyErrorCode === 'FORBIDDEN') {
			return (
				<Layout title="You don't have access to this prompt 😭">
					<div className="mt-5">
						You can only view prompts that are public, shared within your team, or created by you
					</div>
				</Layout>
			);
		} else if (stickyErrorCode === 'UNAUTHORIZED') {
			return (
				<Layout title="You need to be logged in to view this prompt">
					Unauthorized users can only view public prompts. Please log in to view this prompt.
				</Layout>
			);
		} else if (stickyErrorCode === 'NOT_FOUND') {
			return (
				<Layout title="Prompt not found">We couldn't find the prompt you were looking for.</Layout>
			);
		} else {
			return (
				<Layout title="Error">
					An error occurred while loading the prompt. Please try again later.
				</Layout>
			);
		}
	}

	return (
		<Layout>
			<div className="flex flex-col items-center gap-4 sm:flex-row">
				<h3 className="w-full max-w-2xl truncate text-2xl font-bold sm:w-fit md:max-w-4xl">
					{websiteTitle} / {promptQuery.data ? promptQuery.data.prompt.title : 'Loading...'}
				</h3>
				<div className="flex min-w-fit items-center gap-6">
					{promptId && (
						<button
							onClick={() => {
								likeMutation.mutate({ promptId, unlike: data?.myLike });
								trpcUtils.prompts.getPrompt.setData({ promptId }, (data) => {
									if (!data) {
										return data;
									}
									return {
										...data,
										likes: data.likes + (data?.myLike ? -1 : 1),
										myLike: !data?.myLike,
									};
								});
							}}
						>
							<LikesText data={data} />
						</button>
					)}
					{data?.canEdit && (
						<Link
							className="font-medium text-blue-700 hover:text-rose-600 disabled:opacity-50"
							to={`/app/prompts/${promptId}/edit`}
						>
							Edit
						</Link>
					)}
					<SimpleModalButton className="mr-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
						{data && <ShareDialog response={data} />}
					</SimpleModalButton>
				</div>
			</div>
			<div className="mt-4 flex flex-col gap-10 rounded-md border border-gray-300 px-4 py-8 sm:px-6 lg:px-8">
				<div className="flex flex-col">
					<div className="flex flex-row flex-wrap gap-4 md:flex-nowrap">
						<div className="flex w-full flex-col gap-4 md:w-1/2">
							<h3 className="text-xl font-medium">{data?.prompt.title}</h3>
							<p>{data?.prompt.description}</p>

							<div className="flex gap-2">
								<span>Tags:</span>
								{data?.prompt.tags && (
									<div>
										{data.prompt.tags.map((tag) => (
											<span
												key={tag}
												className="mr-2 rounded-lg bg-gray-400 px-2 py-0.5 text-sm text-white"
											>
												{tag}
											</span>
										))}
									</div>
								)}
							</div>
							{data && (
								<div className="flex gap-2">
									<span>Visibility:</span>
									<span>{data.prompt.privacyLevel}</span>
									<span>
										(
										<SimpleModalButton
											title="change"
											className="!p-0 font-medium text-blue-700 hover:text-rose-600 disabled:opacity-50"
										>
											{data && <ShareDialog response={data} />}
										</SimpleModalButton>
										)
									</span>
								</div>
							)}
						</div>
						<div className="flex w-full flex-col gap-4 md:w-1/2">
							<h3 className="flex items-center">
								<div className="min-w-[6rem]">Author</div>
								<div className="font-medium">
									{data?.author?.name || data?.author?.email || data?.prompt.userId}
								</div>
							</h3>
							<div className="flex items-center">
								<div className="min-w-[6rem]">Created</div>
								<div>{data?.prompt.createdAt.toLocaleString()}</div>
							</div>
							{data?.prompt.createdAt.getTime() !== data?.prompt.updatedAt.getTime() && (
								<div className="flex items-center">
									<div className="min-w-[6rem]">Updated</div>
									<div>{data?.prompt.updatedAt.toLocaleString()}</div>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="flex flex-col">
					<h3 className="mb-4 text-xl font-medium">Quick replay</h3>
					{data?.prompt.template.map((message, index) => (
						<div className="flex" key={index}>
							<div className="min-w-[6rem] font-medium capitalize">{message.role}</div>
							<div>{message.content}</div>
						</div>
					))}
				</div>

				<div className="flex flex-col items-start gap-4">
					<button
						className="font-medium text-blue-700 hover:text-rose-600 disabled:opacity-50"
						onClick={() => {
							navigate('/app/prompts/create', { state: { prompt: data?.prompt } });
						}}
					>
						Fork prompt
					</button>
					{(data?.prompt?.template?.length || 0) > 0 && (
						<JsonSnippet messages={data?.prompt?.template || []} />
					)}
					<CopyToClipboardBtn messages={data?.prompt.template} />
				</div>
			</div>
		</Layout>
	);
}

const LikesText = ({ data }: { data: { likes: number; myLike: boolean } | undefined }) => {
	const likes = data?.likes || 0;
	const withoutMyLike = likes - (data?.myLike ? 1 : 0);
	const showCounter = withoutMyLike > 0;
	return (
		<span className="flex">
			<span aria-label="likes ">{data?.myLike ? '❤️' : '🤍'}</span>
			<span className={clsx(showCounter ? '' : 'opacity-0', '-mr-6 min-w-[2.5rem] px-2')}>
				{likes}
			</span>
		</span>
	);
};

export const JsonSnippet = ({ messages }: { messages: Message[] }) => {
	const json = JSON.stringify(resolveTemplates(messages));

	return <code className="rounded bg-gray-800 p-2 text-xs text-white">{json}</code>;
};

export const CopyToClipboardBtn = ({ messages }: { messages: Message[] | undefined }) => {
	return (
		<button
			type="button"
			className="font-medium text-blue-700 hover:text-rose-600 disabled:opacity-50"
			onClick={async () => {
				if (messages) {
					const json = JSON.stringify(resolveTemplates(messages));
					await navigator.clipboard.writeText(code(json));
					alert('Copied to clipboard!');
				}
			}}
		>
			Copy code (Node.js)
		</button>
	);
};

const code = (json: string) => {
	return `import { Configuration, OpenAIApi } from 'openai-edge';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config);

const response = await openai.createChatCompletion({  
  model: 'gpt-3.5-turbo',
  messages: ${json},
  max_tokens: 200,
  temperature: 0.7,
  top_p: 1,   
  frequency_penalty: 1,
  presence_penalty: 1,    
});
const result = await response.json();
const completion = result.choices[0].message.content`;
};

const focus = (el: Element | undefined | null) => {
	if (el && el instanceof HTMLElement) {
		el.focus();
	}
};

/**
 * @see https://uxdesign.cc/how-to-trap-focus-inside-modal-to-make-it-ada-compliant-6a50f9a70700
 */
const SimpleModalButton = ({
	className,
	title = 'Share',
	children,
}: {
	className?: string;
	title?: string;
	children: React.ReactNode;
}) => {
	const modalRef = useRef<HTMLDivElement | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const focusRef = useRef<Element | null>(null);
	useEffect(() => {
		if (isModalOpen) {
			focusRef.current = document.activeElement;
			document.body.style.overflow = 'hidden';
		} else {
			// try to restore focus to the last focused element
			focus(focusRef.current);
			document.body.style.overflow = 'unset';
		}
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setIsModalOpen(false);
			}
			const isTabPressed = e.key === 'Tab';
			if (isTabPressed) {
				// add all the elements inside modal which you want to make focusable
				const focusableElements =
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
				const focusableContent = modalRef.current?.querySelectorAll(focusableElements);
				if (e.shiftKey) {
					// shift + tab wraps focus to end if you're on first element
					if (document.activeElement === focusableContent?.[0]) {
						e.preventDefault();
						focus(focusableContent?.[focusableContent.length - 1]);
					}
				} else {
					// tab wraps focus to start if you're on last element
					if (document.activeElement === focusableContent?.[focusableContent.length - 1]) {
						e.preventDefault();
						focus(focusableContent?.[0]);
					}
				}
				let focusedOutside = false;
				focusableContent?.forEach((el) => {
					focusedOutside = focusedOutside || el === document.activeElement;
				});
				console.log('focusedOutside', focusedOutside, document.activeElement);
				return;
			}
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isModalOpen]);

	return (
		<>
			<button className={className} onClick={() => setIsModalOpen((x) => !x)}>
				{title}
			</button>
			<div
				ref={modalRef}
				onClick={() => setIsModalOpen(false)}
				className={clsx(
					'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50',
					isModalOpen ? 'flex' : 'hidden'
				)}
			>
				<div
					className="mx-auto max-h-[90vh] max-w-lg overflow-auto rounded bg-white p-6 shadow-lg"
					onClick={(e) => e.stopPropagation()}
				>
					{children}
					<button
						onClick={() => setIsModalOpen(false)}
						className="rounded bg-red-500 px-4 py-2 text-white"
					>
						Close
					</button>
				</div>
			</div>
		</>
	);
};

const ShareDialog = ({ response }: { response: RouterOutput['prompts']['getPrompt'] }) => {
	const promptData = response.prompt;
	const trpcUtils = trpc.useContext();
	const updatePromptMutation = trpc.prompts.updatePrompt.useMutation({
		onSettled: async () => {
			await trpcUtils.prompts.getPrompt.invalidate({ promptId: promptData.promptId });
		},
	});
	const privacyLevel = updatePromptMutation.variables?.privacyLevel || promptData.privacyLevel;
	return (
		<>
			<h1 className="mb-4 text-2xl font-bold">Share this prompt with your friends</h1>
			<div className="mt-4">
				<label className="block text-sm font-medium text-gray-700" htmlFor="promptPrivacyLevel">
					Visibility
				</label>
				<div className="mt-1 w-full">
					<select
						id="promptPrivacyLevel"
						className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50 sm:text-sm"
						value={privacyLevel}
						disabled={updatePromptMutation.isLoading}
						onChange={(e) => {
							updatePromptMutation.mutate({
								promptId: promptData.promptId,
								privacyLevel: e.target.value as PromptPrivacyLevel,
								title: promptData.title,
								description: promptData.description,
								tags: promptData.tags,
								template: promptData.template,
							});
						}}
					>
						<option value="public">Public</option>
						<option value="unlisted">Unlisted (only people with the link can access it)</option>
						<option value="team">Team (only members of your organization can access it)</option>
						<option value="private">Private (only you can access it)</option>
					</select>
				</div>
			</div>
			{(privacyLevel === 'public' || privacyLevel === 'unlisted') && (
				<div className="mt-4">
					<label className="block text-sm font-medium text-gray-700" htmlFor="shareUrl">
						Public URL ({privacyLevel === 'unlisted' ? 'not ' : ''}indexed by Google)
					</label>
					<div className="mt-1 flex flex-row gap-4">
						<input
							id="shareUrl"
							className="w-full rounded border p-2"
							type="text"
							value={response.publicUrl}
							readOnly
						/>
						<button
							className="rounded bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-700"
							onClick={() => {
								navigator.clipboard.writeText(response.publicUrl);
							}}
						>
							Copy
						</button>
					</div>
				</div>
			)}
			<div className="mt-4">
				<label className="block text-sm font-medium text-gray-700" htmlFor="promptUrl">
					Prompt URL{' '}
					{privacyLevel === 'team' || privacyLevel === 'public'
						? '(for you and your team)'
						: '(for you)'}
				</label>
				<div className="mt-1 flex flex-row gap-4">
					<input
						id="promptUrl"
						className="w-full rounded border p-2"
						type="text"
						value={response.shareUrl}
						readOnly
					/>
					<button
						className="rounded bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-700"
						onClick={() => {
							navigator.clipboard.writeText(response.shareUrl);
						}}
					>
						Copy
					</button>
				</div>
			</div>
			{updatePromptMutation.error && (
				<div className="mt-4">
					<p className="text-red-500">{updatePromptMutation.error.message}</p>
				</div>
			)}
			<br />
		</>
	);
};
