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

export const descriptionText = css({
  color: 'gray.700',
  fontSize: 'sm',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap',
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

// ─── Overdue Warning ───────────────────────────────────────────────────────
export const overdueWarning = css({
  color: 'red.600',
  fontWeight: 'semibold',
  fontSize: 'xs',
});

// ─── Action Area ───────────────────────────────────────────────────────────
export const actionArea = css({
  marginTop: 'section',
});

export const actionError = css({
  color: 'red.600',
  fontSize: 'sm',
  marginBottom: '3',
  textAlign: 'center',
});

// ─── Finish Form ───────────────────────────────────────────────────────────
export const finishForm = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'field-gap',
});

// ─── Result Section (Completed) ────────────────────────────────────────────
export const resultGrid = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
});

export const resultRow = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  fontSize: 'sm',
});

export const resultIcon = css({
  flexShrink: 0,
});

export const resultLabel = css({
  color: 'gray.500',
});

export const resultValue = css({
  color: 'gray.800',
  fontWeight: 'medium',
});
