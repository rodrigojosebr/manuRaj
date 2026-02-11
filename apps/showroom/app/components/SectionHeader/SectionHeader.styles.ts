import { styled } from '../../../../../styled-system/jsx';

export const Wrapper = styled('div', {
  base: {
    textAlign: 'center',
    maxWidth: '600px',
    mx: 'auto',
  },
});

export const Tag = styled('span', {
  base: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '16px',
    padding: '4px 12px',
    borderRadius: '4px',
  },
  variants: {
    dark: {
      true: {
        color: 'brand.400',
        backgroundColor: 'rgba(37,99,235,0.1)',
        border: '1px solid rgba(37,99,235,0.2)',
      },
      false: {
        color: 'brand.600',
        backgroundColor: 'brand.50',
        border: '1px solid',
        borderColor: 'brand.100',
      },
    },
  },
  defaultVariants: {
    dark: false,
  },
});

export const Title = styled('h2', {
  base: {
    fontSize: { base: '28px', md: '40px' },
    fontWeight: '700',
    lineHeight: '1.15',
    letterSpacing: '-0.02em',
    marginBottom: '16px',
  },
  variants: {
    dark: {
      true: { color: 'white' },
      false: { color: '#0f172a' },
    },
  },
  defaultVariants: {
    dark: false,
  },
});

export const Subtitle = styled('p', {
  base: {
    fontSize: { base: '15px', md: '17px' },
    lineHeight: '1.6',
  },
  variants: {
    dark: {
      true: { color: 'rgba(255,255,255,0.5)' },
      false: { color: '#64748b' },
    },
  },
  defaultVariants: {
    dark: false,
  },
});
