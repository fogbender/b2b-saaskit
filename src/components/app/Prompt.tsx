import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { trpc } from '../trpc';
import { Layout } from './Layout';
import { Message, resolveTemplates } from './utils';

export function Prompt() {
	const navigate = useNavigate();
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
			<div className="flex items-start gap-4 sm:flex-row flex-col">
				<h3 className="text-2xl font-medium truncate max-w-2xl md:max-w-4xl sm:w-fit w-full">
					{promptQuery.data ? promptQuery.data.prompt.title : 'Loading...'}
				</h3>
				<div className="min-w-fit">
					{data?.canEdit && (
						<Link className="mr-4" to="./edit">
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
					<button className="ml-4">Share</button>
				</div>
			</div>
			<div className="mt-4 px-4 sm:px-6 lg:px-8 border border-gray-300 rounded-md py-8 flex flex-col gap-10">
				<div className="flex flex-col">
					<div className="flex flex-row gap-4">
						<div>
							<h3 className="text-xl font-medium mb-4">{data?.prompt.title}</h3>
							<p className="my-4">{data?.prompt.description}</p>

							{data?.prompt.tags && (
								<div className="mb-4">
									{data.prompt.tags.map((tag) => (
										<span key={tag} className="px-2 py-1 mr-2 bg-blue-500 text-white rounded">
											{tag}
										</span>
									))}
								</div>
							)}
						</div>
						<div>
							<h3 className="text-xl font-medium mb-4">
								by {data?.author.name || data?.author.email || data?.prompt.userId}
							</h3>
							<p className="my-4">Created: {data?.prompt.createdAt.toLocaleString()}</p>
							{data?.prompt.createdAt.getTime() !== data?.prompt.updatedAt.getTime() && (
								<p className="my-4">Updated: {data?.prompt.updatedAt.toLocaleString()}</p>
							)}
						</div>
						<div>
							<h3 className="text-xl font-medium mb-4">Comments:</h3>
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
								<button className="mb-8 bg-blue-500 text-white rounded p-2">Post Comment</button>
							</form>
						</div>
					</div>
				</div>

				<div className="flex flex-col">
					<h3 className="text-xl font-medium mb-4">Quick replay:</h3>
					{data?.prompt.template.map((message, index) => (
						<p key={index}>
							{message.role}: {message.content}
						</p>
					))}
				</div>

				<div className="flex gap-4">
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
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
			className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
			onClick={async () => {
				if (messages) {
					const json = JSON.stringify(resolveTemplates(messages));
					await navigator.clipboard.writeText(code(json));
					alert('Copied to clipboard!');
				}
			}}
		>
			Copy code to embed this prompt in your app (node.js)
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
