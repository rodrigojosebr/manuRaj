import { NextRequest } from 'next/server';
import { connectDB } from '@manuraj/data-access';
import { userRepository } from '@manuraj/data-access';
import { updateUserSchema, PERMISSIONS } from '@manuraj/domain';
import {
  requirePermission,
  badRequestResponse,
  notFoundResponse,
  successResponse,
  withErrorHandler,
  RouteContext,
} from '@manuraj/auth';


// GET /api/users/:id - Get a user
export const GET = withErrorHandler(async (_req: NextRequest, context?: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.USERS_READ);
  const { id } = await context!.params;

  await connectDB();

  const foundUser = await userRepository.findById(user.tenantId, id);
  if (!foundUser) {
    return notFoundResponse('Usuário não encontrado');
  }

  // Don't return password hash
  const { passwordHash: _, ...userWithoutPassword } = foundUser;

  return successResponse(userWithoutPassword);
});

// PUT /api/users/:id - Update a user
export const PUT = withErrorHandler(async (req: NextRequest, context?: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.USERS_UPDATE);
  const { id } = await context!.params;

  const body = await req.json();
  const parsed = updateUserSchema.safeParse(body);

  if (!parsed.success) {
    return badRequestResponse(parsed.error.issues[0].message);
  }

  await connectDB();

  // Check if updating email and if it exists
  if (parsed.data.email) {
    const emailExists = await userRepository.emailExistsInTenant(
      user.tenantId,
      parsed.data.email,
      id
    );
    if (emailExists) {
      return badRequestResponse('Email já cadastrado nesta empresa');
    }
  }

  // Only super_admin can change to/from super_admin role
  if (parsed.data.role === 'super_admin' && user.role !== 'super_admin') {
    return badRequestResponse('Permissão insuficiente para alterar este tipo de usuário');
  }

  const updatedUser = await userRepository.update(user.tenantId, id, parsed.data);
  if (!updatedUser) {
    return notFoundResponse('Usuário não encontrado');
  }

  const { passwordHash: _, ...userWithoutPassword } = updatedUser;
  return successResponse(userWithoutPassword);
});

// DELETE /api/users/:id - Deactivate a user
export const DELETE = withErrorHandler(async (_req: NextRequest, context?: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.USERS_DELETE);
  const { id } = await context!.params;

  // Can't delete yourself
  if (id === user.id) {
    return badRequestResponse('Você não pode desativar sua própria conta');
  }

  await connectDB();

  const deactivatedUser = await userRepository.deactivate(user.tenantId, id);
  if (!deactivatedUser) {
    return notFoundResponse('Usuário não encontrado');
  }

  return successResponse({ deactivated: true });
});
