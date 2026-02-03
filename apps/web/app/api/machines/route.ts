import { NextRequest } from 'next/server';
import { connectDB } from '@manuraj/data-access';
import { machineRepository } from '@manuraj/data-access';
import { createMachineSchema, paginationSchema, PERMISSIONS } from '@manuraj/domain';
import type { MachineStatus } from '@manuraj/domain';
import {
  requireAuth,
  requirePermission,
  badRequestResponse,
  successResponse,
  withErrorHandler,
} from '@manuraj/auth';

// GET /api/machines - List machines for tenant
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
  const status = searchParams.get('status') || undefined;

  const { machines, total } = await machineRepository.findByTenant(user.tenantId, {
    status: status as MachineStatus | undefined,
    page,
    limit,
  });

  return successResponse({
    data: machines,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

// POST /api/machines - Create a machine
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requirePermission(PERMISSIONS.MACHINES_CREATE);

  const body = await req.json();
  const parsed = createMachineSchema.safeParse(body);

  if (!parsed.success) {
    return badRequestResponse(parsed.error.issues[0].message);
  }

  await connectDB();

  // Check if code already exists in tenant
  const codeExists = await machineRepository.codeExistsInTenant(user.tenantId, parsed.data.code);
  if (codeExists) {
    return badRequestResponse('Código de máquina já existe nesta empresa');
  }

  const machine = await machineRepository.create(user.tenantId, parsed.data);

  return successResponse(machine, 201);
});
