import type { RouterOutput } from '../trpc';

export type Message = { role: 'user' | 'assistant' | 'system'; content: string };

export function resolveTemplates(messages: Message[]) {
	return messages.map((message) => ({
		role: message.role,
		content: message.content.replace(/{{[^|]*?\|\|(.*?)}}/g, '$1'),
	}));
}

export function detectTemplates(messages: Message[]) {
	const out = new Map<string, Set<string>>();
	messages.forEach((message) => {
		const matches = message.content.matchAll(/{{([^|]*?)\|\|(.*?)}}/g);
		for (const match of matches) {
			const [_, name, value] = match;
			if (name && value !== undefined) {
				const existing = out.get(name);
				if (existing !== undefined) {
					existing.add(value);
				} else {
					out.set(name, new Set([value]));
				}
			}
		}
	});
	return out;
}

export function updateTemplateValue(messages: Message[], key: string, value: string) {
	// someone probably knows how to properly escape key instead, but I'm more comfortable with this
	function replacer(match: string, matchKey: string, _matchValue: string) {
		if (matchKey === key) {
			return '{{' + key + '||' + value + '}}';
		}
		return match;
	}
	return messages.map((message) => ({
		role: message.role,
		content: message.content.replace(/{{([^|]*?)\|\|(.*?)}}/g, replacer),
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
