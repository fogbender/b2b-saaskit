import type { ClientEnv } from './t3-env';

// use clientEnv for client-only code so that you don't ship zod dependency to the client
// vite only supports string values in import.meta.env
export const env = import.meta.env as unknown as ClientEnv satisfies Record<string, string>;
