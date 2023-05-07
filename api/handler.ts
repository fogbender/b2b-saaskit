export const config = {
	runtime: 'edge',
};

export default (request: Request) => {
	return new Response(`Hello, from ${request.url} I'm now an Edge Function!`);
};
