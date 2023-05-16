export async function formatEnvError() {
	const envErrors = await import('../../t3-env').then(() => {}).catch((err) => err);
	if (envErrors instanceof Error) {
		// cast type to AstroError
		(envErrors as typeof envErrors & { hint: string }).hint =
			'Please go back to the /setup page to finish configuration. See the logs in the terminal for details.';
		throw envErrors;
	}
}

if (import.meta.env.DEV) {
	await formatEnvError();
}
