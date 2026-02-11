'use server';

import { auth } from '@manuraj/auth';
import { connectDB, workOrderRepository, machineRepository } from '@manuraj/data-access';
import { createWorkOrderSchema, hasPermission, PERMISSIONS, type UserRole } from '@manuraj/domain';

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function createWorkOrderAction(data: {
  machineId: string;
  priority: string;
  description: string;
}): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: 'Nao autenticado.' };
  }

  const { tenantId, id: userId, role } = session.user;

  // Check permission: operators use CREATE_REQUEST, supervisors use CREATE
  const canCreate =
    hasPermission(role as UserRole, PERMISSIONS.WORK_ORDERS_CREATE_REQUEST) ||
    hasPermission(role as UserRole, PERMISSIONS.WORK_ORDERS_CREATE);

  if (!canCreate) {
    return { success: false, error: 'Sem permissao para criar solicitacoes.' };
  }

  // Validate input with Zod (type fixed as 'request')
  const parsed = createWorkOrderSchema.safeParse({
    machineId: data.machineId,
    type: 'request',
    priority: data.priority,
    description: data.description,
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { success: false, error: firstError?.message || 'Dados invalidos.' };
  }

  await connectDB();

  // Verify machine exists in tenant
  const machine = await machineRepository.findById(tenantId, parsed.data.machineId);
  if (!machine) {
    return { success: false, error: 'Maquina nao encontrada.' };
  }

  // Create work order
  await workOrderRepository.create(tenantId, userId, parsed.data);

  return { success: true };
}
