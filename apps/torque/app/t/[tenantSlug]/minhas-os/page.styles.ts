import Link from 'next/link';
import { styled } from '../../../../../../styled-system/jsx';
import { cva } from '../../../../../../styled-system/css';

// ─── Page Wrapper ──────────────────────────────────────────────────────────
export const Wrapper = styled('div', {
  base: { padding: 'page' },
});

// ─── Page Header ───────────────────────────────────────────────────────────
export const PageHeader = styled('div', {
  base: { marginBottom: 'section' },
});

export const Subtitle = styled('p', {
  base: { color: 'gray.500', fontSize: 'sm', marginTop: '1' },
});

// ─── Tabs ──────────────────────────────────────────────────────────────────
export const TabsContainer = styled('div', {
  base: {
    display: 'flex',
    gap: '2',
    overflowX: 'auto',
    marginBottom: 'section',
    paddingBottom: '2',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
  },
});

export const Tab = styled('button', cva({
  base: {
    flexShrink: 0,
    padding: '2',
    paddingX: '4',
    borderRadius: 'full',
    fontSize: 'sm',
    fontWeight: 'medium',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
  },
  variants: {
    active: {
      true: { backgroundColor: 'brand.600', color: 'white' },
      false: { backgroundColor: 'gray.100', color: 'gray.600' },
    },
  },
  defaultVariants: { active: false },
}));

// ─── Card List ─────────────────────────────────────────────────────────────
export const CardList = styled('div', {
  base: { display: 'flex', flexDirection: 'column', gap: 'card-gap' },
});

export const CardLink = styled(Link, {
  base: { textDecoration: 'none', color: 'inherit', display: 'block' },
});

// ─── Work Order Card ───────────────────────────────────────────────────────
export const Card = styled('div', cva({
  base: {
    backgroundColor: 'white',
    borderRadius: 'xl',
    padding: 'card-padding',
    boxShadow: 'sm',
    position: 'relative',
    borderLeft: '4px solid',
    borderLeftColor: 'gray.200',
    transition: 'box-shadow 0.2s, transform 0.1s',
    _hover: { boxShadow: 'md' },
    _active: { transform: 'scale(0.98)' },
  },
  variants: {
    woStatus: {
      open: { borderLeftColor: '#3b82f6' },
      assigned: { borderLeftColor: '#059669' },
      in_progress: { borderLeftColor: '#f59e0b' },
      completed: { borderLeftColor: '#22c55e' },
      cancelled: { borderLeftColor: '#9ca3af' },
    },
    overdue: {
      true: { borderLeftColor: '#ef4444' },
    },
  },
}));

export const CardMachine = styled('div', {
  base: { display: 'flex', gap: '2', alignItems: 'center', marginBottom: '2' },
});

export const CardMachineIcon = styled('span', {
  base: { fontSize: 'lg' },
});

export const CardMachineText = styled('span', {
  base: { fontWeight: 'semibold', color: 'gray.700', fontSize: 'sm' },
});

export const CardDescription = styled('p', {
  base: { color: 'gray.600', fontSize: 'sm', marginBottom: '3', lineHeight: '1.5' },
});

export const CardBadges = styled('div', {
  base: { display: 'flex', gap: '2', flexWrap: 'wrap', marginBottom: '3' },
});

export const CardMeta = styled('div', {
  base: { display: 'flex', justifyContent: 'space-between', fontSize: 'xs', color: 'gray.500', marginBottom: '3' },
});

export const OverdueIndicator = styled('span', {
  base: { color: 'red.600', fontWeight: 'semibold' },
});

// ─── Status Bar ─────────────────────────────────────────────────────────────
export const StatusBar = styled('div', cva({
  base: {
    padding: '3',
    borderRadius: 'lg',
    textAlign: 'center',
    fontWeight: 'medium',
    fontSize: 'sm',
    backgroundColor: 'gray.100',
    color: 'gray.500',
  },
  variants: {
    woStatus: {
      open: { backgroundColor: 'blue.50', color: 'blue.700' },
      assigned: { backgroundColor: 'brand.50', color: 'brand.700' },
      in_progress: { backgroundColor: 'orange.50', color: 'orange.700' },
      completed: { backgroundColor: 'green.50', color: 'green.700' },
      cancelled: { backgroundColor: 'gray.100', color: 'gray.500' },
    },
  },
}));
