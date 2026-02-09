import { styled } from '../../../../../styled-system/jsx';

export const Card = styled('div', {
  base: {
    padding: { base: '28px 24px', md: '36px 32px' },
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
    transition: 'all 0.2s',
    _hover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
    },
  },
});

export const Value = styled('p', {
  base: {
    fontSize: { base: '36px', md: '44px' },
    fontWeight: '700',
    lineHeight: '1',
    marginBottom: '12px',
    letterSpacing: '-0.02em',
  },
});

export const Label = styled('p', {
  base: {
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '1.5',
    maxWidth: '220px',
    mx: 'auto',
  },
});
