import { styled } from '../../../../../../styled-system/jsx';

// ─── Page Wrapper ──────────────────────────────────────────────────────────
export const Wrapper = styled('div', {
  base: { padding: 'page' },
});

// ─── Page Header ───────────────────────────────────────────────────────────
export const PageHeader = styled('div', {
  base: { marginBottom: 'section' },
});

// ─── Profile Card ──────────────────────────────────────────────────────────
export const ProfileInfo = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2',
  },
});

export const ProfileName = styled('span', {
  base: {
    fontWeight: 'semibold',
    fontSize: 'lg',
    color: 'gray.900',
  },
});

export const ProfileEmail = styled('span', {
  base: {
    fontSize: 'sm',
    color: 'gray.500',
  },
});

export const ProfileMeta = styled('span', {
  base: {
    fontSize: 'sm',
    color: 'gray.500',
    marginTop: '2',
  },
});

// ─── Sections ──────────────────────────────────────────────────────────────
export const Section = styled('div', {
  base: { marginBottom: 'section' },
});

export const SectionTitle = styled('p', {
  base: {
    fontWeight: 'semibold',
    fontSize: 'md',
    color: 'gray.900',
    marginBottom: 'field-gap',
  },
});

// ─── Form ──────────────────────────────────────────────────────────────────
export const FormFields = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'field-gap',
  },
});

export const SubmitArea = styled('div', {
  base: { marginTop: '4' },
});

// ─── Feedback Messages ─────────────────────────────────────────────────────
export const SuccessMessage = styled('div', {
  base: {
    color: 'green.700',
    backgroundColor: 'green.50',
    padding: '3',
    borderRadius: 'lg',
    fontSize: 'sm',
    fontWeight: 'medium',
  },
});

export const ErrorMessage = styled('div', {
  base: {
    color: 'red.700',
    backgroundColor: 'red.50',
    padding: '3',
    borderRadius: 'lg',
    fontSize: 'sm',
    fontWeight: 'medium',
  },
});

// ─── Logout Section ────────────────────────────────────────────────────────
export const LogoutSection = styled('div', {
  base: { marginTop: 'section' },
});
