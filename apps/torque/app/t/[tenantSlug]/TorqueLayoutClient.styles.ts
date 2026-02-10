import { css } from '../../../../../styled-system/css';

// ─── Layout ─────────────────────────────────────────────────────────────────
export const layoutContainer = css({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
});

// ─── Header ─────────────────────────────────────────────────────────────────
export const header = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingY: '5',
  paddingX: 'page',
  backgroundColor: 'brand.600',
  color: 'white',
});

export const headerTitle = css({
  fontSize: 'md',
  fontWeight: 'bold',
});

export const headerSubtitle = css({
  fontSize: 'sm',
  opacity: 0.8,
  marginTop: '0.5',
});

export const logoutButton = css({
  padding: '3',
  color: 'white',
  opacity: 0.8,
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  _hover: { opacity: 1 },
});

// ─── Ad Banner ──────────────────────────────────────────────────────────────
export const adBannerWrap = css({
  padding: '3',
  backgroundColor: 'gray.50',
});

// ─── Main Content ───────────────────────────────────────────────────────────
export const mainContent = css({
  flex: 1,
  paddingBottom: '120px',
  overflowY: 'auto',
});

// ─── Bottom Nav ─────────────────────────────────────────────────────────────
export const bottomNav = css({
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
  paddingY: '4',
  paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
  zIndex: 50,
});

export const navItem = (isActive: boolean) =>
  css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3',
    minWidth: '16',
    color: isActive ? 'brand.600' : 'gray.500',
    textDecoration: 'none',
    transition: 'color 0.2s',
    _hover: { color: 'brand.600' },
  });

export const navItemLabel = css({
  fontSize: 'xs',
  marginTop: '2',
});
