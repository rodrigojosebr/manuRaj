import { css } from '../../../../../styled-system/css';

// ─── Wrapper ────────────────────────────────────────────────────────────────
export const wrapper = css({
  padding: 'page',
});

// ─── Greeting ───────────────────────────────────────────────────────────────
export const greetingSection = css({
  marginBottom: 'section',
});

// ─── Stats Grid ─────────────────────────────────────────────────────────────
export const statsGrid = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 'card-gap',
  marginBottom: 'section',
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

// ─── Quick Actions ──────────────────────────────────────────────────────────
export const actionsTitle = css({
  fontSize: 'lg',
  fontWeight: 'semibold',
  color: 'gray.900',
  marginBottom: 'card-gap',
});

export const actionsList = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'card-gap',
});

export const actionCard = css({
  display: 'flex',
  alignItems: 'center',
  gap: '4',
  padding: 'card-padding',
  backgroundColor: 'white',
  borderRadius: 'xl',
  boxShadow: 'sm',
  textDecoration: 'none',
  transition: 'box-shadow 0.2s',
  _hover: { boxShadow: 'md' },
  _active: { transform: 'scale(0.98)' },
});

export const actionIcon = css({
  fontSize: '3xl',
});

export const actionTitle = css({
  fontWeight: 'semibold',
  color: 'gray.900',
});

export const actionDescription = css({
  fontSize: 'sm',
  color: 'gray.500',
});
