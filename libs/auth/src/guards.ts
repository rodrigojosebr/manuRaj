import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';
import type { SessionUser, UserRole, Permission } from '@manuraj/domain';
import { hasPermission, hasAnyPermission } from '@manuraj/domain';

/**
 * API Response helpers
 */
export function unauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json(
    { error: 'UNAUTHORIZED', message, statusCode: 401 },
    { status: 401 }
  );
}

export function forbiddenResponse(message = 'Forbidden') {
  return NextResponse.json(
    { error: 'FORBIDDEN', message, statusCode: 403 },
    { status: 403 }
  );
}

export function badRequestResponse(message: string) {
  return NextResponse.json(
    { error: 'BAD_REQUEST', message, statusCode: 400 },
    { status: 400 }
  );
}

export function notFoundResponse(message = 'Resource not found') {
  return NextResponse.json(
    { error: 'NOT_FOUND', message, statusCode: 404 },
    { status: 404 }
  );
}

export function serverErrorResponse(message = 'Internal server error') {
  return NextResponse.json(
    { error: 'INTERNAL_SERVER_ERROR', message, statusCode: 500 },
    { status: 500 }
  );
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

/**
 * Get authenticated user from session
 * Use this in API routes to get the current user
 */
export async function getAuthUser(): Promise<SessionUser | null> {
  const session = await auth();
  return session?.user || null;
}

/**
 * Require authentication for API route
 * Returns the user if authenticated, or throws an error response
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getAuthUser();
  if (!user) {
    throw unauthorizedResponse('Authentication required');
  }
  return user;
}

/**
 * Require specific permission for API route
 * Returns the user if authorized, or throws an error response
 */
export async function requirePermission(permission: Permission): Promise<SessionUser> {
  const user = await requireAuth();
  if (!hasPermission(user.role, permission)) {
    throw forbiddenResponse(`Missing permission: ${permission}`);
  }
  return user;
}

/**
 * Require any of the specified permissions
 */
export async function requireAnyPermission(permissions: Permission[]): Promise<SessionUser> {
  const user = await requireAuth();
  if (!hasAnyPermission(user.role, permissions)) {
    throw forbiddenResponse('Insufficient permissions');
  }
  return user;
}

/**
 * Require specific role(s) for API route
 */
export async function requireRole(roles: UserRole | UserRole[]): Promise<SessionUser> {
  const user = await requireAuth();
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  if (!allowedRoles.includes(user.role)) {
    throw forbiddenResponse('Insufficient role privileges');
  }
  return user;
}

/**
 * Tenant guard - ensures the user belongs to the specified tenant
 * Critical for multi-tenant security
 */
export async function requireTenantAccess(tenantIdFromPath: string): Promise<SessionUser> {
  const user = await requireAuth();

  // Super admin can access any tenant
  if (user.role === 'super_admin') {
    return user;
  }

  // Regular users can only access their own tenant
  if (user.tenantId !== tenantIdFromPath) {
    throw forbiddenResponse('Access denied to this tenant');
  }

  return user;
}

/**
 * Extract tenant slug from path-based routing
 * For routes like /t/{tenantSlug}/...
 */
export function extractTenantSlugFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/t\/([a-z0-9-]+)/);
  return match ? match[1] : null;
}

/**
 * Validate that the tenant slug in the URL matches the user's tenant
 */
export async function validateTenantFromPath(pathname: string): Promise<SessionUser> {
  const user = await requireAuth();
  const urlTenantSlug = extractTenantSlugFromPath(pathname);

  if (!urlTenantSlug) {
    throw badRequestResponse('Invalid tenant path');
  }

  // Super admin can access any tenant
  if (user.role === 'super_admin') {
    return user;
  }

  // Regular users must match their tenant slug
  if (user.tenantSlug !== urlTenantSlug) {
    throw forbiddenResponse('Access denied to this tenant');
  }

  return user;
}

/**
 * Middleware helper to check if path requires authentication
 */
export function isProtectedPath(pathname: string): boolean {
  // Public paths that don't require auth
  const publicPaths = [
    '/login',
    '/signup',
    '/api/auth',
    '/_next',
    '/favicon.ico',
    '/public',
  ];

  return !publicPaths.some(path => pathname.startsWith(path));
}

/**
 * Middleware helper to check if path is a tenant-scoped path
 */
export function isTenantPath(pathname: string): boolean {
  return pathname.startsWith('/t/');
}

// Route context type
export type RouteContext = {
  params: Promise<Record<string, string>>;
};

// Route handler type
export type RouteHandler = (
  req: NextRequest,
  context?: RouteContext
) => Promise<NextResponse>;

/**
 * API wrapper that handles errors gracefully
 */
export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context?: RouteContext) => {
    try {
      return await handler(req, context);
    } catch (error) {
      // If it's already a NextResponse (from our guards), return it
      if (error instanceof NextResponse) {
        return error;
      }

      // Log unexpected errors
      console.error('[API Error]', error);

      // Return generic error for unexpected errors
      return serverErrorResponse();
    }
  };
}
