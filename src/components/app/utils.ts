import type { RouterOutput } from '../trpc';

export type Message = { role: 'user' | 'assistant' | 'system'; content: string };

export function resolveTemplates(messages: Message[]) {
	return messages.map((message) => ({
		role: message.role,
		content: message.content.replace(/{{.*?\|\|(.*?)}}/g, '$1'),
	}));
}

export function defaultPrivacyLevel(value: string | undefined): PrivacyLevel {
	if (value === 'team' || value === 'unlisted' || value === 'public') {
		return value;
	}
	return 'private';
}

export type PrivacyLevel = 'public' | 'team' | 'unlisted' | 'private';

export type PromptState = { prompt?: RouterOutput['prompts']['getPrompt']['prompt'] } | null;
