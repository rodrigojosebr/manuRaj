import { redirect } from 'next/navigation';
import { auth } from '@manuraj/auth';
import { connectDB, workOrderRepository } from '@manuraj/data-access';
import { MinhasOsClient } from './MinhasOsClient';

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
}

export default async function MinhasOsPage({ params }: PageProps) {
  const { tenantSlug } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const { tenantId, id: userId } = session.user;

  await connectDB();

  const { workOrders } = await workOrderRepository.findAssignedToUser(
    tenantId,
    userId,
    { limit: 100 }
  );

  // Serialize for client component (ObjectId → string, Date → string)
  const serialized = workOrders.map((wo) => ({
    _id: String(wo._id),
    type: wo.type,
    status: wo.status,
    priority: wo.priority,
    description: wo.description,
    dueDate: wo.dueDate ? wo.dueDate.toISOString() : null,
    startedAt: wo.startedAt ? wo.startedAt.toISOString() : null,
    timeSpentMin: wo.timeSpentMin ?? null,
    machine: wo.machineId
      ? {
          name: (wo.machineId as unknown as { name: string; code: string }).name,
          code: (wo.machineId as unknown as { name: string; code: string }).code,
        }
      : null,
  }));

  return (
    <MinhasOsClient
      workOrders={serialized}
      tenantSlug={tenantSlug}
    />
  );
}
