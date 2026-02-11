import { redirect } from 'next/navigation';
import { auth } from '@manuraj/auth';
import { connectDB, machineRepository } from '@manuraj/data-access';
import { MaquinasClient } from './MaquinasClient';

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
}

export default async function MaquinasPage({ params }: PageProps) {
  const { tenantSlug } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const { tenantId } = session.user;

  await connectDB();

  const { machines } = await machineRepository.findByTenant(tenantId, {
    limit: 200,
  });

  // Serialize for client component (ObjectId → string)
  const serialized = machines.map((m) => ({
    _id: String(m._id),
    name: m.name,
    code: m.code,
    location: m.location || '',
    manufacturer: m.manufacturer || '',
    model: (m as unknown as { model: string }).model || '',
    serial: m.serial || '',
    status: m.status,
  }));

  return (
    <MaquinasClient
      machines={serialized}
      tenantSlug={tenantSlug}
    />
  );
}
