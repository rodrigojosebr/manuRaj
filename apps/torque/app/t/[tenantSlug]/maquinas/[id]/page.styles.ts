import { css } from '../../../../../../../styled-system/css';

// ─── Page Wrapper ──────────────────────────────────────────────────────────
export const wrapper = css({
  padding: 'page',
});

// ─── Back Link ─────────────────────────────────────────────────────────────
export const backLink = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1',
  color: 'brand.600',
  fontSize: 'sm',
  fontWeight: 'medium',
  textDecoration: 'none',
  marginBottom: 'section',
  cursor: 'pointer',
  _hover: { color: 'brand.700' },
});

// ─── Header ────────────────────────────────────────────────────────────────
export const header = css({
  marginBottom: 'section',
});

export const machineTitle = css({
  fontSize: 'lg',
  fontWeight: 'bold',
  color: 'gray.800',
  marginBottom: '2',
});

export const badges = css({
  display: 'flex',
  gap: '2',
  flexWrap: 'wrap',
});

// ─── Sections ──────────────────────────────────────────────────────────────
export const section = css({
  backgroundColor: 'white',
  borderRadius: 'xl',
  padding: 'card-padding',
  boxShadow: 'sm',
  marginBottom: 'card-gap',
});

export const sectionTitle = css({
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'gray.500',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '3',
});

// ─── Info Grid ─────────────────────────────────────────────────────────────
export const infoGrid = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
});

export const infoRow = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '3',
});

export const infoIcon = css({
  fontSize: 'md',
  flexShrink: 0,
  width: '5',
  textAlign: 'center',
});

export const infoContent = css({
  flex: 1,
});

export const infoLabel = css({
  fontSize: 'xs',
  color: 'gray.500',
  fontWeight: 'medium',
});

export const infoValue = css({
  fontSize: 'sm',
  color: 'gray.800',
  fontWeight: 'medium',
});

// ─── WO List ───────────────────────────────────────────────────────────────
export const woList = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'card-gap',
});

export const woCardLink = css({
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
});

export const woCard = (status: string) => {
  const colorMap: Record<string, string> = {
    assigned: 'brand.500',
    in_progress: 'orange.500',
    completed: 'green.500',
    open: 'blue.500',
  };
  const borderColor = colorMap[status] || 'gray.300';

  return css({
    backgroundColor: 'gray.50',
    borderRadius: 'lg',
    padding: '3',
    borderLeft: '4px solid',
    borderLeftColor: borderColor,
    cursor: 'pointer',
    transition: 'box-shadow 0.2s, transform 0.1s',
    _hover: { boxShadow: 'sm' },
    _active: { transform: 'scale(0.98)' },
  });
};

export const woDescription = css({
  fontSize: 'sm',
  color: 'gray.600',
  marginBottom: '2',
});

export const woBadges = css({
  display: 'flex',
  gap: '2',
  flexWrap: 'wrap',
});

export const woMeta = css({
  fontSize: 'xs',
  color: 'gray.500',
  marginTop: '2',
});

// ─── Empty State ───────────────────────────────────────────────────────────
export const emptyMessage = css({
  fontSize: 'sm',
  color: 'gray.400',
  textAlign: 'center',
  padding: '6',
});
