'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { css } from '../../../../../styled-system/css';
import { AdProvider, AdBanner } from '@manuraj/ads';

// Simple SVG icons for mobile nav
const Icons = {
  home: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  clipboard: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  ),
  plus: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  settings: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  logout: (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2',
        color: isActive ? 'brand.600' : 'gray.500',
        textDecoration: 'none',
        transition: 'color 0.2s',
        _hover: { color: 'brand.600' },
      })}
    >
      {icon}
      <span className={css({ fontSize: 'xs', marginTop: '1' })}>{label}</span>
    </Link>
  );
}

interface TorqueLayoutClientProps {
  children: ReactNode;
  tenant: {
    id: string;
    name: string;
    slug: string;
    adsEnabled: boolean;
    adUnitIds: string[];
  };
  userName: string;
}

export function TorqueLayoutClient({ children, tenant, userName }: TorqueLayoutClientProps) {
  const pathname = usePathname();
  const basePath = `/t/${tenant.slug}`;

  const adConfig = {
    enabled: tenant.adsEnabled,
    publisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID,
    adUnitIds: tenant.adUnitIds,
  };

  const navItems = [
    { href: basePath, icon: Icons.home, label: 'Início' },
    { href: `${basePath}/minhas-os`, icon: Icons.clipboard, label: 'Minhas OS' },
    { href: `${basePath}/nova-solicitacao`, icon: Icons.plus, label: 'Nova OS' },
    { href: `${basePath}/config`, icon: Icons.settings, label: 'Config' },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <AdProvider config={adConfig}>
      <div className={css({
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      })}>
        {/* Top header with name and logout */}
        <header className={css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '3',
          paddingX: '4',
          backgroundColor: 'brand.600',
          color: 'white',
        })}>
          <div>
            <p className={css({ fontSize: 'sm', fontWeight: 'bold' })}>manuRaj</p>
            <p className={css({ fontSize: 'xs', opacity: 0.8 })}>{userName} • {tenant.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className={css({
              padding: '2',
              color: 'white',
              opacity: 0.8,
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              _hover: { opacity: 1 },
            })}
          >
            {Icons.logout}
          </button>
        </header>

        {/* Ad banner - top of content */}
        {tenant.adsEnabled && (
          <div className={css({ padding: '2', backgroundColor: 'gray.50' })}>
            <AdBanner
              adSlot={tenant.adUnitIds?.[0]}
              format="auto"
              testMode={!process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}
            />
          </div>
        )}

        {/* Main content */}
        <main className={css({
          flex: 1,
          paddingBottom: '80px',
          overflowY: 'auto',
        })}>
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className={css({
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderTop: '1px solid',
          borderColor: 'gray.200',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingY: '2',
          paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
          zIndex: 50,
        })}>
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
      </div>
    </AdProvider>
  );
}
