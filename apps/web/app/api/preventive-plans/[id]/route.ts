import { NextRequest } from 'next/server';
import { connectDB } from '@manuraj/data-access';
import { preventivePlanRepository } from '@manuraj/data-access';
import { updatePreventivePlanSchema, PERMISSIONS } from '@manuraj/domain';
import {
  requireAuth,
  requirePermission,
  badRequestResponse,
  notFoundResponse,
  successResponse,
  withErrorHandler,
  RouteContext,
} from '@manuraj/auth';


// GET /api/preventive-plans/:id - Get a preventive plan
export const GET = withErrorHandler(async (req: NextRequest, context?: RouteContext) => {
  const user = await requireAuth();
  const { id } = await context!.params;

  await connectDB();

  const plan = await preventivePlanRepository.findById(user.tenantId, id);
  if (!plan) {
    return notFoundResponse('Plano preventivo não encontrado');
  }

  return successResponse(plan);
});

// PUT /api/preventive-plans/:id - Update a preventive plan
export const PUT = withErrorHandler(async (req: NextRequest, context?: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.PREVENTIVE_PLANS_UPDATE);
  const { id } = await context!.params;

  const body = await req.json();
  const parsed = updatePreventivePlanSchema.safeParse(body);

  if (!parsed.success) {
    return badRequestResponse(parsed.error.issues[0].message);
  }

  await connectDB();

  const plan = await preventivePlanRepository.update(user.tenantId, id, parsed.data);
  if (!plan) {
    return notFoundResponse('Plano preventivo não encontrado');
  }

  return successResponse(plan);
});

// DELETE /api/preventive-plans/:id - Delete a preventive plan
export const DELETE = withErrorHandler(async (req: NextRequest, context?: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.PREVENTIVE_PLANS_DELETE);
  const { id } = await context!.params;

  await connectDB();

  const deleted = await preventivePlanRepository.delete(user.tenantId, id);
  if (!deleted) {
    return notFoundResponse('Plano preventivo não encontrado');
  }

  return successResponse({ deleted: true });
});
