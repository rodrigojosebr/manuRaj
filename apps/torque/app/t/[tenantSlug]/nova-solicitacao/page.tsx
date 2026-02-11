import { redirect } from 'next/navigation';
import { auth } from '@manuraj/auth';
import { connectDB, machineRepository } from '@manuraj/data-access';
import { NovaSolicitacaoClient } from './NovaSolicitacaoClient';

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
}

export default async function NovaSolicitacaoPage({ params }: PageProps) {
  const { tenantSlug } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const { tenantId } = session.user;

  await connectDB();

  const { machines } = await machineRepository.findByTenant(tenantId, { limit: 200 });

  // Filter out decommissioned machines and serialize for client
  const serialized = machines
    .filter((m) => m.status !== 'decommissioned')
    .map((m) => ({
      _id: String(m._id),
      name: m.name,
      code: m.code,
      location: m.location || '',
      status: m.status,
    }));

  return (
    <NovaSolicitacaoClient
      machines={serialized}
      tenantSlug={tenantSlug}
    />
  );
}
