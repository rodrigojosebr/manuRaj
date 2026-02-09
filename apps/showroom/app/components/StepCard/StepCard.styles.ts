import { styled } from '../../../../../styled-system/jsx';

export const Card = styled('div', {
  base: {
    textAlign: 'center',
    position: 'relative',
  },
});

export const Number = styled('div', {
  base: {
    width: '72px',
    height: '72px',
    borderRadius: '9999px',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 auto',
    marginBottom: '24px',
    boxShadow: '0 0 40px rgba(37,99,235,0.25)',
    position: 'relative',
    zIndex: 1,
  },
});

export const Title = styled('h3', {
  base: {
    fontSize: '17px',
    fontWeight: '600',
    marginBottom: '10px',
    color: 'white',
    letterSpacing: '-0.01em',
  },
});

export const Description = styled('p', {
  base: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: '14px',
    lineHeight: '1.65',
    maxWidth: '260px',
    mx: 'auto',
  },
});
