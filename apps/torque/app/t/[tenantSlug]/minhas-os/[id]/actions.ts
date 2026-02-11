'use server';

import { auth } from '@manuraj/auth';
import { connectDB, workOrderRepository } from '@manuraj/data-access';
import { finishWorkOrderSchema, hasPermission, PERMISSIONS, type UserRole } from '@manuraj/domain';

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function startWorkOrderAction(workOrderId: string): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: 'Nao autenticado.' };
  }

  const { tenantId, id: userId, role } = session.user;

  if (!hasPermission(role as UserRole, PERMISSIONS.WORK_ORDERS_START)) {
    return { success: false, error: 'Sem permissao para iniciar OS.' };
  }

  await connectDB();

  const result = await workOrderRepository.start(tenantId, workOrderId, userId);

  if (!result) {
    return { success: false, error: 'Nao foi possivel iniciar a OS. Verifique se ela esta atribuida a voce.' };
  }

  return { success: true };
}

export async function finishWorkOrderAction(
  workOrderId: string,
  data: { timeSpentMin?: number; notes?: string }
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: 'Nao autenticado.' };
  }

  const { tenantId, id: userId, role } = session.user;

  if (!hasPermission(role as UserRole, PERMISSIONS.WORK_ORDERS_FINISH)) {
    return { success: false, error: 'Sem permissao para finalizar OS.' };
  }

  const parsed = finishWorkOrderSchema.safeParse(data);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { success: false, error: firstError?.message || 'Dados invalidos.' };
  }

  await connectDB();

  const result = await workOrderRepository.finish(tenantId, workOrderId, userId, parsed.data);

  if (!result) {
    return { success: false, error: 'Nao foi possivel finalizar a OS. Verifique se ela esta em andamento.' };
  }

  return { success: true };
}
