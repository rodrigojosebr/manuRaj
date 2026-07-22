'use client';

import { useState, useEffect, useMemo, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
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
      toggleSection(key);
    } else if (!sidebarExpanded) {
      setSidebarExpanded(true);
      setExpandedSections((prev) => new Set(prev).add(key));
    } else {
      toggleSection(key);
    }
  };

  // True when sidebar shows full width (expanded desktop or mobile overlay)
  const isFullWidth = sidebarExpanded || mobileOpen;

  const roleDisplayName = ROLE_DISPLAY_NAMES[userRole as UserRole] || userRole;

  return (
    <AdProvider config={adConfig}>
      <S.LayoutContainer>
        {/* Mobile header */}
        <S.MobileHeader>
          <S.MobileMenuButton onClick={() => setMobileOpen(true)}>
            <Icon icon="menu" size="lg" />
          </S.MobileMenuButton>
          <S.MobileTitle>manuRaj</S.MobileTitle>
        </S.MobileHeader>

        {/* Backdrop (mobile overlay) */}
        {mobileOpen && <S.Backdrop onClick={closeMobile} />}

        {/* Sidebar */}
        <S.Sidebar mobileOpen={mobileOpen} expanded={sidebarExpanded}>
          {/* Sidebar header */}
          <S.SidebarHeader>
            <S.DesktopToggle onClick={toggleSidebar}>
              <Icon icon={sidebarExpanded ? 'chevron-left' : 'menu'} size="lg" />
            </S.DesktopToggle>
            <S.MobileCloseButton onClick={closeMobile}>
              <Icon icon="chevron-left" size="lg" />
            </S.MobileCloseButton>
            {isFullWidth && (
              <S.BrandBlock>
                <S.BrandTitle>manuRaj</S.BrandTitle>
                <S.BrandSubtitle>{userName} &bull; {tenant.name}</S.BrandSubtitle>
              </S.BrandBlock>
            )}
          </S.SidebarHeader>

          {/* Navigation items */}
          <S.SidebarNav>
            {navStructure.map((entry) => {
              if (entry.type === 'item') {
                const isActive = pathname === entry.href;
                return (
                  <S.SidebarItem
                    key={entry.href}
                    href={entry.href}
                    active={isActive}
                    onClick={closeMobile}
                    title={!isFullWidth ? entry.label : undefined}
                  >
                    <S.SidebarItemIcon><Icon icon={entry.icon} size="lg" /></S.SidebarItemIcon>
                    {isFullWidth && <S.SidebarItemLabel>{entry.label}</S.SidebarItemLabel>}
                  </S.SidebarItem>
                );
              }

              const isSectionExpanded = expandedSections.has(entry.key);
              const hasActiveChild = entry.children.some(
                (child) => pathname === child.href || pathname.startsWith(child.href + '/')
              );

              return (
                <div key={entry.key}>
                  <S.SectionHeaderButton
                    hasActiveChild={hasActiveChild}
                    onClick={() => handleSectionClick(entry.key)}
                    title={!isFullWidth ? entry.label : undefined}
                  >
                    <S.SidebarItemIcon><Icon icon={entry.icon} size="lg" /></S.SidebarItemIcon>
                    {isFullWidth && (
                      <>
                        <S.SidebarItemLabel>{entry.label}</S.SidebarItemLabel>
                        <S.SectionChevron open={isSectionExpanded}>
                          <Icon icon="chevron-right" size="sm" />
                        </S.SectionChevron>
                      </>
                    )}
                  </S.SectionHeaderButton>
                  {isSectionExpanded && (sidebarExpanded || mobileOpen) && (
                    <S.SectionChildren>
                      {entry.children.map((child) => {
                        const isActive = pathname === child.href || pathname.startsWith(child.href + '/');
                        return (
                          <S.SectionChildItem
                            key={child.href}
                            href={child.href}
                            active={isActive}
                            onClick={closeMobile}
                          >
                            {child.label}
                          </S.SectionChildItem>
                        );
                      })}
                    </S.SectionChildren>
                  )}
                </div>
              );
            })}
          </S.SidebarNav>

          {/* Sidebar footer — user info + logout */}
          <S.SidebarFooter>
            <S.UserBlock>
              <S.UserAvatar>
                {userName.charAt(0).toUpperCase()}
              </S.UserAvatar>
              {isFullWidth && (
                <S.UserTextBlock>
                  <S.UserName>{userName}</S.UserName>
                  <S.UserRole>{roleDisplayName}</S.UserRole>
                </S.UserTextBlock>
              )}
            </S.UserBlock>
            <S.LogoutButton onClick={handleLogout} title={!isFullWidth ? 'Sair' : undefined}>
              <S.LogoutIcon><Icon icon="logout" size="lg" /></S.LogoutIcon>
              {isFullWidth && <span>Sair</span>}
            </S.LogoutButton>
          </S.SidebarFooter>
        </S.Sidebar>

        {/* Main content */}
        <S.MainContent>
          {tenant.adsEnabled && (
            <S.AdBannerWrap>
              <AdBanner
                adSlot={tenant.adUnitIds?.[0]}
                format="auto"
                testMode={!process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}
              />
            </S.AdBannerWrap>
          )}
          {children}
        </S.MainContent>
      </S.LayoutContainer>
    </AdProvider>
  );
}
