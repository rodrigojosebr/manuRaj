import { styled } from '../../../../../styled-system/jsx';

export const Card = styled('div', {
  base: {
    padding: { base: '24px', md: '32px' },
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    transition: 'all 0.2s',
    _hover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
    },
  },
});

export const Stars = styled('div', {
  base: {
    display: 'flex',
    gap: '2px',
  },
});

export const StarIcon = styled('span', {
  base: {
    color: '#f59e0b',
    fontSize: '16px',
  },
});

export const Text = styled('p', {
  base: {
    color: '#334155',
    fontSize: '14px',
    lineHeight: '1.75',
    flex: 1,
  },
});

export const Author = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '20px',
  },
});

export const Avatar = styled('div', {
  base: {
    width: '40px',
    height: '40px',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '13px',
    fontWeight: '700',
    flexShrink: 0,
  },
});

export const Name = styled('p', {
  base: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#0f172a',
  },
});

export const Role = styled('p', {
  base: {
    fontSize: '12px',
    color: '#94a3b8',
  },
});
