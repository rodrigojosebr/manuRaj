import Link from 'next/link';
import { styled } from '../../../../../styled-system/jsx';
import { cva } from '../../../../../styled-system/css';

// ─── Wrapper ────────────────────────────────────────────────────────────────
export const Wrapper = styled('div', {
  base: { padding: 'page' },
});

// ─── Greeting ───────────────────────────────────────────────────────────────
export const GreetingSection = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1',
    marginBottom: 'section',
    md: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
});

export const GreetingLeft = styled('div', {
  base: { display: 'flex', alignItems: 'center', gap: '3', flexWrap: 'wrap' },
});

export const GreetingDate = styled('p', {
  base: { fontSize: 'sm', color: 'gray.500' },
});

// ─── Section Header ────────────────────────────────────────────────────────
export const SectionHeader = styled('div', {
  base: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'card-gap' },
});

export const SectionTitle = styled('h2', {
  base: { fontSize: 'lg', fontWeight: 'semibold', color: 'gray.900' },
});

export const SectionLink = styled(Link, {
  base: {
    fontSize: 'sm',
    color: 'brand.600',
    textDecoration: 'none',
    fontWeight: '500',
    _hover: { textDecoration: 'underline' },
  },
});

// ─── Stats Grid ─────────────────────────────────────────────────────────────
export const StatsGrid = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'card-gap',
    marginBottom: 'section',
    md: { gridTemplateColumns: 'repeat(4, 1fr)' },
  },
});

export const StatCard = styled('div', cva({
  base: { borderRadius: 'xl', padding: 'card-padding' },
  variants: {
    colorScheme: {
      brand: { backgroundColor: 'brand.50' },
      success: { backgroundColor: 'green.50' },
      warning: { backgroundColor: 'orange.50' },
      danger: { backgroundColor: 'red.50' },
    },
  },
}));

export const StatValue = styled('p', cva({
  base: { fontSize: '3xl', fontWeight: 'bold' },
  variants: {
    colorScheme: {
      brand: { color: 'brand.700' },
      success: { color: 'green.700' },
      warning: { color: 'orange.700' },
      danger: { color: 'red.700' },
    },
  },
}));

export const StatLabel = styled('p', {
  base: { fontSize: 'sm', color: 'gray.600', marginTop: '2' },
});

// ─── Recent WOs ─────────────────────────────────────────────────────────────
export const RecentSection = styled('div', {
  base: { marginBottom: 'section' },
});

export const WoList = styled('div', {
  base: { display: 'flex', flexDirection: 'column', gap: 'card-gap' },
});

export const WoCardLink = styled(Link, {
  base: { textDecoration: 'none', color: 'inherit', display: 'block' },
});

export const WoCard = styled('div', cva({
  base: {
    backgroundColor: 'white',
    borderRadius: 'xl',
    padding: 'card-padding',
    borderLeft: '4px solid',
    borderLeftColor: 'gray.300',
    boxShadow: 'sm',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s, transform 0.1s',
    _hover: { boxShadow: 'md' },
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

export const WoMachine = styled('p', {
  base: { fontSize: 'sm', fontWeight: '600', color: 'gray.900', marginBottom: '1' },
});

export const WoDescription = styled('p', {
  base: { fontSize: 'sm', color: 'gray.600', marginBottom: '2' },
});

export const WoBadges = styled('div', {
  base: { display: 'flex', gap: '2', flexWrap: 'wrap' },
});

// ─── Preventive Plans ───────────────────────────────────────────────────────
export const PlansSection = styled('div', {
  base: { marginBottom: 'section' },
});

export const PlansList = styled('div', {
  base: { display: 'flex', flexDirection: 'column', gap: 'card-gap' },
});

export const PlanCard = styled('div', {
  base: {
    backgroundColor: 'white',
    borderRadius: 'xl',
    padding: 'card-padding',
    boxShadow: 'sm',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '3',
  },
});

export const PlanIcon = styled('span', {
  base: { fontSize: 'xl', flexShrink: 0, marginTop: '0.5' },
});

export const PlanInfo = styled('div', {
  base: { flex: 1, minWidth: 0 },
});

export const PlanName = styled('p', {
  base: { fontSize: 'sm', fontWeight: '600', color: 'gray.900' },
});

export const PlanMeta = styled('p', {
  base: { fontSize: 'sm', color: 'gray.500', marginTop: '1' },
});

export const PlanUrgent = styled('p', {
  base: { color: 'orange.600', fontWeight: '500' },
});

// ─── Quick Actions ──────────────────────────────────────────────────────────
export const ActionsGrid = styled('div', {
  base: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'card-gap' },
});

export const ActionCard = styled(Link, {
  base: {
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
  },
});

export const ActionIcon = styled('span', {
  base: { fontSize: '2xl' },
});

export const ActionTitle = styled('span', {
  base: { fontWeight: '600', fontSize: 'sm', color: 'gray.900' },
});

export const ActionMeta = styled('span', {
  base: { fontSize: 'xs', color: 'gray.500' },
});

// ─── Empty State ────────────────────────────────────────────────────────────
export const EmptyMessage = styled('p', {
  base: { fontSize: 'sm', color: 'gray.400', textAlign: 'center', padding: '6' },
});
