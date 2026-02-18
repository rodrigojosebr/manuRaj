/**
 * Auth Guards Tests
 *
 * Tests for API route guard functions used in Pitlane API routes and Torque server actions.
 * Run with: npx vitest run tests/auth/guards.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';
import type { SessionUser } from '@manuraj/domain';
import { PERMISSIONS } from '@manuraj/domain';

// Mock the auth module that guards.ts imports internally
const { mockAuth } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
}));
vi.mock('../../libs/auth/src/auth', () => ({
  auth: mockAuth,
}));

// Import guards directly (bypasses index.ts which re-exports auth.ts)
import {
  getAuthUser,
  requireAuth,
  requirePermission,
  requireAnyPermission,
  requireRole,
  requireTenantAccess,
  validateTenantFromPath,
  extractTenantSlugFromPath,
  isProtectedPath,
  isTenantPath,
  unauthorizedResponse,
  forbiddenResponse,
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
  withErrorHandler,
} from '../../libs/auth/src/guards';

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

// Helper to set mock session
function setSession(user: SessionUser | null) {
  mockAuth.mockResolvedValue(user ? { user } : null);
}

// Helper to parse NextResponse JSON body
async function parseResponse(response: NextResponse) {
  return response.json();
}

describe('Auth Guards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Response Helpers ───────────────────────────────────────────────

  describe('Response helpers', () => {
    it('unauthorizedResponse returns 401', async () => {
      const res = unauthorizedResponse();
      expect(res.status).toBe(401);
      const body = await parseResponse(res);
      expect(body.error).toBe('UNAUTHORIZED');
      expect(body.message).toBe('Unauthorized');
    });

    it('unauthorizedResponse accepts custom message', async () => {
      const res = unauthorizedResponse('Token expired');
      const body = await parseResponse(res);
      expect(body.message).toBe('Token expired');
    });

    it('forbiddenResponse returns 403', async () => {
      const res = forbiddenResponse();
      expect(res.status).toBe(403);
      const body = await parseResponse(res);
      expect(body.error).toBe('FORBIDDEN');
    });

    it('badRequestResponse returns 400', async () => {
      const res = badRequestResponse('Invalid input');
      expect(res.status).toBe(400);
      const body = await parseResponse(res);
      expect(body.error).toBe('BAD_REQUEST');
      expect(body.message).toBe('Invalid input');
    });

    it('notFoundResponse returns 404', async () => {
      const res = notFoundResponse();
      expect(res.status).toBe(404);
      const body = await parseResponse(res);
      expect(body.error).toBe('NOT_FOUND');
    });

    it('serverErrorResponse returns 500', async () => {
      const res = serverErrorResponse();
      expect(res.status).toBe(500);
      const body = await parseResponse(res);
      expect(body.error).toBe('INTERNAL_SERVER_ERROR');
    });

    it('successResponse wraps data with 200', async () => {
      const res = successResponse({ items: [1, 2, 3] });
      expect(res.status).toBe(200);
      const body = await parseResponse(res);
      expect(body.data).toEqual({ items: [1, 2, 3] });
    });

    it('successResponse accepts custom status', async () => {
      const res = successResponse({ id: 'new' }, 201);
      expect(res.status).toBe(201);
    });
  });

  // ─── getAuthUser ────────────────────────────────────────────────────

  describe('getAuthUser()', () => {
    it('returns user when authenticated', async () => {
      const user = mockUser();
      setSession(user);
      const result = await getAuthUser();
      expect(result).toEqual(user);
    });

    it('returns null when no session', async () => {
      setSession(null);
      const result = await getAuthUser();
      expect(result).toBeNull();
    });

    it('returns null when session has no user', async () => {
      mockAuth.mockResolvedValue({});
      const result = await getAuthUser();
      expect(result).toBeNull();
    });
  });

  // ─── requireAuth ───────────────────────────────────────────────────

  describe('requireAuth()', () => {
    it('returns user when authenticated', async () => {
      const user = mockUser();
      setSession(user);
      const result = await requireAuth();
      expect(result).toEqual(user);
    });

    it('throws 401 response when not authenticated', async () => {
      setSession(null);
      try {
        await requireAuth();
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NextResponse);
        const res = error as NextResponse;
        expect(res.status).toBe(401);
        const body = await parseResponse(res);
        expect(body.message).toBe('Authentication required');
      }
    });
  });

  // ─── requirePermission ─────────────────────────────────────────────

  describe('requirePermission()', () => {
    it('returns user when they have the required permission', async () => {
      const user = mockUser({ role: 'maintainer' });
      setSession(user);
      const result = await requirePermission(PERMISSIONS.WORK_ORDERS_START);
      expect(result).toEqual(user);
    });

    it('throws 403 when user lacks the permission', async () => {
      const user = mockUser({ role: 'operator' });
      setSession(user);
      try {
        await requirePermission(PERMISSIONS.MACHINES_CREATE);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NextResponse);
        expect((error as NextResponse).status).toBe(403);
      }
    });

    it('throws 401 when not authenticated', async () => {
      setSession(null);
      try {
        await requirePermission(PERMISSIONS.MACHINES_READ);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NextResponse);
        expect((error as NextResponse).status).toBe(401);
      }
    });

    it('super_admin has all permissions', async () => {
      const user = mockUser({ role: 'super_admin' });
      setSession(user);
      const result = await requirePermission(PERMISSIONS.TENANTS_DELETE);
      expect(result).toEqual(user);
    });
  });

  // ─── requireAnyPermission ──────────────────────────────────────────

  describe('requireAnyPermission()', () => {
    it('returns user when they have at least one permission', async () => {
      const user = mockUser({ role: 'operator' });
      setSession(user);
      const result = await requireAnyPermission([
        PERMISSIONS.MACHINES_READ,
        PERMISSIONS.MACHINES_CREATE,
      ]);
      expect(result).toEqual(user);
    });

    it('throws 403 when user has none of the permissions', async () => {
      const user = mockUser({ role: 'operator' });
      setSession(user);
      try {
        await requireAnyPermission([
          PERMISSIONS.MACHINES_CREATE,
          PERMISSIONS.MACHINES_DELETE,
        ]);
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NextResponse);
        expect((error as NextResponse).status).toBe(403);
      }
    });

    it('throws 401 when not authenticated', async () => {
      setSession(null);
      try {
        await requireAnyPermission([PERMISSIONS.MACHINES_READ]);
        expect.fail('Should have thrown');
      } catch (error) {
        expect((error as NextResponse).status).toBe(401);
      }
    });
  });

  // ─── requireRole ───────────────────────────────────────────────────

  describe('requireRole()', () => {
    it('returns user with matching single role', async () => {
      const user = mockUser({ role: 'maintainer' });
      setSession(user);
      const result = await requireRole('maintainer');
      expect(result).toEqual(user);
    });

    it('returns user when role matches one in array', async () => {
      const user = mockUser({ role: 'maintenance_supervisor' });
      setSession(user);
      const result = await requireRole(['maintainer', 'maintenance_supervisor']);
      expect(result).toEqual(user);
    });

    it('throws 403 when role does not match', async () => {
      const user = mockUser({ role: 'operator' });
      setSession(user);
      try {
        await requireRole('maintainer');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NextResponse);
        expect((error as NextResponse).status).toBe(403);
        const body = await parseResponse(error as NextResponse);
        expect(body.message).toBe('Insufficient role privileges');
      }
    });

    it('throws 403 when role not in array', async () => {
      const user = mockUser({ role: 'operator' });
      setSession(user);
      try {
        await requireRole(['maintainer', 'maintenance_supervisor']);
        expect.fail('Should have thrown');
      } catch (error) {
        expect((error as NextResponse).status).toBe(403);
      }
    });

    it('throws 401 when not authenticated', async () => {
      setSession(null);
      try {
        await requireRole('maintainer');
        expect.fail('Should have thrown');
      } catch (error) {
        expect((error as NextResponse).status).toBe(401);
      }
    });
  });

  // ─── requireTenantAccess ───────────────────────────────────────────

  describe('requireTenantAccess()', () => {
    it('returns user when tenantId matches', async () => {
      const user = mockUser({ tenantId: 'tenant-456' });
      setSession(user);
      const result = await requireTenantAccess('tenant-456');
      expect(result).toEqual(user);
    });

    it('throws 403 when tenantId does not match', async () => {
      const user = mockUser({ tenantId: 'tenant-456' });
      setSession(user);
      try {
        await requireTenantAccess('tenant-other');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NextResponse);
        expect((error as NextResponse).status).toBe(403);
        const body = await parseResponse(error as NextResponse);
        expect(body.message).toBe('Access denied to this tenant');
      }
    });

    it('super_admin can access any tenant', async () => {
      const user = mockUser({ role: 'super_admin', tenantId: 'admin-tenant' });
      setSession(user);
      const result = await requireTenantAccess('any-other-tenant');
      expect(result).toEqual(user);
    });

    it('throws 401 when not authenticated', async () => {
      setSession(null);
      try {
        await requireTenantAccess('tenant-456');
        expect.fail('Should have thrown');
      } catch (error) {
        expect((error as NextResponse).status).toBe(401);
      }
    });
  });

  // ─── validateTenantFromPath ────────────────────────────────────────

  describe('validateTenantFromPath()', () => {
    it('returns user when tenant slug matches path', async () => {
      const user = mockUser({ tenantSlug: 'demo' });
      setSession(user);
      const result = await validateTenantFromPath('/t/demo/dashboard');
      expect(result).toEqual(user);
    });

    it('throws 403 when tenant slug does not match path', async () => {
      const user = mockUser({ tenantSlug: 'demo' });
      setSession(user);
      try {
        await validateTenantFromPath('/t/other-company/dashboard');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NextResponse);
        expect((error as NextResponse).status).toBe(403);
      }
    });

    it('throws 400 for path without tenant slug', async () => {
      const user = mockUser();
      setSession(user);
      try {
        await validateTenantFromPath('/login');
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NextResponse);
        expect((error as NextResponse).status).toBe(400);
        const body = await parseResponse(error as NextResponse);
        expect(body.message).toBe('Invalid tenant path');
      }
    });

    it('super_admin can access any tenant path', async () => {
      const user = mockUser({ role: 'super_admin', tenantSlug: 'admin' });
      setSession(user);
      const result = await validateTenantFromPath('/t/any-company/dashboard');
      expect(result).toEqual(user);
    });

    it('throws 401 when not authenticated', async () => {
      setSession(null);
      try {
        await validateTenantFromPath('/t/demo/dashboard');
        expect.fail('Should have thrown');
      } catch (error) {
        expect((error as NextResponse).status).toBe(401);
      }
    });
  });

  // ─── extractTenantSlugFromPath ─────────────────────────────────────

  describe('extractTenantSlugFromPath()', () => {
    it('extracts slug from /t/demo', () => {
      expect(extractTenantSlugFromPath('/t/demo')).toBe('demo');
    });

    it('extracts slug from /t/my-company/dashboard', () => {
      expect(extractTenantSlugFromPath('/t/my-company/dashboard')).toBe('my-company');
    });

    it('extracts slug with numbers /t/company123/settings', () => {
      expect(extractTenantSlugFromPath('/t/company123/settings')).toBe('company123');
    });

    it('returns null for paths without /t/ prefix', () => {
      expect(extractTenantSlugFromPath('/login')).toBeNull();
      expect(extractTenantSlugFromPath('/api/auth/callback')).toBeNull();
      expect(extractTenantSlugFromPath('/')).toBeNull();
    });

    it('returns null for /t/ without slug', () => {
      expect(extractTenantSlugFromPath('/t/')).toBeNull();
    });
  });

  // ─── isProtectedPath ───────────────────────────────────────────────

  describe('isProtectedPath()', () => {
    it('returns false for public paths', () => {
      expect(isProtectedPath('/login')).toBe(false);
      expect(isProtectedPath('/signup')).toBe(false);
      expect(isProtectedPath('/api/auth/callback')).toBe(false);
      expect(isProtectedPath('/api/auth/session')).toBe(false);
      expect(isProtectedPath('/_next/static/chunk.js')).toBe(false);
      expect(isProtectedPath('/favicon.ico')).toBe(false);
      expect(isProtectedPath('/public/logo.png')).toBe(false);
    });

    it('returns true for protected paths', () => {
      expect(isProtectedPath('/t/demo')).toBe(true);
      expect(isProtectedPath('/t/demo/dashboard')).toBe(true);
      expect(isProtectedPath('/t/demo/minhas-os')).toBe(true);
      expect(isProtectedPath('/')).toBe(true);
    });
  });

  // ─── isTenantPath ──────────────────────────────────────────────────

  describe('isTenantPath()', () => {
    it('returns true for tenant-scoped paths', () => {
      expect(isTenantPath('/t/demo')).toBe(true);
      expect(isTenantPath('/t/demo/dashboard')).toBe(true);
      expect(isTenantPath('/t/my-company/minhas-os')).toBe(true);
    });

    it('returns false for non-tenant paths', () => {
      expect(isTenantPath('/login')).toBe(false);
      expect(isTenantPath('/signup')).toBe(false);
      expect(isTenantPath('/api/auth')).toBe(false);
      expect(isTenantPath('/')).toBe(false);
    });
  });

  // ─── withErrorHandler ──────────────────────────────────────────────

  describe('withErrorHandler()', () => {
    it('passes through successful handler response', async () => {
      const handler = vi.fn().mockResolvedValue(
        NextResponse.json({ data: 'ok' }, { status: 200 })
      );
      const wrapped = withErrorHandler(handler);
      const req = new Request('http://localhost/api/test') as any;
      const res = await wrapped(req);
      expect(res.status).toBe(200);
    });

    it('returns guard NextResponse errors as-is', async () => {
      const handler = vi.fn().mockRejectedValue(
        unauthorizedResponse('Not logged in')
      );
      const wrapped = withErrorHandler(handler);
      const req = new Request('http://localhost/api/test') as any;
      const res = await wrapped(req);
      expect(res.status).toBe(401);
      const body = await parseResponse(res);
      expect(body.message).toBe('Not logged in');
    });

    it('returns 500 for unexpected errors', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const handler = vi.fn().mockRejectedValue(new Error('DB connection failed'));
      const wrapped = withErrorHandler(handler);
      const req = new Request('http://localhost/api/test') as any;
      const res = await wrapped(req);
      expect(res.status).toBe(500);
      const body = await parseResponse(res);
      expect(body.error).toBe('INTERNAL_SERVER_ERROR');
      consoleError.mockRestore();
    });
  });
});
