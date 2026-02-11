import { redirect } from 'next/navigation';
import { auth } from '@manuraj/auth';
import {
  connectDB,
  workOrderRepository,
  machineRepository,
  preventivePlanRepository,
} from '@manuraj/data-access';
import { TorqueDashboardClient } from './TorqueDashboardClient';

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
}

export default async function AppHomePage({ params }: PageProps) {
  const { tenantSlug } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const { tenantId, id: userId, name: userName, role: userRole } = session.user;

  await connectDB();

  const [assignedOpen, inProgress, overdue, completedThisMonth, totalMachines, recentResult, dueSoonPlans] =
    await Promise.all([
      workOrderRepository.countAssignedByStatus(tenantId, userId, 'assigned'),
      workOrderRepository.countAssignedByStatus(tenantId, userId, 'in_progress'),
      workOrderRepository.countOverdueByAssignee(tenantId, userId),
      workOrderRepository.countCompletedThisMonth(tenantId),
      machineRepository.countByTenant(tenantId),
      workOrderRepository.findAssignedToUser(tenantId, userId, { limit: 5 }),
      preventivePlanRepository.findDueSoon(tenantId, 7),
    ]);

  // Serialize work orders for client (ObjectId → string, Date → ISO string)
  const recentWorkOrders = recentResult.workOrders.map((wo) => {
    const plain = wo.toObject ? wo.toObject() : wo;
    const machine = plain.machineId;
    return {
      _id: plain._id.toString(),
      type: plain.type as string,
      status: plain.status as string,
      priority: plain.priority as string,
      description: plain.description as string,
      dueDate: plain.dueDate ? new Date(plain.dueDate).toISOString() : null,
      machine: machine && typeof machine === 'object' && 'name' in machine
        ? { name: String(machine.name), code: String(machine.code) }
        : null,
    };
  });

  // Serialize preventive plans for client
  const serializedPlans = dueSoonPlans.map((plan) => {
    const plain = plan.toObject ? plan.toObject() : plan;
    const machine = plain.machineId;
    return {
      _id: plain._id.toString(),
      name: plain.name as string,
      nextDueDate: new Date(plain.nextDueDate).toISOString(),
      machine: machine && typeof machine === 'object' && 'name' in machine
        ? { name: String(machine.name), code: String(machine.code) }
        : null,
    };
  });

  return (
    <TorqueDashboardClient
      userName={userName || 'Usuario'}
      userRole={userRole}
      tenantSlug={tenantSlug}
      stats={{
        assignedOpen,
        inProgress,
        overdue,
        completedThisMonth,
        totalMachines,
      }}
      recentWorkOrders={recentWorkOrders}
      dueSoonPlans={serializedPlans}
    />
  );
}
