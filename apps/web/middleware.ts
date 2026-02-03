import NextAuth from 'next-auth';
import { authConfig } from '@manuraj/auth/auth.config';

/**
 * Middleware using edge-safe auth configuration.
 * This does NOT import MongoDB or any Node.js-only modules.
 */
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
