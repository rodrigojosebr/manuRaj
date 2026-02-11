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
  /* Hide scrollbar on mobile but keep scrollable */
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

export const cardLink = css({
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
});

// ─── Work Order Card ───────────────────────────────────────────────────────
const borderColorMap: Record<string, string> = {
  open: '#3b82f6',       // blue-500
  assigned: '#059669',   // brand.600 (green)
  in_progress: '#f59e0b', // warning
  completed: '#22c55e',   // success
  cancelled: '#9ca3af',   // gray-400
};

export const card = (status: string) =>
  css({
    backgroundColor: 'white',
    borderRadius: 'xl',
    padding: 'card-padding',
    boxShadow: 'sm',
    position: 'relative',
    borderLeft: '4px solid',
    borderLeftColor: borderColorMap[status] || '#e5e7eb',
    transition: 'box-shadow 0.2s, transform 0.1s',
    _hover: { boxShadow: 'md' },
    _active: { transform: 'scale(0.98)' },
  });

export const cardOverdue = css({
  borderLeftColor: '#ef4444 !important',
});

export const cardMachine = css({
  display: 'flex',
  gap: '2',
  alignItems: 'center',
  marginBottom: '2',
});

export const cardMachineIcon = css({
  fontSize: 'lg',
});

export const cardMachineText = css({
  fontWeight: 'semibold',
  color: 'gray.700',
  fontSize: 'sm',
});

export const cardDescription = css({
  color: 'gray.600',
  fontSize: 'sm',
  marginBottom: '3',
  lineHeight: '1.5',
});

export const cardBadges = css({
  display: 'flex',
  gap: '2',
  flexWrap: 'wrap',
  marginBottom: '3',
});

export const cardMeta = css({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 'xs',
  color: 'gray.500',
  marginBottom: '3',
});

export const overdueIndicator = css({
  color: 'red.600',
  fontWeight: 'semibold',
});

export const statusBar = (status: string) => {
  const bgMap: Record<string, string> = {
    open: 'blue.50',
    assigned: 'brand.50',
    in_progress: 'orange.50',
    completed: 'green.50',
    cancelled: 'gray.100',
  };

  const textMap: Record<string, string> = {
    open: 'blue.700',
    assigned: 'brand.700',
    in_progress: 'orange.700',
    completed: 'green.700',
    cancelled: 'gray.500',
  };

  return css({
    padding: '3',
    borderRadius: 'lg',
    textAlign: 'center',
    fontWeight: 'medium',
    fontSize: 'sm',
    backgroundColor: bgMap[status] || 'gray.100',
    color: textMap[status] || 'gray.500',
  });
};
