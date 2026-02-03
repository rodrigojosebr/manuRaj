import { NextRequest } from 'next/server';
import { connectDB } from '@manuraj/data-access';
import { workOrderRepository } from '@manuraj/data-access';
import { updateWorkOrderSchema, PERMISSIONS } from '@manuraj/domain';
import {
  requireAuth,
  requirePermission,
  badRequestResponse,
  notFoundResponse,
  successResponse,
  withErrorHandler,
  RouteContext,
} from '@manuraj/auth';


// GET /api/work-orders/:id - Get a work order
export const GET = withErrorHandler(async (req: NextRequest, context?: RouteContext) => {
  const user = await requireAuth();
  const { id } = await context!.params;

  await connectDB();

  const workOrder = await workOrderRepository.findById(user.tenantId, id);
  if (!workOrder) {
    return notFoundResponse('Ordem de serviço não encontrada');
  }

  return successResponse(workOrder);
});

// PUT /api/work-orders/:id - Update a work order
export const PUT = withErrorHandler(async (req: NextRequest, context?: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.WORK_ORDERS_UPDATE);
  const { id } = await context!.params;

  const body = await req.json();
  const parsed = updateWorkOrderSchema.safeParse(body);

  if (!parsed.success) {
    return badRequestResponse(parsed.error.issues[0].message);
  }

  await connectDB();

  const workOrder = await workOrderRepository.update(user.tenantId, id, parsed.data);
  if (!workOrder) {
    return notFoundResponse('Ordem de serviço não encontrada');
  }

  return successResponse(workOrder);
});

// DELETE /api/work-orders/:id - Delete a work order
export const DELETE = withErrorHandler(async (req: NextRequest, context?: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.WORK_ORDERS_DELETE);
  const { id } = await context!.params;

  await connectDB();

  const deleted = await workOrderRepository.delete(user.tenantId, id);
  if (!deleted) {
    return notFoundResponse('Ordem de serviço não encontrada');
  }

  return successResponse({ deleted: true });
});
