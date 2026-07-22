import { styled } from '../../../../../../styled-system/jsx';
import { Icon } from '@pitkit';

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

// ─── Form ──────────────────────────────────────────────────────────────────
export const Form = styled('form', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'field-gap',
  },
});

// ─── Submit Area ───────────────────────────────────────────────────────────
export const SubmitArea = styled('div', {
  base: { marginTop: '4' },
});

// ─── Error Box ─────────────────────────────────────────────────────────────
export const ErrorBox = styled('div', {
  base: {
    backgroundColor: 'red.50',
    color: 'red.700',
    padding: '3',
    borderRadius: 'lg',
    fontSize: 'sm',
    fontWeight: 'medium',
  },
});

// ─── Success Card ──────────────────────────────────────────────────────────
export const SuccessCard = styled('div', {
  base: {
    backgroundColor: 'green.50',
    padding: 'card-padding',
    borderRadius: 'xl',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3',
  },
});

export const SuccessIcon = styled(Icon, {
  base: { color: 'green.600' },
});

export const SuccessActions = styled('div', {
  base: {
    display: 'flex',
    gap: '3',
    marginTop: '2',
    width: '100%',
  },
});
