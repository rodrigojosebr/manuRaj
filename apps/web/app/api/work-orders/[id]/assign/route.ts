import { NextRequest } from 'next/server';
import { connectDB } from '@manuraj/data-access';
import { workOrderRepository, userRepository } from '@manuraj/data-access';
import { assignWorkOrderSchema, PERMISSIONS } from '@manuraj/domain';
import {
  requirePermission,
  badRequestResponse,
  notFoundResponse,
  successResponse,
  withErrorHandler,
  RouteContext,
} from '@manuraj/auth';


// POST /api/work-orders/:id/assign - Assign a work order
export const POST = withErrorHandler(async (req: NextRequest, context?: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.WORK_ORDERS_ASSIGN);
  const { id } = await context!.params;

  const body = await req.json();
  const parsed = assignWorkOrderSchema.safeParse(body);

  if (!parsed.success) {
    return badRequestResponse(parsed.error.issues[0].message);
  }

  await connectDB();

  // Verify the assignee exists in the same tenant
  const assignee = await userRepository.findById(user.tenantId, parsed.data.assignedTo);
  if (!assignee) {
    return notFoundResponse('Usuário não encontrado');
  }

  // Only maintainers and supervisors can be assigned work orders
  if (!['maintainer', 'maintenance_supervisor', 'general_supervisor'].includes(assignee.role)) {
    return badRequestResponse('Este usuário não pode receber ordens de serviço');
  }

  const workOrder = await workOrderRepository.assign(user.tenantId, id, parsed.data.assignedTo);
  if (!workOrder) {
    return notFoundResponse('Ordem de serviço não encontrada ou não pode ser atribuída');
  }

  return successResponse(workOrder);
});
