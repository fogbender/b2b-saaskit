import posthog from 'posthog-js';
import { env } from '../../config';

if (env.PUBLIC_POSTHOG_KEY) {
	posthog.init(env.PUBLIC_POSTHOG_KEY, {
		api_host: 'https://app.posthog.com',
		loaded: function (posthog) {
			posthog.config.debug = false;
		},
	});
}
