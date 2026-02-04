import { NextRequest } from 'next/server';
import { connectDB } from '@manuraj/data-access';
import { workOrderRepository } from '@manuraj/data-access';
import { PERMISSIONS } from '@manuraj/domain';
import {
  requirePermission,
  notFoundResponse,
  successResponse,
  withErrorHandler,
  RouteContext,
} from '@manuraj/auth';


// POST /api/work-orders/:id/start - Start a work order
export const POST = withErrorHandler(async (req: NextRequest, context?: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.WORK_ORDERS_START);
  const { id } = await context!.params;

  await connectDB();

  // User can only start work orders assigned to them
  const workOrder = await workOrderRepository.start(user.tenantId, id, user.id);
  if (!workOrder) {
    return notFoundResponse('Ordem de serviço não encontrada ou não pode ser iniciada');
  }

  return successResponse(workOrder);
});
