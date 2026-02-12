'use client';

import { useState, useEffect, useMemo, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { AdProvider, AdBanner } from '@manuraj/ads';
import { ROLE_DISPLAY_NAMES } from '@manuraj/domain';
import type { UserRole } from '@manuraj/domain';
import * as S from './TorqueLayoutClient.styles';

// SVG Icons (24x24, Feather-style)
const Icons = {
  home: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  clipboard: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  ),
  plusCircle: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  gear: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  wrench: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  logout: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  menu: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  chevronLeft: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  chevronRight: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  user: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

// Nav structure types
interface NavItem {
  type: 'item';
  href: string;
  icon: ReactNode;
  label: string;
}

interface NavSection {
  type: 'section';
  key: string;
  icon: ReactNode;
  label: string;
  children: { href: string; label: string }[];
}

type NavEntry = NavItem | NavSection;

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
  userRole: string;
}

export function TorqueLayoutClient({ children, tenant, userName, userRole }: TorqueLayoutClientProps) {
  const pathname = usePathname();
  const basePath = `/t/${tenant.slug}`;

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const adConfig = {
    enabled: tenant.adsEnabled,
    publisherId: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID,
    adUnitIds: tenant.adUnitIds,
  };

  const navStructure = useMemo<NavEntry[]>(() => [
    { type: 'item', href: basePath, icon: Icons.home, label: 'Inicio' },
    {
      type: 'section', key: 'manutencao', icon: Icons.clipboard, label: 'Manutenção',
      children: [
        { href: `${basePath}/minhas-os`, label: 'Minhas OS' },
        { href: `${basePath}/nova-solicitacao`, label: 'Nova Solicitação' },
      ],
    },
    {
      type: 'section', key: 'equipamentos', icon: Icons.gear, label: 'Equipamentos',
      children: [
        { href: `${basePath}/maquinas`, label: 'Máquinas' },
      ],
    },
    {
      type: 'section', key: 'meus-dados', icon: Icons.user, label: 'Meus Dados',
      children: [
        { href: `${basePath}/config`, label: 'Configurações' },
      ],
    },
  ], [basePath]);

  // Auto-expand section containing the active route
  useEffect(() => {
    for (const entry of navStructure) {
      if (entry.type === 'section') {
        const hasActiveChild = entry.children.some(
          (child) => pathname === child.href || pathname.startsWith(child.href + '/')
        );
        if (hasActiveChild) {
          setExpandedSections((prev) => {
            if (prev.has(entry.key)) return prev;
            return new Set(prev).add(entry.key);
          });
          break;
        }
      }
    }
  }, [pathname, navStructure]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const toggleSidebar = () => setSidebarExpanded((prev) => !prev);
  const closeMobile = () => setMobileOpen(false);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSectionClick = (key: string) => {
    if (mobileOpen) {
      // Mobile: just toggle section
      toggleSection(key);
    } else if (!sidebarExpanded) {
      // Desktop collapsed: expand sidebar and open section
      setSidebarExpanded(true);
      setExpandedSections((prev) => new Set(prev).add(key));
    } else {
      // Desktop expanded: toggle section
      toggleSection(key);
    }
  };

  // True when sidebar shows full width (expanded desktop or mobile overlay)
  const isFullWidth = sidebarExpanded || mobileOpen;

  const roleDisplayName = ROLE_DISPLAY_NAMES[userRole as UserRole] || userRole;

  return (
    <AdProvider config={adConfig}>
      <div className={S.layoutContainer}>
        {/* Mobile header */}
        <header className={S.mobileHeader}>
          <button onClick={() => setMobileOpen(true)} className={S.mobileMenuButton}>
            {Icons.menu}
          </button>
          <span className={S.mobileTitle}>manuRaj</span>
        </header>

        {/* Backdrop (mobile overlay) */}
        {mobileOpen && <div className={S.backdrop} onClick={closeMobile} />}

        {/* Sidebar */}
        <aside className={S.sidebar(sidebarExpanded, mobileOpen)}>
          {/* Sidebar header */}
          <div className={S.sidebarHeader}>
            {/* Desktop toggle: menu when collapsed, chevron when expanded */}
            <button onClick={toggleSidebar} className={S.desktopToggle}>
              {sidebarExpanded ? Icons.chevronLeft : Icons.menu}
            </button>
            {/* Mobile close */}
            <button onClick={closeMobile} className={S.mobileCloseButton}>
              {Icons.chevronLeft}
            </button>
            {/* Brand text — visible only when sidebar is expanded */}
            {isFullWidth && (
              <div className={S.brandBlock}>
                <p className={S.brandTitle}>manuRaj</p>
                <p className={S.brandSubtitle}>{userName} &bull; {tenant.name}</p>
              </div>
            )}
          </div>

          {/* Navigation items */}
          <nav className={S.sidebarNav}>
            {navStructure.map((entry) => {
              if (entry.type === 'item') {
                const isActive = pathname === entry.href;
                return (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    className={S.sidebarItem(isActive)}
                    onClick={closeMobile}
                    title={!isFullWidth ? entry.label : undefined}
                  >
                    <span className={S.sidebarItemIcon}>{entry.icon}</span>
                    {isFullWidth && <span className={S.sidebarItemLabel}>{entry.label}</span>}
                  </Link>
                );
              }

              const isSectionExpanded = expandedSections.has(entry.key);
              const hasActiveChild = entry.children.some(
                (child) => pathname === child.href || pathname.startsWith(child.href + '/')
              );

              return (
                <div key={entry.key}>
                  <button
                    className={S.sectionHeader(hasActiveChild)}
                    onClick={() => handleSectionClick(entry.key)}
                    title={!isFullWidth ? entry.label : undefined}
                  >
                    <span className={S.sidebarItemIcon}>{entry.icon}</span>
                    {isFullWidth && (
                      <>
                        <span className={S.sidebarItemLabel}>{entry.label}</span>
                        <span className={S.sectionChevron(isSectionExpanded)}>
                          {Icons.chevronRight}
                        </span>
                      </>
                    )}
                  </button>
                  {isSectionExpanded && (sidebarExpanded || mobileOpen) && (
                    <div className={S.sectionChildren}>
                      {entry.children.map((child) => {
                        const isActive = pathname === child.href || pathname.startsWith(child.href + '/');
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={S.sectionChildItem(isActive)}
                            onClick={closeMobile}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Sidebar footer — user info + logout */}
          <div className={S.sidebarFooter}>
            <div className={S.userBlock}>
              <span className={S.userAvatar}>
                {userName.charAt(0).toUpperCase()}
              </span>
              {isFullWidth && (
                <div className={S.userTextBlock}>
                  <p className={S.userName}>{userName}</p>
                  <p className={S.userRole}>{roleDisplayName}</p>
                </div>
              )}
            </div>
            <button onClick={handleLogout} className={S.logoutButton} title={!isFullWidth ? 'Sair' : undefined}>
              <span className={S.logoutIcon}>{Icons.logout}</span>
              {isFullWidth && <span>Sair</span>}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className={S.mainContent}>
          {tenant.adsEnabled && (
            <div className={S.adBannerWrap}>
              <AdBanner
                adSlot={tenant.adUnitIds?.[0]}
                format="auto"
                testMode={!process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}
              />
            </div>
          )}
          {children}
        </main>
      </div>
    </AdProvider>
  );
}
