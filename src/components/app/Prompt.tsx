import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

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
	const commentsQuery = trpc.prompts.getComments.useQuery(
		{
			promptId: promptId!,
		},
		{
			enabled: !!promptId,
			staleTime: 1000,
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
				<Layout title="You don't have access to this prompt">
					You can only view prompts that are public or that you have access to
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
			<div className="flex flex-col items-start gap-4 sm:flex-row">
				<h3 className="w-full max-w-2xl truncate text-2xl font-medium sm:w-fit md:max-w-4xl">
					{promptQuery.data ? promptQuery.data.prompt.title : 'Loading...'}
				</h3>
				<div className="min-w-fit">
					{data?.canEdit && (
						<Link className="mr-4" to={`/app/prompts/${promptId}/edit`}>
							Edit
						</Link>
					)}
					{promptId && (
						<button
							className="mr-4"
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
							Likes: {data?.likes}
						</button>
					)}
					<SimpleModalButton className="mr-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
						{data && <ShareDialog response={data} />}
					</SimpleModalButton>
				</div>
			</div>
			<div className="mt-4 flex flex-col gap-10 rounded-md border border-gray-300 px-4 py-8 sm:px-6 lg:px-8">
				<div className="flex flex-col">
					<div className="flex flex-row gap-4">
						<div>
							<h3 className="mb-4 text-xl font-medium">{data?.prompt.title}</h3>
							<p className="my-4">{data?.prompt.description}</p>

							{data?.prompt.tags && (
								<div className="mb-4">
									{data.prompt.tags.map((tag) => (
										<span key={tag} className="mr-2 rounded bg-blue-500 px-2 py-1 text-white">
											{tag}
										</span>
									))}
								</div>
							)}
						</div>
						<div>
							<h3 className="mb-4 text-xl font-medium">
								by {data?.author.name || data?.author.email || data?.prompt.userId}
							</h3>
							<p className="my-4">Created: {data?.prompt.createdAt.toLocaleString()}</p>
							{data?.prompt.createdAt.getTime() !== data?.prompt.updatedAt.getTime() && (
								<p className="my-4">Updated: {data?.prompt.updatedAt.toLocaleString()}</p>
							)}
						</div>
						<div>
							<h3 className="mb-4 text-xl font-medium">Comments:</h3>
							{commentsQuery.data?.comments.map((comment) => (
								<p key={comment.commentId}>{comment.content}</p>
							))}
							<form
								className="flex flex-col"
								onSubmit={(e) => {
									e.preventDefault();
									alert('Not implemented yet!');
								}}
							>
								<input
									disabled
									className="border p-2"
									type="text"
									placeholder="Write a comment..."
								/>
								<button className="mb-8 rounded bg-blue-500 p-2 text-white">Post Comment</button>
							</form>
						</div>
					</div>
				</div>

				<div className="flex flex-col">
					<h3 className="mb-4 text-xl font-medium">Quick replay:</h3>
					{data?.prompt.template.map((message, index) => (
						<p key={index}>
							{message.role}: {message.content}
						</p>
					))}
				</div>

				<div className="flex gap-4">
					<button
						className="rounded bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-700"
						onClick={() => {
							navigate('/app/prompts/create', { state: { prompt: data?.prompt } });
						}}
					>
						Use as a template to create your own prompt
					</button>
					<CopyToClipboardBtn messages={data?.prompt.template} />
				</div>
			</div>
		</Layout>
	);
}

export const CopyToClipboardBtn = ({ messages }: { messages: Message[] | undefined }) => {
	return (
		<button
			type="button"
			className="rounded bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-700"
			onClick={async () => {
				if (messages) {
					const json = JSON.stringify(resolveTemplates(messages));
					await navigator.clipboard.writeText(code(json));
					alert('Copied to clipboard!');
				}
			}}
		>
			Copy code to embed this prompt in your app (Node.js)
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
	children,
}: {
	className?: string;
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
				Share
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
