import { auth } from '@manuraj/auth';
import { connectDB, machineRepository, workOrderRepository, preventivePlanRepository } from '@manuraj/data-access';
import { hasPermission, PERMISSIONS } from '@manuraj/domain';
import { DashboardClient } from './DashboardClient';

interface DashboardPageProps {
  params: Promise<{ tenantSlug: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const session = await auth();
  if (!session?.user) return null;

  await connectDB();

  const tenantId = session.user.tenantId;
  const canViewMetrics = hasPermission(session.user.role, PERMISSIONS.METRICS_READ);

  // Fetch basic data for all users
  const [recentMachines, recentWorkOrders] = await Promise.all([
    machineRepository.findByTenant(tenantId, { limit: 5 }),
    session.user.role === 'maintainer'
      ? workOrderRepository.findAssignedToUser(tenantId, session.user.id, { limit: 5 })
      : workOrderRepository.findByTenant(tenantId, { limit: 5 }),
  ]);

  // Fetch metrics only for supervisors
  let metrics = null;
  if (canViewMetrics) {
    const [
      totalMachines,
      openWorkOrders,
      overdueWorkOrders,
      completedThisMonth,
      avgCompletionTimeMin,
      preventivePlansDue,
    ] = await Promise.all([
      machineRepository.countByTenant(tenantId),
      workOrderRepository.countByStatus(tenantId, 'open'),
      workOrderRepository.countOverdue(tenantId),
      workOrderRepository.countCompletedThisMonth(tenantId),
      workOrderRepository.getAvgCompletionTime(tenantId),
      preventivePlanRepository.countDue(tenantId),
    ]);

    metrics = {
      totalMachines,
      openWorkOrders,
      overdueWorkOrders,
      completedThisMonth,
      avgCompletionTimeMin: Math.round(avgCompletionTimeMin),
      preventivePlansDue,
    };
  }

  // Serialize data for client component
  const serializedMachines = recentMachines.machines.map((m) => ({
    ...m,
    _id: m._id.toString(),
    tenantId: m.tenantId.toString(),
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  }));

  const serializedWorkOrders = recentWorkOrders.workOrders.map((wo) => ({
    ...wo,
    _id: wo._id.toString(),
    tenantId: wo.tenantId.toString(),
    machineId: String(wo.machineId),
    assignedTo: wo.assignedTo ? String(wo.assignedTo) : undefined,
    createdBy: String(wo.createdBy),
    dueDate: wo.dueDate?.toISOString(),
    startedAt: wo.startedAt?.toISOString(),
    finishedAt: wo.finishedAt?.toISOString(),
    createdAt: wo.createdAt.toISOString(),
    updatedAt: wo.updatedAt.toISOString(),
  }));

  return (
    <DashboardClient
      user={session.user}
      metrics={metrics}
      recentMachines={serializedMachines}
      recentWorkOrders={serializedWorkOrders}
    />
  );
}
