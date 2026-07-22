import Link from 'next/link';
import { styled } from '../../../../../../../styled-system/jsx';
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

export const DescriptionText = styled('p', {
  base: {
    color: 'gray.700',
    fontSize: 'sm',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
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

// ─── Overdue Warning ───────────────────────────────────────────────────────
export const OverdueWarning = styled('span', {
  base: {
    color: 'red.600',
    fontWeight: 'semibold',
    fontSize: 'xs',
  },
});

// ─── Success Banner ───────────────────────────────────────────────────────
export const SuccessBanner = styled('div', {
  base: {
    backgroundColor: 'green.50',
    color: 'green.800',
    border: '1px solid',
    borderColor: 'green.200',
    borderRadius: 'md',
    padding: '3',
    fontSize: 'sm',
    fontWeight: 'medium',
    textAlign: 'center',
    marginBottom: '4',
  },
});

// ─── Action Area ───────────────────────────────────────────────────────────
export const ActionArea = styled('div', {
  base: { marginTop: 'section' },
});

export const ActionError = styled('div', {
  base: {
    color: 'red.600',
    fontSize: 'sm',
    marginBottom: '3',
    textAlign: 'center',
  },
});

// ─── Finish Form ───────────────────────────────────────────────────────────
export const FinishForm = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'field-gap',
  },
});

// ─── Result Section (Completed) ────────────────────────────────────────────
export const ResultGrid = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2',
  },
});

export const ResultRow = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '2',
    fontSize: 'sm',
  },
});

export const ResultIcon = styled(Icon, {
  base: { flexShrink: 0 },
});

export const ResultLabel = styled('span', {
  base: { color: 'gray.500' },
});

export const ResultValue = styled('span', {
  base: {
    color: 'gray.800',
    fontWeight: 'medium',
  },
});
