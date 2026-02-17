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
  base: {
    color: 'gray.500',
    fontSize: 'sm',
    marginTop: '1',
  },
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
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'card-gap',
  },
});

export const CardLink = styled(Link, {
  base: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  },
});

// ─── Machine Card (internal styles) ────────────────────────────────────────
export const MachineHeader = styled('div', {
  base: {
    display: 'flex',
    gap: '2',
    alignItems: 'center',
    marginBottom: '1',
  },
});

export const MachineName = styled('span', {
  base: {
    fontWeight: 'semibold',
    color: 'gray.900',
  },
});

export const MachineCode = styled('p', {
  base: {
    fontSize: 'sm',
    color: 'gray.500',
    marginBottom: '2',
  },
});

export const MachineDetail = styled('p', {
  base: {
    fontSize: 'sm',
    color: 'gray.600',
    marginBottom: '1',
  },
});

export const MachineBadgeRow = styled('div', {
  base: { marginTop: '2' },
});
