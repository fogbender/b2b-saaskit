import { apiServer } from './client';
import { useMutation } from '@tanstack/react-query';
import type { FogbenderPromptsCreateResponse } from '../types/types';
import { env } from '../config';
import { AuthProvider } from './propelauth';
import { TRPCProvider, trpc } from './trpc';
import { AuthSync } from './AuthSync';

export function Prompts(props: { serverUser: ServerUser; prompts: Prompts }) {
	return (
		<AuthProvider authUrl={env.PUBLIC_AUTH_URL}>
			<TRPCProvider>
				<AuthSync />
				<AccountInteral {...props} />
			</TRPCProvider>
		</AuthProvider>
	);
}

function AccountInteral(props: { serverUser: ServerUser; prompts: Prompts }) {
	const addPromptMutation = trpc.prompts.createPrompt.useMutation();
	return (
		<>
			<div>Something here</div>
			<h3>Create new prompt</h3>
			<form
				className="flex flex-col gap-2 border border-gray-300 rounded-md p-2"
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
				<input className="border border-gray-300 rounded-md p-2" type="text" name="prompt" />
				<button className="bg-blue-500 text-white py-2 px-4 rounded-md" type="submit">
					Create
				</button>
			</form>
		</>
	);
}
