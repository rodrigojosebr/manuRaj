import { NextRequest } from 'next/server';
import { connectDB } from '@manuraj/data-access';
import { workOrderRepository, machineRepository } from '@manuraj/data-access';
import { createWorkOrderSchema, workOrderQuerySchema, PERMISSIONS } from '@manuraj/domain';
import {
  requireAuth,
  requireAnyPermission,
  badRequestResponse,
  notFoundResponse,
  successResponse,
  withErrorHandler,
} from '@manuraj/auth';

// GET /api/work-orders - List work orders
export const GET = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth();

  await connectDB();

  const { searchParams } = new URL(req.url);
  const parsed = workOrderQuerySchema.safeParse({
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
    status: searchParams.get('status'),
    type: searchParams.get('type'),
    machineId: searchParams.get('machineId'),
    assignedTo: searchParams.get('assignedTo'),
  });

  const query = parsed.success ? parsed.data : { page: 1, limit: 20 };

  // Operators and maintainers can only see work orders assigned to them or created by them
  // Supervisors can see all work orders in their tenant
  let workOrders, total;

  if (user.role === 'operator') {
    // Operators see only their requests
    const result = await workOrderRepository.findByTenant(user.tenantId, {
      ...query,
      type: 'request',
    });
    workOrders = result.workOrders;
    total = result.total;
  } else if (user.role === 'maintainer') {
    // Maintainers see work orders assigned to them
    const result = await workOrderRepository.findAssignedToUser(user.tenantId, user.id, query);
    workOrders = result.workOrders;
    total = result.total;
  } else {
    // Supervisors see all
    const result = await workOrderRepository.findByTenant(user.tenantId, query);
    workOrders = result.workOrders;
    total = result.total;
  }

  return successResponse({
    data: workOrders,
    total,
    page: query.page,
    limit: query.limit,
    totalPages: Math.ceil(total / query.limit),
  });
});

// POST /api/work-orders - Create a work order
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAnyPermission([
    PERMISSIONS.WORK_ORDERS_CREATE,
    PERMISSIONS.WORK_ORDERS_CREATE_REQUEST,
  ]);

  const body = await req.json();
  const parsed = createWorkOrderSchema.safeParse(body);

  if (!parsed.success) {
    return badRequestResponse(parsed.error.issues[0].message);
  }

  // Operators can only create requests
  if (user.role === 'operator' && parsed.data.type !== 'request') {
    return badRequestResponse('Operadores só podem criar solicitações');
  }

  await connectDB();

  // Verify machine belongs to tenant
  const machine = await machineRepository.findById(user.tenantId, parsed.data.machineId);
  if (!machine) {
    return notFoundResponse('Máquina não encontrada');
  }

  const workOrder = await workOrderRepository.create(user.tenantId, user.id, parsed.data);

  return successResponse(workOrder, 201);
});
