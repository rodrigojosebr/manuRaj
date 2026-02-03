import { NextRequest } from 'next/server';
import { connectDB } from '@manuraj/data-access';
import { machineRepository, machineDocumentRepository } from '@manuraj/data-access';
import { paginationSchema } from '@manuraj/domain';
import {
  requireAuth,
  notFoundResponse,
  successResponse,
  withErrorHandler,
  RouteContext,
} from '@manuraj/auth';


// GET /api/machines/:id/documents - List documents for a machine
export const GET = withErrorHandler(async (req: NextRequest, context?: RouteContext) => {
  const user = await requireAuth();
  const { id: machineId } = await context!.params;

  await connectDB();

  // Verify machine belongs to tenant
  const machine = await machineRepository.findById(user.tenantId, machineId);
  if (!machine) {
    return notFoundResponse('Máquina não encontrada');
  }

  const { searchParams } = new URL(req.url);
  const parsed = paginationSchema.safeParse({
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
  });

  const page = parsed.success ? parsed.data.page : 1;
  const limit = parsed.success ? parsed.data.limit : 20;

  const { documents, total } = await machineDocumentRepository.findByMachine(
    user.tenantId,
    machineId,
    { page, limit }
  );

  return successResponse({
    data: documents,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});
