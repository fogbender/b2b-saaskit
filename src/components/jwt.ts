export function parseJwt(token: string) {
	const base64Url = token.split('.')[1];
	if (!base64Url) {
		return;
	}

	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	const jsonPayload = decodeURIComponent(
		window
			.atob(base64)
			.split('')
			.map(function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join('')
	);
	try {
		const parsed = JSON.parse(jsonPayload);
		if (typeof parsed === 'object' && parsed !== null) {
			return parsed as Record<string, unknown>;
		}

		console.error('Could not parse JWT payload', parsed);
		return;
	} catch (e) {
		console.error(e);
		return;
	}
}
