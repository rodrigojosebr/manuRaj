import { styled } from '../../../../../styled-system/jsx';

export const Card = styled('div', {
  base: {
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '1px solid',
    borderColor: 'gray.200',
    padding: { base: '24px', md: '40px' },
    maxWidth: '640px',
    marginX: 'auto',
    marginTop: '48px',
    boxShadow: '0 4px 24px rgba(15,23,42,0.06)',
  },
});

export const Form = styled('form', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
});

export const Row = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)' },
    gap: '16px',
  },
});

export const ErrorText = styled('p', {
  base: {
    color: 'danger.600',
    fontSize: '14px',
  },
});

export const SuccessWrap = styled('div', {
  base: {
    textAlign: 'center',
    paddingY: '32px',
  },
});

export const SuccessIcon = styled('div', {
  base: {
    fontSize: '48px',
    marginBottom: '16px',
  },
});

export const SuccessTitle = styled('h3', {
  base: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'gray.900',
    marginBottom: '8px',
  },
});

export const SuccessText = styled('p', {
  base: {
    color: 'gray.600',
    fontSize: '15px',
  },
});
