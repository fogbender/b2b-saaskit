import type { User } from '@propelauth/node';
import { PostHog } from 'posthog-node';

import { serverEnv } from '../t3-env';

type Session = {
	sessionId: string;
	ipAddress: string;
};

export async function trackEvent(userOrSession: User | Session, event: string) {
	if (serverEnv.PUBLIC_POSTHOG_KEY) {
		const client = new PostHog(serverEnv.PUBLIC_POSTHOG_KEY);
		const { distinctId, properties } = (() => {
			if ('userId' in userOrSession) {
				const { orgIdToOrgMemberInfo: _, ...user } = userOrSession;
				return {
					distinctId: user.userId,
					properties: user,
				};
			} else {
				const session = userOrSession;
				return {
					distinctId: session.sessionId,
					properties: session,
				};
			}
		})();
		client.identify({
			distinctId,
			properties: {
				isDev: import.meta.env.DEV,
				...properties,
			},
		});
		client.capture({
			distinctId,
			event,
		});
		await client.shutdownAsync();
	}
}
