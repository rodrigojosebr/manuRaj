import { NextRequest } from 'next/server';
import { connectDB } from '@manuraj/data-access';
import { preventivePlanRepository, machineRepository } from '@manuraj/data-access';
import { createPreventivePlanSchema, paginationSchema, PERMISSIONS } from '@manuraj/domain';
import {
  requireAuth,
  requirePermission,
  badRequestResponse,
  notFoundResponse,
  successResponse,
  withErrorHandler,
} from '@manuraj/auth';

// GET /api/preventive-plans - List preventive plans
export const GET = withErrorHandler(async (req: NextRequest) => {
  const user = await requireAuth();

  await connectDB();

  const { searchParams } = new URL(req.url);
  const parsed = paginationSchema.safeParse({
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
  });

  const page = parsed.success ? parsed.data.page : 1;
  const limit = parsed.success ? parsed.data.limit : 20;
  const machineId = searchParams.get('machineId') || undefined;
  const active = searchParams.get('active');

  const { plans, total } = await preventivePlanRepository.findByTenant(user.tenantId, {
    machineId,
    active: active !== null ? active === 'true' : undefined,
    page,
    limit,
  });

  return successResponse({
    data: plans,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

// POST /api/preventive-plans - Create a preventive plan
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requirePermission(PERMISSIONS.PREVENTIVE_PLANS_CREATE);

  const body = await req.json();
  const parsed = createPreventivePlanSchema.safeParse(body);

  if (!parsed.success) {
    return badRequestResponse(parsed.error.issues[0].message);
  }

  await connectDB();

  // Verify machine belongs to tenant
  const machine = await machineRepository.findById(user.tenantId, parsed.data.machineId);
  if (!machine) {
    return notFoundResponse('Máquina não encontrada');
  }

  const plan = await preventivePlanRepository.create(user.tenantId, parsed.data);

  return successResponse(plan, 201);
});
