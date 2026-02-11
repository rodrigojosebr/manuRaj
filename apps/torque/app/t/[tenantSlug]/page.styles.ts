import { css } from '../../../../../styled-system/css';

// ─── Wrapper ────────────────────────────────────────────────────────────────
export const wrapper = css({
  padding: 'page',
});

// ─── Greeting ───────────────────────────────────────────────────────────────
export const greetingSection = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1',
  marginBottom: 'section',
  md: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export const greetingLeft = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
  flexWrap: 'wrap',
});

export const greetingDate = css({
  fontSize: 'sm',
  color: 'gray.500',
});

// ─── Section Header ────────────────────────────────────────────────────────
export const sectionHeader = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 'card-gap',
});

export const sectionTitle = css({
  fontSize: 'lg',
  fontWeight: 'semibold',
  color: 'gray.900',
});

export const sectionLink = css({
  fontSize: 'sm',
  color: 'brand.600',
  textDecoration: 'none',
  fontWeight: '500',
  _hover: { textDecoration: 'underline' },
});

// ─── Stats Grid ─────────────────────────────────────────────────────────────
export const statsGrid = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 'card-gap',
  marginBottom: 'section',
  md: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
});

export const statCard = (color: 'brand' | 'success' | 'warning' | 'danger') => {
  const bgMap = {
    brand: 'brand.50',
    success: 'green.50',
    warning: 'orange.50',
    danger: 'red.50',
  } as const;

  return css({
    backgroundColor: bgMap[color],
    borderRadius: 'xl',
    padding: 'card-padding',
  });
};

export const statValue = (color: 'brand' | 'success' | 'warning' | 'danger') => {
  const textMap = {
    brand: 'brand.700',
    success: 'green.700',
    warning: 'orange.700',
    danger: 'red.700',
  } as const;

  return css({
    fontSize: '3xl',
    fontWeight: 'bold',
    color: textMap[color],
  });
};

export const statLabel = css({
  fontSize: 'sm',
  color: 'gray.600',
  marginTop: '2',
});

// ─── Recent WOs ─────────────────────────────────────────────────────────────
export const recentSection = css({
  marginBottom: 'section',
});

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
    backgroundColor: 'white',
    borderRadius: 'xl',
    padding: 'card-padding',
    borderLeft: '4px solid',
    borderLeftColor: borderColor,
    boxShadow: 'sm',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s, transform 0.1s',
    _hover: { boxShadow: 'md' },
    _active: { transform: 'scale(0.98)' },
  });
};

export const woMachine = css({
  fontSize: 'sm',
  fontWeight: '600',
  color: 'gray.900',
  marginBottom: '1',
});

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

// ─── Preventive Plans ───────────────────────────────────────────────────────
export const plansSection = css({
  marginBottom: 'section',
});

export const plansList = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'card-gap',
});

export const planCard = css({
  backgroundColor: 'white',
  borderRadius: 'xl',
  padding: 'card-padding',
  boxShadow: 'sm',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '3',
});

export const planIcon = css({
  fontSize: 'xl',
  flexShrink: 0,
  marginTop: '0.5',
});

export const planInfo = css({
  flex: 1,
  minWidth: 0,
});

export const planName = css({
  fontSize: 'sm',
  fontWeight: '600',
  color: 'gray.900',
});

export const planMeta = css({
  fontSize: 'sm',
  color: 'gray.500',
  marginTop: '1',
});

export const planUrgent = css({
  color: 'orange.600',
  fontWeight: '500',
});

// ─── Quick Actions ──────────────────────────────────────────────────────────
export const actionsGrid = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 'card-gap',
});

export const actionCard = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2',
  padding: 'card-padding',
  backgroundColor: 'white',
  borderRadius: 'xl',
  boxShadow: 'sm',
  textDecoration: 'none',
  textAlign: 'center',
  transition: 'box-shadow 0.2s, transform 0.1s',
  _hover: { boxShadow: 'md' },
  _active: { transform: 'scale(0.98)' },
});

export const actionIcon = css({
  fontSize: '2xl',
});

export const actionTitle = css({
  fontWeight: '600',
  fontSize: 'sm',
  color: 'gray.900',
});

export const actionMeta = css({
  fontSize: 'xs',
  color: 'gray.500',
});

// ─── Empty State ────────────────────────────────────────────────────────────
export const emptyMessage = css({
  fontSize: 'sm',
  color: 'gray.400',
  textAlign: 'center',
  padding: '6',
});
