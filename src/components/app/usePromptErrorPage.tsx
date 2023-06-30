import type { QueryStatus } from '@tanstack/react-query';
import type { TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc';
import { useEffect, useState } from 'react';

import { Layout } from './Layout';

export function usePromptErrorPage(status: QueryStatus, errorCode?: TRPC_ERROR_CODE_KEY) {
	// to make error message sticky when react query tries to refetch
	const [stickyErrorCode, setStickyErrorCode] = useState(errorCode);
	useEffect(() => {
		if (errorCode) {
			setStickyErrorCode(errorCode);
		}
	}, [errorCode]);
	useEffect(() => {
		if (status === 'success') {
			setStickyErrorCode(undefined);
		}
	}, [status]);

	if (stickyErrorCode) {
		if (stickyErrorCode === 'FORBIDDEN') {
			return (
				<Layout title="You don't have access to this prompt 😭">
					<div className="mt-5">
						You can only view prompts that are public, shared within your team, or created by you
					</div>
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

	return;
}
