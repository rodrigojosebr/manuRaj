import { styled } from '../../../../../styled-system/jsx';

export const Card = styled('div', {
  base: {
    padding: { base: '32px 24px', md: '36px 32px' },
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  variants: {
    highlighted: {
      true: {
        backgroundColor: '#0f172a',
        color: 'white',
        border: '2px solid #2563eb',
        zIndex: 2,
        boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
        transform: { md: 'scaleY(1.02)' },
      },
      false: {
        backgroundColor: 'white',
        color: '#0f172a',
        border: '1px solid #e2e8f0',
        zIndex: 1,
      },
    },
    position: {
      left: {
        borderRadius: { base: '16px', md: '16px 0 0 16px' },
      },
      center: {
        borderRadius: '16px',
      },
      right: {
        borderRadius: { base: '16px', md: '0 16px 16px 0' },
      },
    },
  },
  defaultVariants: {
    highlighted: false,
    position: 'center',
  },
});

export const Badge = styled('span', {
  base: {
    position: 'absolute',
    top: '-13px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'brand.500',
    color: 'white',
    padding: '4px 16px',
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
});

export const Name = styled('h3', {
  base: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '4px',
    letterSpacing: '-0.01em',
  },
});

export const Description = styled('p', {
  base: {
    fontSize: '13px',
    marginBottom: '24px',
  },
  variants: {
    highlighted: {
      true: { color: 'rgba(255,255,255,0.5)' },
      false: { color: '#94a3b8' },
    },
  },
  defaultVariants: {
    highlighted: false,
  },
});

export const PriceWrapper = styled('div', {
  base: {
    marginBottom: '28px',
  },
});

export const Price = styled('span', {
  base: {
    fontSize: '36px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
  },
});

export const Period = styled('span', {
  base: {
    fontSize: '13px',
    fontWeight: '400',
    marginLeft: '4px',
  },
  variants: {
    highlighted: {
      true: { color: 'rgba(255,255,255,0.4)' },
      false: { color: '#94a3b8' },
    },
  },
  defaultVariants: {
    highlighted: false,
  },
});

export const FeatureList = styled('ul', {
  base: {
    marginBottom: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
    listStyle: 'none',
  },
});

export const FeatureItem = styled('li', {
  base: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    fontSize: '14px',
    lineHeight: '1.4',
  },
});

export const Checkmark = styled('span', {
  base: {
    fontWeight: '600',
    flexShrink: 0,
    marginTop: '1px',
  },
  variants: {
    highlighted: {
      true: { color: 'brand.400' },
      false: { color: 'success.500' },
    },
  },
  defaultVariants: {
    highlighted: false,
  },
});

export const FeatureText = styled('span', {
  base: {},
  variants: {
    highlighted: {
      true: { color: 'rgba(255,255,255,0.75)' },
      false: { color: '#475569' },
    },
  },
  defaultVariants: {
    highlighted: false,
  },
});

export const CtaButton = styled('a', {
  base: {
    display: 'block',
    textAlign: 'center',
    padding: '13px',
    borderRadius: '10px',
    fontWeight: '600',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  variants: {
    highlighted: {
      true: {
        backgroundColor: 'brand.500',
        color: 'white',
        _hover: {
          backgroundColor: 'brand.400',
          transform: 'translateY(-1px)',
        },
      },
      false: {
        backgroundColor: 'transparent',
        color: 'brand.600',
        border: '1px solid',
        borderColor: 'brand.200',
        _hover: {
          backgroundColor: 'brand.50',
          transform: 'translateY(-1px)',
        },
      },
    },
  },
  defaultVariants: {
    highlighted: false,
  },
});
