/* eslint-disable react-refresh/only-export-components */
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import wretch from 'wretch';

export { useQuery };

export function QueryProvider(props: { queryClient: QueryClient; children: React.ReactNode }) {
	return (
		<QueryClientProvider client={props.queryClient}>
			{props.children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

// configure wretch to use different server url for your needs
const serverUrl = '';
export const apiServer = wretch(serverUrl, {
	credentials: 'include',
});

export const queryKeys = {
	fogbender: (userId: string, orgId: string) => ['fogbender', userId, orgId],
};
