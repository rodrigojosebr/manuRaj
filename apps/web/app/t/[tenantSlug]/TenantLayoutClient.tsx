'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { css } from '../../../../../styled-system/css';
import { AdProvider, AdRail, AdBanner } from '@manuraj/ads';
import type { SessionUser } from '@manuraj/domain';
import { ROLE_DISPLAY_NAMES, hasPermission, PERMISSIONS } from '@manuraj/domain';

interface TenantLayoutClientProps {
  children: ReactNode;
  user: SessionUser;
  tenant: {
    id: string;
    name: string;
    slug: string;
    adsEnabled: boolean;
    adUnitIds: string[];
  };
}

interface NavItem {
  href: string;
  label: string;
  icon: string;
  permission?: string;
}

export function TenantLayoutClient({ children, user, tenant }: TenantLayoutClientProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const baseUrl = `/t/${tenant.slug}`;

  const navItems: NavItem[] = [
    { href: baseUrl, label: 'Dashboard', icon: '📊' },
    { href: `${baseUrl}/machines`, label: 'Máquinas', icon: '⚙️' },
    { href: `${baseUrl}/work-orders`, label: 'Ordens de Serviço', icon: '📋' },
    { href: `${baseUrl}/preventive-plans`, label: 'Planos Preventivos', icon: '📅', permission: PERMISSIONS.PREVENTIVE_PLANS_READ },
    { href: `${baseUrl}/admin/users`, label: 'Usuários', icon: '👥', permission: PERMISSIONS.USERS_READ },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.permission || hasPermission(user.role, item.permission as Parameters<typeof hasPermission>[1])
  );

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const adConfig = {
    enabled: tenant.adsEnabled,
    publisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID,
    adUnitIds: tenant.adUnitIds,
  };

  return (
    <AdProvider config={adConfig}>
      <div className={css({ display: 'flex', minHeight: '100vh' })}>
        {/* Left Ad Rail - Desktop only */}
        <AdRail
          position="left"
          adSlot={tenant.adUnitIds?.[0]}
          testMode={!process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}
        />

      {/* Sidebar */}
      <aside
        className={css({
          width: '250px',
          backgroundColor: 'white',
          borderRight: '1px solid',
          borderColor: 'gray.200',
          display: { base: sidebarOpen ? 'block' : 'none', md: 'block' },
          position: { base: 'fixed', md: 'sticky' },
          top: 0,
          left: { base: tenant.adsEnabled ? '160px' : '0', lg: '160px' },
          height: '100vh',
          zIndex: 40,
          overflowY: 'auto',
        })}
      >
        {/* Logo */}
        <div
          className={css({
            padding: '4',
            borderBottom: '1px solid',
            borderColor: 'gray.200',
          })}
        >
          <Link href={baseUrl} className={css({ textDecoration: 'none' })}>
            <h1 className={css({ fontSize: 'xl', fontWeight: 'bold', color: 'brand.600' })}>
              manuRaj
            </h1>
          </Link>
          <p className={css({ fontSize: 'sm', color: 'gray.600', marginTop: '1' })}>
            {tenant.name}
          </p>
        </div>

        {/* Navigation */}
        <nav className={css({ padding: '2' })}>
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== baseUrl && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3',
                  padding: '3',
                  borderRadius: 'md',
                  marginBottom: '1',
                  textDecoration: 'none',
                  color: isActive ? 'brand.700' : 'gray.700',
                  backgroundColor: isActive ? 'brand.50' : 'transparent',
                  fontWeight: isActive ? 'medium' : 'normal',
                  _hover: {
                    backgroundColor: isActive ? 'brand.50' : 'gray.100',
                  },
                })}
                onClick={() => setSidebarOpen(false)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div
          className={css({
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '4',
            borderTop: '1px solid',
            borderColor: 'gray.200',
            backgroundColor: 'white',
          })}
        >
          <div className={css({ marginBottom: '2' })}>
            <p className={css({ fontWeight: 'medium', color: 'gray.900' })}>{user.name}</p>
            <p className={css({ fontSize: 'sm', color: 'gray.500' })}>
              {ROLE_DISPLAY_NAMES[user.role]}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className={css({
              width: '100%',
              padding: '2',
              borderRadius: 'md',
              border: '1px solid',
              borderColor: 'gray.300',
              backgroundColor: 'white',
              color: 'gray.700',
              fontSize: 'sm',
              cursor: 'pointer',
              _hover: {
                backgroundColor: 'gray.100',
              },
            })}
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className={css({ flex: 1, display: 'flex', flexDirection: 'column' })}>
        {/* Mobile header */}
        <header
          className={css({
            display: { base: 'flex', md: 'none' },
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4',
            backgroundColor: 'white',
            borderBottom: '1px solid',
            borderColor: 'gray.200',
          })}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={css({
              padding: '2',
              borderRadius: 'md',
              _hover: { backgroundColor: 'gray.100' },
            })}
          >
            ☰
          </button>
          <span className={css({ fontWeight: 'bold', color: 'brand.600' })}>manuRaj</span>
          <div className={css({ width: '32px' })} />
        </header>

        {/* Mobile ad banner */}
        {tenant.adsEnabled && (
          <div className={css({ display: { base: 'block', lg: 'none' }, padding: '2' })}>
            <AdBanner
              adSlot={tenant.adUnitIds?.[1]}
              format="auto"
              testMode={!process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}
            />
          </div>
        )}

        {/* Page content */}
        <main
          className={css({
            flex: 1,
            padding: '6',
            backgroundColor: 'gray.50',
            overflowY: 'auto',
          })}
        >
          {children}
        </main>
      </div>

        {/* Right Ad Rail - Desktop only */}
        <AdRail
          position="right"
          adSlot={tenant.adUnitIds?.[2]}
          testMode={!process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}
        />

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className={css({
              display: { base: 'block', md: 'none' },
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 30,
            })}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </AdProvider>
  );
}
