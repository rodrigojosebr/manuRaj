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

// ─── Form ──────────────────────────────────────────────────────────────────
export const form = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'field-gap',
});

// ─── Submit Area ───────────────────────────────────────────────────────────
export const submitArea = css({
  marginTop: '4',
});

// ─── Error Box ─────────────────────────────────────────────────────────────
export const errorBox = css({
  backgroundColor: 'red.50',
  color: 'red.700',
  padding: '3',
  borderRadius: 'lg',
  fontSize: 'sm',
  fontWeight: 'medium',
});

// ─── Success Card ──────────────────────────────────────────────────────────
export const successCard = css({
  backgroundColor: 'green.50',
  padding: 'card-padding',
  borderRadius: 'xl',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '3',
});

export const successIcon = css({
  fontSize: '3xl',
});

export const successActions = css({
  display: 'flex',
  gap: '3',
  marginTop: '2',
  width: '100%',
});
