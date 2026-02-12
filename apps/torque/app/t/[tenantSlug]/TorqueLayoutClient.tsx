'use client';

import { useState, useEffect, useMemo, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Icon } from '@pitkit';
import type { IconName } from '@pitkit';
import { AdProvider, AdBanner } from '@manuraj/ads';
import { ROLE_DISPLAY_NAMES } from '@manuraj/domain';
import type { UserRole } from '@manuraj/domain';
import * as S from './TorqueLayoutClient.styles';

// Nav structure types
interface NavItem {
  type: 'item';
  href: string;
  icon: IconName;
  label: string;
}

interface NavSection {
  type: 'section';
  key: string;
  icon: IconName;
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
    { type: 'item', href: basePath, icon: 'home', label: 'Inicio' },
    {
      type: 'section', key: 'manutencao', icon: 'clipboard', label: 'Manutenção',
      children: [
        { href: `${basePath}/minhas-os`, label: 'Minhas OS' },
        { href: `${basePath}/nova-solicitacao`, label: 'Nova Solicitação' },
      ],
    },
    {
      type: 'section', key: 'equipamentos', icon: 'gear', label: 'Equipamentos',
      children: [
        { href: `${basePath}/maquinas`, label: 'Máquinas' },
      ],
    },
    {
      type: 'section', key: 'meus-dados', icon: 'user', label: 'Meus Dados',
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
            <Icon icon="menu" size="lg" />
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
              <Icon icon={sidebarExpanded ? 'chevron-left' : 'menu'} size="lg" />
            </button>
            {/* Mobile close */}
            <button onClick={closeMobile} className={S.mobileCloseButton}>
              <Icon icon="chevron-left" size="lg" />
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
                    <span className={S.sidebarItemIcon}><Icon icon={entry.icon} size="lg" /></span>
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
                    <span className={S.sidebarItemIcon}><Icon icon={entry.icon} size="lg" /></span>
                    {isFullWidth && (
                      <>
                        <span className={S.sidebarItemLabel}>{entry.label}</span>
                        <span className={S.sectionChevron(isSectionExpanded)}>
                          <Icon icon="chevron-right" size="sm" />
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
              <span className={S.logoutIcon}><Icon icon="logout" size="lg" /></span>
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
