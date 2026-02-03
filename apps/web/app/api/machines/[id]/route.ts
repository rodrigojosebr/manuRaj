import { NextRequest } from 'next/server';
import { connectDB } from '@manuraj/data-access';
import { machineRepository } from '@manuraj/data-access';
import { updateMachineSchema, PERMISSIONS } from '@manuraj/domain';
import {
  requireAuth,
  requirePermission,
  badRequestResponse,
  notFoundResponse,
  successResponse,
  withErrorHandler,
  RouteContext,
} from '@manuraj/auth';

// GET /api/machines/:id - Get a machine by ID
export const GET = withErrorHandler(async (req: NextRequest, context?: RouteContext) => {
  const user = await requireAuth();
  const { id } = await context!.params;

  await connectDB();

  const machine = await machineRepository.findById(user.tenantId, id);
  if (!machine) {
    return notFoundResponse('Máquina não encontrada');
  }

  return successResponse(machine);
});

// PUT /api/machines/:id - Update a machine
export const PUT = withErrorHandler(async (req: NextRequest, context?: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.MACHINES_UPDATE);
  const { id } = await context!.params;

  const body = await req.json();
  const parsed = updateMachineSchema.safeParse(body);

  if (!parsed.success) {
    return badRequestResponse(parsed.error.issues[0].message);
  }

  await connectDB();

  // Check if updating code and if it exists
  if (parsed.data.code) {
    const codeExists = await machineRepository.codeExistsInTenant(
      user.tenantId,
      parsed.data.code,
      id
    );
    if (codeExists) {
      return badRequestResponse('Código de máquina já existe nesta empresa');
    }
  }

  const machine = await machineRepository.update(user.tenantId, id, parsed.data);
  if (!machine) {
    return notFoundResponse('Máquina não encontrada');
  }

  return successResponse(machine);
});

// DELETE /api/machines/:id - Delete a machine
export const DELETE = withErrorHandler(async (req: NextRequest, context?: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.MACHINES_DELETE);
  const { id } = await context!.params;

  await connectDB();

  const deleted = await machineRepository.delete(user.tenantId, id);
  if (!deleted) {
    return notFoundResponse('Máquina não encontrada');
  }

  return successResponse({ deleted: true });
});
