import Link from 'next/link';
import { styled } from '../../../../../../../styled-system/jsx';
import { cva } from '../../../../../../../styled-system/css';
import { Icon } from '@pitkit';

// ─── Page Wrapper ──────────────────────────────────────────────────────────
export const Wrapper = styled('div', {
  base: { padding: 'page' },
});

// ─── Back Link ─────────────────────────────────────────────────────────────
export const BackLink = styled(Link, {
  base: {
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
  },
});

// ─── Header ────────────────────────────────────────────────────────────────
export const Header = styled('div', {
  base: { marginBottom: 'section' },
});

export const MachineTitle = styled('div', {
  base: {
    fontSize: 'lg',
    fontWeight: 'bold',
    color: 'gray.800',
    marginBottom: '2',
  },
});

export const Badges = styled('div', {
  base: {
    display: 'flex',
    gap: '2',
    flexWrap: 'wrap',
  },
});

// ─── Sections ──────────────────────────────────────────────────────────────
export const Section = styled('div', {
  base: {
    backgroundColor: 'white',
    borderRadius: 'xl',
    padding: 'card-padding',
    boxShadow: 'sm',
    marginBottom: 'card-gap',
  },
});

export const SectionTitle = styled('div', {
  base: {
    fontSize: 'sm',
    fontWeight: 'semibold',
    color: 'gray.500',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '3',
  },
});

// ─── Info Grid ─────────────────────────────────────────────────────────────
export const InfoGrid = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3',
  },
});

export const InfoRow = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '3',
  },
});

export const InfoIcon = styled(Icon, {
  base: {
    flexShrink: 0,
    color: 'gray.400',
  },
});

export const InfoContent = styled('div', {
  base: { flex: 1 },
});

export const InfoLabel = styled('div', {
  base: {
    fontSize: 'xs',
    color: 'gray.500',
    fontWeight: 'medium',
  },
});

export const InfoValue = styled('div', {
  base: {
    fontSize: 'sm',
    color: 'gray.800',
    fontWeight: 'medium',
  },
});

// ─── WO List ───────────────────────────────────────────────────────────────
export const WoList = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'card-gap',
  },
});

export const WoCardLink = styled(Link, {
  base: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  },
});

export const WoCard = styled('div', cva({
  base: {
    backgroundColor: 'gray.50',
    borderRadius: 'lg',
    padding: '3',
    borderLeft: '4px solid',
    borderLeftColor: 'gray.300',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s, transform 0.1s',
    _hover: { boxShadow: 'sm' },
    _active: { transform: 'scale(0.98)' },
  },
  variants: {
    woStatus: {
      open: { borderLeftColor: 'blue.500' },
      assigned: { borderLeftColor: 'brand.500' },
      in_progress: { borderLeftColor: 'orange.500' },
      completed: { borderLeftColor: 'green.500' },
      cancelled: { borderLeftColor: 'gray.300' },
    },
  },
}));

export const WoDescription = styled('p', {
  base: {
    fontSize: 'sm',
    color: 'gray.600',
    marginBottom: '2',
  },
});

export const WoBadges = styled('div', {
  base: {
    display: 'flex',
    gap: '2',
    flexWrap: 'wrap',
  },
});

export const WoMeta = styled('p', {
  base: {
    fontSize: 'xs',
    color: 'gray.500',
    marginTop: '2',
  },
});

// ─── Empty State ───────────────────────────────────────────────────────────
export const EmptyMessage = styled('p', {
  base: {
    fontSize: 'sm',
    color: 'gray.400',
    textAlign: 'center',
    padding: '6',
  },
});
