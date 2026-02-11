import { css } from '../../../../../styled-system/css';

// ─── Layout Container ──────────────────────────────────────────────────────
export const layoutContainer = css({
  display: 'flex',
  minHeight: '100vh',
});

// ─── Mobile Header (visible < md) ──────────────────────────────────────────
export const mobileHeader = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
  padding: '3 4',
  backgroundColor: 'brand.600',
  color: 'white',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 30,
  height: '56px',
  md: { display: 'none' },
});

export const mobileMenuButton = css({
  background: 'none',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  padding: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const mobileTitle = css({
  fontSize: 'md',
  fontWeight: 'bold',
});

// ─── Backdrop (mobile overlay) ─────────────────────────────────────────────
export const backdrop = css({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  zIndex: 40,
  md: { display: 'none' },
});

// ─── Sidebar ───────────────────────────────────────────────────────────────
export const sidebar = (expanded: boolean, mobileOpen: boolean) =>
  css({
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 50,
    backgroundColor: 'white',
    borderRight: '1px solid',
    borderColor: 'gray.200',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    transition: 'width 0.2s ease, transform 0.2s ease',
    // Mobile: always 240px, slide in/out
    width: '240px',
    transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
    // Desktop: always visible, width controlled by expanded
    md: {
      transform: 'translateX(0)',
      width: expanded ? '240px' : '64px',
    },
  });

// ─── Sidebar Header ────────────────────────────────────────────────────────
export const sidebarHeader = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
  padding: '4 5',
  borderBottom: '1px solid',
  borderColor: 'gray.100',
  minHeight: '56px',
});

export const desktopToggle = css({
  display: 'none',
  md: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    color: 'gray.500',
    cursor: 'pointer',
    padding: '1',
    borderRadius: 'md',
    flexShrink: 0,
    _hover: { backgroundColor: 'gray.100', color: 'gray.700' },
  },
});

export const mobileCloseButton = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  color: 'gray.500',
  cursor: 'pointer',
  padding: '1',
  borderRadius: 'md',
  flexShrink: 0,
  _hover: { backgroundColor: 'gray.100', color: 'gray.700' },
  md: { display: 'none' },
});

export const brandBlock = css({
  overflow: 'hidden',
  flex: 1,
  minWidth: 0,
  whiteSpace: 'nowrap',
});

export const brandTitle = css({
  fontSize: 'md',
  fontWeight: 'bold',
  color: 'gray.900',
});

export const brandSubtitle = css({
  fontSize: 'xs',
  color: 'gray.500',
  marginTop: '0.5',
});

// ─── Sidebar Navigation ───────────────────────────────────────────────────
export const sidebarNav = css({
  flex: 1,
  overflowY: 'auto',
  paddingY: '2',
});

export const sidebarItem = (isActive: boolean) =>
  css({
    display: 'flex',
    alignItems: 'center',
    gap: '3',
    paddingY: '3',
    paddingLeft: '5',
    paddingRight: '3',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    color: isActive ? 'brand.600' : 'gray.600',
    backgroundColor: isActive ? 'brand.50' : 'transparent',
    borderRightWidth: '3px',
    borderRightStyle: 'solid',
    borderRightColor: isActive ? 'brand.600' : 'transparent',
    transition: 'background-color 0.15s, color 0.15s',
    cursor: 'pointer',
    _hover: {
      backgroundColor: isActive ? 'brand.50' : 'gray.50',
      color: isActive ? 'brand.600' : 'gray.900',
    },
  });

export const sidebarItemIcon = css({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '6',
  height: '6',
});

export const sidebarItemLabel = css({
  fontSize: 'sm',
  fontWeight: '500',
});

// ─── Sidebar Footer ───────────────────────────────────────────────────────
export const sidebarFooter = css({
  borderTop: '1px solid',
  borderColor: 'gray.100',
  padding: '4 5',
});

export const userBlock = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
  marginBottom: '3',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
});

export const userAvatar = css({
  flexShrink: 0,
  width: '8',
  height: '8',
  borderRadius: 'full',
  backgroundColor: 'brand.100',
  color: 'brand.700',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 'sm',
  fontWeight: 'bold',
});

export const userTextBlock = css({
  overflow: 'hidden',
  minWidth: 0,
});

export const userName = css({
  fontSize: 'sm',
  fontWeight: '600',
  color: 'gray.900',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const userRole = css({
  fontSize: 'xs',
  color: 'gray.500',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const logoutButton = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
  padding: '2',
  background: 'none',
  border: 'none',
  color: 'gray.500',
  cursor: 'pointer',
  fontSize: 'sm',
  whiteSpace: 'nowrap',
  borderRadius: 'md',
  width: '100%',
  _hover: { color: 'red.600', backgroundColor: 'red.50' },
});

export const logoutIcon = css({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

// ─── Main Content ──────────────────────────────────────────────────────────
export const mainContent = (expanded: boolean) =>
  css({
    flex: 1,
    minHeight: '100vh',
    transition: 'margin-left 0.2s ease',
    // Mobile: full width, top padding for mobile header
    marginLeft: 0,
    paddingTop: '56px',
    // Desktop: offset by sidebar width, no top padding
    md: {
      marginLeft: expanded ? '240px' : '64px',
      paddingTop: 0,
    },
  });

// ─── Ad Banner (mobile only) ──────────────────────────────────────────────
export const adBannerWrap = css({
  padding: '3',
  backgroundColor: 'gray.50',
  md: { display: 'none' },
});
