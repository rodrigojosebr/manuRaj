import { redirect } from 'next/navigation';
import { auth } from '@manuraj/auth';
import { connectDB, tenantRepository } from '@manuraj/data-access';
import { TenantLayoutClient } from './TenantLayoutClient';

interface TenantLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tenantSlug: string }>;
}

export default async function TenantLayout({ children, params }: TenantLayoutProps) {
  const { tenantSlug } = await params;
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login');
  }

  // Verify user belongs to this tenant (or is super_admin)
  if (session.user.role !== 'super_admin' && session.user.tenantSlug !== tenantSlug) {
    redirect(`/t/${session.user.tenantSlug}`);
  }

  // Fetch tenant data for ads config
  await connectDB();
  const tenant = await tenantRepository.findBySlug(tenantSlug);

  if (!tenant || !tenant.active) {
    redirect('/login');
  }

  const tenantConfig = {
    id: tenant._id.toString(),
    name: tenant.name,
    slug: tenant.slug,
    adsEnabled: tenant.adsEnabled,
    adUnitIds: tenant.adUnitIds || [],
  };

  return (
    <TenantLayoutClient
      user={session.user}
      tenant={tenantConfig}
    >
      {children}
    </TenantLayoutClient>
  );
}
