import { styled } from '../../../../../styled-system/jsx';

export const Card = styled('div', {
  base: {
    padding: { base: '24px', md: '32px' },
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    transition: 'all 0.25s',
    _hover: {
      borderColor: 'brand.200',
      boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
      transform: 'translateY(-4px)',
    },
  },
});

export const IconWrapper = styled('div', {
  base: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    marginBottom: '20px',
  },
});

export const Title = styled('h3', {
  base: {
    fontSize: '17px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#0f172a',
    letterSpacing: '-0.01em',
  },
});

export const Description = styled('p', {
  base: {
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '1.65',
  },
});
