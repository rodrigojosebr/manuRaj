import { handlers } from '@manuraj/auth';

console.log('[NextAuth Route] handlers loaded:', Object.keys(handlers));

export const { GET, POST } = handlers;
