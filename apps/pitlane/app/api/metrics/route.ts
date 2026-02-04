import { NextRequest } from 'next/server';
import { connectDB } from '@manuraj/data-access';
import { machineRepository, workOrderRepository, preventivePlanRepository } from '@manuraj/data-access';
import { PERMISSIONS } from '@manuraj/domain';
import type { MetricsResponse } from '@manuraj/domain';
import {
  requirePermission,
  successResponse,
  withErrorHandler,
} from '@manuraj/auth';

// GET /api/metrics - Get dashboard metrics
export const GET = withErrorHandler(async (req: NextRequest) => {
  const user = await requirePermission(PERMISSIONS.METRICS_READ);

  await connectDB();

  // Fetch all metrics in parallel
  const [
    totalMachines,
    openWorkOrders,
    overdueWorkOrders,
    completedThisMonth,
    avgCompletionTimeMin,
    preventivePlansDue,
  ] = await Promise.all([
    machineRepository.countByTenant(user.tenantId),
    workOrderRepository.countByStatus(user.tenantId, 'open'),
    workOrderRepository.countOverdue(user.tenantId),
    workOrderRepository.countCompletedThisMonth(user.tenantId),
    workOrderRepository.getAvgCompletionTime(user.tenantId),
    preventivePlanRepository.countDue(user.tenantId),
  ]);

  const metrics: MetricsResponse = {
    totalMachines,
    openWorkOrders,
    overdueWorkOrders,
    completedThisMonth,
    avgCompletionTimeMin: Math.round(avgCompletionTimeMin),
    preventivePlansDue,
  };

  return successResponse(metrics);
});
