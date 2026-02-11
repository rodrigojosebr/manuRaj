import { css } from '../../../../../../styled-system/css';

// ─── Page Wrapper ──────────────────────────────────────────────────────────
export const wrapper = css({
  padding: 'page',
});

// ─── Page Header ───────────────────────────────────────────────────────────
export const pageHeader = css({
  marginBottom: 'section',
});

export const subtitle = css({
  color: 'gray.500',
  fontSize: 'sm',
  marginTop: '1',
});

// ─── Tabs ──────────────────────────────────────────────────────────────────
export const tabsContainer = css({
  display: 'flex',
  gap: '2',
  overflowX: 'auto',
  marginBottom: 'section',
  paddingBottom: '2',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
});

export const tab = (isActive: boolean) =>
  css({
    flexShrink: 0,
    padding: '2',
    paddingX: '4',
    borderRadius: 'full',
    fontSize: 'sm',
    fontWeight: 'medium',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
    backgroundColor: isActive ? 'brand.600' : 'gray.100',
    color: isActive ? 'white' : 'gray.600',
  });

// ─── Card List ─────────────────────────────────────────────────────────────
export const cardList = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'card-gap',
});

// ─── Machine Card (internal styles) ────────────────────────────────────────
export const machineHeader = css({
  display: 'flex',
  gap: '2',
  alignItems: 'center',
  marginBottom: '1',
});

export const machineName = css({
  fontWeight: 'semibold',
  color: 'gray.900',
});

export const machineCode = css({
  fontSize: 'sm',
  color: 'gray.500',
  marginBottom: '2',
});

export const machineDetail = css({
  fontSize: 'sm',
  color: 'gray.600',
  marginBottom: '1',
});

export const machineBadgeRow = css({
  marginTop: '2',
});
