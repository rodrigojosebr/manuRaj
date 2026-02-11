import { css } from '../../../../../../styled-system/css';

// ─── Page Wrapper ──────────────────────────────────────────────────────────
export const wrapper = css({
  padding: 'page',
});

// ─── Page Header ───────────────────────────────────────────────────────────
export const pageHeader = css({
  marginBottom: 'section',
});

// ─── Profile Card ──────────────────────────────────────────────────────────
export const profileInfo = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
});

export const profileName = css({
  fontWeight: 'semibold',
  fontSize: 'lg',
  color: 'gray.900',
});

export const profileEmail = css({
  fontSize: 'sm',
  color: 'gray.500',
});

export const profileMeta = css({
  fontSize: 'sm',
  color: 'gray.500',
  marginTop: '2',
});

// ─── Sections ──────────────────────────────────────────────────────────────
export const section = css({
  marginBottom: 'section',
});

export const sectionTitle = css({
  fontWeight: 'semibold',
  fontSize: 'md',
  color: 'gray.900',
  marginBottom: 'field-gap',
});

// ─── Form ──────────────────────────────────────────────────────────────────
export const formFields = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'field-gap',
});

export const submitArea = css({
  marginTop: '4',
});

// ─── Feedback Messages ─────────────────────────────────────────────────────
export const successMessage = css({
  color: 'green.700',
  backgroundColor: 'green.50',
  padding: '3',
  borderRadius: 'lg',
  fontSize: 'sm',
  fontWeight: 'medium',
});

export const errorMessage = css({
  color: 'red.700',
  backgroundColor: 'red.50',
  padding: '3',
  borderRadius: 'lg',
  fontSize: 'sm',
  fontWeight: 'medium',
});

// ─── Logout Section ────────────────────────────────────────────────────────
export const logoutSection = css({
  marginTop: 'section',
});
