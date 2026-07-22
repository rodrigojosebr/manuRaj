import { redirect } from 'next/navigation';
import { auth } from '@manuraj/auth';
import { connectDB, workOrderRepository } from '@manuraj/data-access';
import { WoDetailClient, type SerializedWorkOrderDetail } from './WoDetailClient';

interface PageProps {
  params: Promise<{ tenantSlug: string; id: string }>;
}

export default async function WoDetailPage({ params }: PageProps) {
  const { tenantSlug, id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const { tenantId, role } = session.user;

  await connectDB();

  const wo = await workOrderRepository.findById(tenantId, id);

  if (!wo) {
    redirect(`/t/${tenantSlug}/minhas-os`);
  }

  // Serialize all fields for client component
  const machine = wo.machineId as unknown as { name: string; code: string; location?: string } | null;
  const assignedTo = wo.assignedTo as unknown as { name: string } | null;

  const serialized: SerializedWorkOrderDetail = {
    _id: String(wo._id),
    type: wo.type,
    status: wo.status,
    priority: wo.priority,
    description: wo.description,
    dueDate: wo.dueDate ? wo.dueDate.toISOString() : null,
    startedAt: wo.startedAt ? wo.startedAt.toISOString() : null,
    finishedAt: wo.finishedAt ? wo.finishedAt.toISOString() : null,
    timeSpentMin: wo.timeSpentMin ?? null,
    notes: wo.notes ?? null,
    partsUsed: wo.partsUsed ?? [],
    machine: machine
      ? {
          name: machine.name,
          code: machine.code,
          location: machine.location,
        }
      : null,
    assignedTo: assignedTo ? { name: assignedTo.name } : null,
    createdAt: wo.createdAt.toISOString(),
  };

  return (
    <WoDetailClient
      workOrder={serialized}
      tenantSlug={tenantSlug}
      userRole={role}
    />
  );
}
