import { httpBatchLink } from '@trpc/client';
import { QueryClient } from '@tanstack/react-query';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import superjson from 'superjson';
import type { AppRouter } from '../lib/trpc/root';
import { QueryProvider } from './client';

export const trpc = createTRPCReact<AppRouter>();

export function TRPCProvider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			transformer: superjson,
			links: [
				httpBatchLink({
					url: '/api/trpc',
					// You can pass any HTTP headers you wish here
					async headers() {
						return {
							authorization: 'getAuthCookie()',
						};
					},
				}),
			],
		})
	);
	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryProvider queryClient={queryClient}>{children}</QueryProvider>
		</trpc.Provider>
	);
}
