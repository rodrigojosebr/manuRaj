/**
 * Auth Config Tests
 *
 * Tests for the `authorized` callback in auth.config.ts.
 * This callback runs in the middleware/proxy to control access.
 * Run with: npx vitest run tests/auth/auth-config.test.ts
 */

import { describe, it, expect } from 'vitest';
import type { SessionUser } from '@manuraj/domain';

// Import the config directly
import { authConfig } from '@manuraj/auth/auth.config';

// Helper to create mock session users
function mockUser(overrides?: Partial<SessionUser>): SessionUser {
  return {
    id: 'user-123',
    tenantId: 'tenant-456',
    tenantSlug: 'demo',
    name: 'Test User',
    email: 'test@demo.com',
    role: 'maintainer',
    ...overrides,
  };
}

// Helper to call the authorized callback
function callAuthorized(pathname: string, user: SessionUser | null) {
  const authorized = authConfig.callbacks!.authorized!;
  const nextUrl = new URL(pathname, 'http://localhost:3000');

  return authorized({
    auth: user ? ({ user } as any) : null,
    request: { nextUrl } as any,
  } as any);
}

describe('Auth Config - authorized callback', () => {
  describe('Public paths', () => {
    it('allows /login without session', () => {
      const result = callAuthorized('/login', null);
      expect(result).toBe(true);
    });

    it('allows /signup without session', () => {
      const result = callAuthorized('/signup', null);
      expect(result).toBe(true);
    });

    it('allows /api/auth paths without session', () => {
      const result = callAuthorized('/api/auth/callback', null);
      expect(result).toBe(true);
    });

    it('allows /api/signup without session', () => {
      const result = callAuthorized('/api/signup', null);
      expect(result).toBe(true);
    });
  });

  describe('Protected paths without session', () => {
    it('denies /t/demo without session', () => {
      const result = callAuthorized('/t/demo', null);
      expect(result).toBe(false);
    });

    it('denies / without session', () => {
      const result = callAuthorized('/', null);
      expect(result).toBe(false);
    });

    it('denies /t/demo/minhas-os without session', () => {
      const result = callAuthorized('/t/demo/minhas-os', null);
      expect(result).toBe(false);
    });
  });

  describe('Tenant path with correct user', () => {
    it('allows user to access their own tenant', () => {
      const user = mockUser({ tenantSlug: 'demo' });
      const result = callAuthorized('/t/demo/dashboard', user);
      expect(result).toBe(true);
    });

    it('allows user to access tenant root', () => {
      const user = mockUser({ tenantSlug: 'demo' });
      const result = callAuthorized('/t/demo', user);
      expect(result).toBe(true);
    });
  });

  describe('Tenant path with wrong user', () => {
    it('redirects to correct tenant when user accesses wrong tenant', () => {
      const user = mockUser({ tenantSlug: 'demo' });
      const result = callAuthorized('/t/other-company', user);
      // Should be a redirect Response
      expect(result).toBeInstanceOf(Response);
      const response = result as Response;
      expect(response.status).toBe(302);
      const location = response.headers.get('location');
      expect(location).toContain('/t/demo');
    });
  });

  describe('Super admin access', () => {
    it('allows super_admin to access any tenant', () => {
      const user = mockUser({ role: 'super_admin', tenantSlug: 'admin' });
      const result = callAuthorized('/t/any-company/dashboard', user);
      expect(result).toBe(true);
    });

    it('allows super_admin to access root', () => {
      const user = mockUser({ role: 'super_admin' });
      const result = callAuthorized('/', user);
      expect(result).toBe(true);
    });
  });

  describe('Non-tenant protected paths', () => {
    it('allows authenticated user on non-tenant protected path', () => {
      const user = mockUser();
      const result = callAuthorized('/', user);
      expect(result).toBe(true);
    });
  });

  describe('JWT callback', () => {
    it('stores user data in token on initial sign in', async () => {
      const jwtCallback = authConfig.callbacks!.jwt!;
      const user = mockUser();
      const token = {} as any;
      const result = await jwtCallback({ token, user, account: null } as any);
      expect(result.id).toBe('user-123');
      expect(result.tenantId).toBe('tenant-456');
      expect(result.tenantSlug).toBe('demo');
      expect(result.role).toBe('maintainer');
    });

    it('preserves existing token when no user (subsequent requests)', async () => {
      const jwtCallback = authConfig.callbacks!.jwt!;
      const token = { id: 'existing', tenantId: 't1', sub: 'sub' } as any;
      const result = await jwtCallback({ token, user: undefined } as any);
      expect(result.id).toBe('existing');
      expect(result.tenantId).toBe('t1');
    });
  });

  describe('Session callback', () => {
    it('populates session.user from token', async () => {
      const sessionCallback = authConfig.callbacks!.session!;
      const token = {
        id: 'user-123',
        tenantId: 'tenant-456',
        tenantSlug: 'demo',
        name: 'Test',
        email: 'test@demo.com',
        role: 'maintainer',
      } as any;
      const session = { user: {} } as any;
      const result = await sessionCallback({ session, token } as any);
      expect(result.user.id).toBe('user-123');
      expect(result.user.tenantId).toBe('tenant-456');
      expect(result.user.tenantSlug).toBe('demo');
      expect(result.user.role).toBe('maintainer');
    });
  });

  describe('Config properties', () => {
    it('uses JWT strategy', () => {
      expect(authConfig.session?.strategy).toBe('jwt');
    });

    it('has 24h max age', () => {
      expect(authConfig.session?.maxAge).toBe(24 * 60 * 60);
    });

    it('redirects to /login for sign in', () => {
      expect(authConfig.pages?.signIn).toBe('/login');
    });

    it('has trustHost enabled', () => {
      expect(authConfig.trustHost).toBe(true);
    });
  });
});
