import { redirect } from 'next/navigation';
import { auth } from '@manuraj/auth';
import { connectDB, workOrderRepository } from '@manuraj/data-access';
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

  const { tenantId, name: userName } = session.user;

  await connectDB();

  const [assignedOpen, inProgress, overdue] = await Promise.all([
    workOrderRepository.countAssignedByStatus(tenantId, session.user.id, 'assigned'),
    workOrderRepository.countAssignedByStatus(tenantId, session.user.id, 'in_progress'),
    workOrderRepository.countOverdueByAssignee(tenantId, session.user.id),
  ]);

  return (
    <TorqueDashboardClient
      userName={userName || 'Usuário'}
      tenantSlug={tenantSlug}
      stats={{ assignedOpen, inProgress, overdue }}
    />
  );
}
