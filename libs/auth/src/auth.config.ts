import type { NextAuthConfig } from 'next-auth';
import type { SessionUser } from '@manuraj/domain';

declare module 'next-auth' {
  interface Session {
    user: SessionUser;
  }

  interface User extends SessionUser {}
}

declare module '@auth/core/jwt' {
  interface JWT extends SessionUser {}
}

/**
 * Base auth configuration that is safe for edge runtime.
 * This config does NOT include providers that require Node.js APIs.
 * Used by middleware for session validation.
 */
export const authConfig: NextAuthConfig = {
  providers: [], // Providers are added in auth.ts (Node.js only)
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPublicPath = ['/login', '/signup', '/api/auth', '/api/signup'].some(
        (path) => nextUrl.pathname.startsWith(path)
      );

      if (isPublicPath) {
        return true;
      }

      if (!isLoggedIn) {
        return false; // Redirect to login
      }

      // For tenant paths, validate tenant access
      if (nextUrl.pathname.startsWith('/t/')) {
        const tenantSlugFromPath = nextUrl.pathname.split('/')[2];
        const userTenantSlug = auth.user.tenantSlug;

        // Allow super_admin to access any tenant
        if (auth.user.role === 'super_admin') {
          return true;
        }

        // Regular users can only access their own tenant
        if (tenantSlugFromPath !== userTenantSlug) {
          return Response.redirect(new URL(`/t/${userTenantSlug}`, nextUrl));
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // Initial sign in - store user data in token
        token.id = user.id;
        token.tenantId = user.tenantId;
        token.tenantSlug = user.tenantSlug;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass token data to session
      session.user = {
        id: token.id as string,
        tenantId: token.tenantId as string,
        tenantSlug: token.tenantSlug as string,
        name: token.name as string,
        email: token.email as string,
        role: token.role as SessionUser['role'],
      };
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  trustHost: true,
};
