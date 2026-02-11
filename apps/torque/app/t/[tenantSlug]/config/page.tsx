import { redirect } from 'next/navigation';
import { auth } from '@manuraj/auth';
import { connectDB, userRepository } from '@manuraj/data-access';
import { ConfigClient } from './ConfigClient';

interface PageProps {
  params: Promise<{ tenantSlug: string }>;
}

export default async function ConfigPage({ params }: PageProps) {
  const { tenantSlug } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const { tenantId, id: userId } = session.user;

  await connectDB();

  const user = await userRepository.findById(tenantId, userId);

  if (!user) {
    redirect('/login');
  }

  const serialized = {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: (user as unknown as { createdAt: Date }).createdAt?.toISOString() || '',
  };

  return (
    <ConfigClient
      user={serialized}
      tenantSlug={tenantSlug}
    />
  );
}
