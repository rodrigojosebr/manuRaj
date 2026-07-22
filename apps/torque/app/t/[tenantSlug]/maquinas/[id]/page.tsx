import { redirect } from 'next/navigation';
import { auth } from '@manuraj/auth';
import { connectDB, machineRepository, workOrderRepository } from '@manuraj/data-access';
import { MachineDetailClient, type SerializedMachineDetail, type SerializedMachineWO } from './MachineDetailClient';

interface PageProps {
  params: Promise<{ tenantSlug: string; id: string }>;
}

export default async function MachineDetailPage({ params }: PageProps) {
  const { tenantSlug, id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const { tenantId } = session.user;

  await connectDB();

  const machine = await machineRepository.findById(tenantId, id);

  if (!machine) {
    redirect(`/t/${tenantSlug}/maquinas`);
  }

  // Fetch recent WOs for this machine
  const { workOrders } = await workOrderRepository.findByTenant(tenantId, {
    machineId: id,
    limit: 5,
  });

  // Serialize machine
  const serializedMachine: SerializedMachineDetail = {
    _id: String(machine._id),
    name: machine.name,
    code: machine.code,
    location: machine.location || '',
    manufacturer: machine.manufacturer || '',
    model: (machine as unknown as { model: string }).model || '',
    serial: machine.serial || '',
    status: machine.status,
  };

  // Serialize WOs
  const serializedWOs: SerializedMachineWO[] = workOrders.map((wo) => {
    const woMachine = wo.machineId as unknown as { name: string; code: string } | null;
    return {
      _id: String(wo._id),
      type: wo.type,
      status: wo.status,
      priority: wo.priority,
      description: wo.description,
      dueDate: wo.dueDate ? wo.dueDate.toISOString() : null,
      machine: woMachine ? { name: woMachine.name, code: woMachine.code } : null,
    };
  });

  return (
    <MachineDetailClient
      machine={serializedMachine}
      workOrders={serializedWOs}
      tenantSlug={tenantSlug}
    />
  );
}
