import type { APIRoute } from 'astro';

import { createCaller } from '../../lib/trpc/root';

export const post: APIRoute = async ({ request }) => {
	const user = (await request.json()) as AuthenticationInfo | null;
	console.log('user2222', user);
	const headers = new Headers();
	headers.set('Content-Type', 'application/json');
	const x = await createCaller({
		req: request,
		resHeaders: headers,
	}).auth.authSync(
		user
			? { isLoggedIn: true, accessToken: user.accessToken }
			: { isLoggedIn: false, accessToken: undefined }
	);
	return new Response(JSON.stringify(x), { status: 200, headers });
	return new Response(JSON.stringify({}), { status: 200, headers });
};
