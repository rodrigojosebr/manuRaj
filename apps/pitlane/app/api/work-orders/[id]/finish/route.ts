import { NextRequest } from 'next/server';
import { connectDB } from '@manuraj/data-access';
import { workOrderRepository } from '@manuraj/data-access';
import { finishWorkOrderSchema, PERMISSIONS } from '@manuraj/domain';
import {
  requirePermission,
  badRequestResponse,
  notFoundResponse,
  successResponse,
  withErrorHandler,
  RouteContext,
} from '@manuraj/auth';


// POST /api/work-orders/:id/finish - Finish a work order
export const POST = withErrorHandler(async (req: NextRequest, context?: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.WORK_ORDERS_FINISH);
  const { id } = await context!.params;

  const body = await req.json();
  const parsed = finishWorkOrderSchema.safeParse(body);

  if (!parsed.success) {
    return badRequestResponse(parsed.error.issues[0].message);
  }

  await connectDB();

  // User can only finish work orders assigned to them
  const workOrder = await workOrderRepository.finish(user.tenantId, id, user.id, parsed.data);
  if (!workOrder) {
    return notFoundResponse('Ordem de serviço não encontrada ou não pode ser finalizada');
  }

  return successResponse(workOrder);
});
