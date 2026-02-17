import Link from 'next/link';
import { styled } from '../../../../../styled-system/jsx';
import { cva } from '../../../../../styled-system/css';

// ─── Layout Container ──────────────────────────────────────────────────────
export const LayoutContainer = styled('div', {
  base: { display: 'flex', minHeight: '100vh' },
});

// ─── Mobile Header (visible < md) ──────────────────────────────────────────
export const MobileHeader = styled('div', {
  base: {
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
  },
});

export const MobileMenuButton = styled('button', {
  base: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const MobileTitle = styled('span', {
  base: { fontSize: 'md', fontWeight: 'bold' },
});

// ─── Backdrop (mobile overlay) ─────────────────────────────────────────────
export const Backdrop = styled('div', {
  base: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 40,
    md: { display: 'none' },
  },
});

// ─── Sidebar ───────────────────────────────────────────────────────────────
export const Sidebar = styled('aside', cva({
  base: {
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
    width: '240px',
    md: {
      position: 'sticky',
      height: '100vh',
      zIndex: 1,
      flexShrink: 0,
    },
  },
  variants: {
    mobileOpen: {
      true: { transform: { base: 'translateX(0)', md: 'none' } },
      false: { transform: { base: 'translateX(-100%)', md: 'none' } },
    },
    expanded: {
      true: { md: { width: '240px' } },
      false: { md: { width: '64px' } },
    },
  },
  defaultVariants: {
    mobileOpen: false,
    expanded: false,
  },
}));

// ─── Sidebar Header ────────────────────────────────────────────────────────
export const SidebarHeader = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '3',
    padding: '4 5',
    borderBottom: '1px solid',
    borderColor: 'gray.100',
    minHeight: '56px',
  },
});

export const DesktopToggle = styled('button', {
  base: {
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
  },
});

export const MobileCloseButton = styled('button', {
  base: {
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
  },
});

export const BrandBlock = styled('div', {
  base: { overflow: 'hidden', flex: 1, minWidth: 0, whiteSpace: 'nowrap' },
});

export const BrandTitle = styled('span', {
  base: { fontSize: 'md', fontWeight: 'bold', color: 'gray.900' },
});

export const BrandSubtitle = styled('span', {
  base: { fontSize: 'xs', color: 'gray.500', marginTop: '0.5', display: 'block' },
});

// ─── Sidebar Navigation ───────────────────────────────────────────────────
export const SidebarNav = styled('nav', {
  base: { flex: 1, overflowY: 'auto', paddingY: '2' },
});

export const SidebarItem = styled(Link, cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '3',
    paddingY: '3',
    paddingLeft: '5',
    paddingRight: '3',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    transition: 'background-color 0.15s, color 0.15s',
    cursor: 'pointer',
  },
  variants: {
    active: {
      true: {
        color: 'brand.600',
        backgroundColor: 'brand.50',
        borderRightWidth: '3px',
        borderRightStyle: 'solid',
        borderRightColor: 'brand.600',
        _hover: { backgroundColor: 'brand.50', color: 'brand.600' },
      },
      false: {
        color: 'gray.600',
        backgroundColor: 'transparent',
        borderRightWidth: '3px',
        borderRightStyle: 'solid',
        borderRightColor: 'transparent',
        _hover: { backgroundColor: 'gray.50', color: 'gray.900' },
      },
    },
  },
  defaultVariants: { active: false },
}));

export const SidebarItemIcon = styled('span', {
  base: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '6',
    height: '6',
  },
});

export const SidebarItemLabel = styled('span', {
  base: { fontSize: 'sm', fontWeight: '500' },
});

// ─── Section Header (expandable group) ──────────────────────────────────
export const SectionHeaderButton = styled('button', cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '3',
    paddingY: '3',
    paddingLeft: '5',
    paddingRight: '3',
    whiteSpace: 'nowrap',
    width: '100%',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 'sm',
    fontWeight: '500',
    transition: 'background-color 0.15s, color 0.15s',
    _hover: { backgroundColor: 'gray.50' },
  },
  variants: {
    hasActiveChild: {
      true: {
        color: 'brand.600',
        _hover: { color: 'brand.600' },
      },
      false: {
        color: 'gray.600',
        _hover: { color: 'gray.900' },
      },
    },
  },
  defaultVariants: { hasActiveChild: false },
}));

export const SectionChevron = styled('span', cva({
  base: {
    marginLeft: 'auto',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    transition: 'transform 0.2s ease',
    color: 'gray.400',
    '& svg': { width: '16px', height: '16px' },
  },
  variants: {
    open: {
      true: { transform: 'rotate(90deg)' },
      false: { transform: 'rotate(0deg)' },
    },
  },
  defaultVariants: { open: false },
}));

export const SectionChildren = styled('div', {
  base: { paddingBottom: '1' },
});

export const SectionChildItem = styled(Link, cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    paddingY: '2',
    paddingLeft: '14',
    paddingRight: '3',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    fontSize: 'sm',
    transition: 'background-color 0.15s, color 0.15s',
    cursor: 'pointer',
  },
  variants: {
    active: {
      true: {
        color: 'brand.600',
        backgroundColor: 'brand.50',
        borderRightWidth: '3px',
        borderRightStyle: 'solid',
        borderRightColor: 'brand.600',
        _hover: { backgroundColor: 'brand.50', color: 'brand.600' },
      },
      false: {
        color: 'gray.500',
        backgroundColor: 'transparent',
        borderRightWidth: '3px',
        borderRightStyle: 'solid',
        borderRightColor: 'transparent',
        _hover: { backgroundColor: 'gray.50', color: 'gray.700' },
      },
    },
  },
  defaultVariants: { active: false },
}));

// ─── Sidebar Footer ───────────────────────────────────────────────────────
export const SidebarFooter = styled('div', {
  base: { borderTop: '1px solid', borderColor: 'gray.100', paddingY: '3' },
});

export const UserBlock = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '3',
    marginBottom: '2',
    paddingY: '1',
    paddingLeft: '5',
    paddingRight: '3',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
});

export const UserAvatar = styled('div', {
  base: {
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
  },
});

export const UserTextBlock = styled('div', {
  base: { overflow: 'hidden', minWidth: 0 },
});

export const UserName = styled('p', {
  base: {
    fontSize: 'sm',
    fontWeight: '600',
    color: 'gray.900',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

export const UserRole = styled('p', {
  base: {
    fontSize: 'xs',
    color: 'gray.500',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

export const LogoutButton = styled('button', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '3',
    paddingY: '2',
    paddingLeft: '5',
    paddingRight: '3',
    background: 'none',
    border: 'none',
    color: 'gray.500',
    cursor: 'pointer',
    fontSize: 'sm',
    whiteSpace: 'nowrap',
    borderRadius: 'md',
    width: '100%',
    _hover: { color: 'red.600', backgroundColor: 'red.50' },
  },
});

export const LogoutIcon = styled('span', {
  base: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ─── Main Content ──────────────────────────────────────────────────────────
export const MainContent = styled('main', {
  base: {
    flex: 1,
    minHeight: '100vh',
    minWidth: 0,
    paddingTop: '56px',
    md: { paddingTop: 0 },
  },
});

// ─── Ad Banner (mobile only) ──────────────────────────────────────────────
export const AdBannerWrap = styled('div', {
  base: { padding: '3', backgroundColor: 'gray.50', md: { display: 'none' } },
});
