import NextAuth from 'next-auth';
import { authConfig } from '@manuraj/auth/auth.config';

/**
 * Proxy using edge-safe auth configuration.
 * Replaces middleware.ts (deprecated in Next.js 16).
 * Runs on Node.js runtime.
 */
const { auth } = NextAuth(authConfig);

export const proxy = auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
