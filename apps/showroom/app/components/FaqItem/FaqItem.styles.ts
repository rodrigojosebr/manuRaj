import { styled } from '../../../../../styled-system/jsx';

export const Wrapper = styled('div', {
  base: {
    borderRadius: '12px',
    border: '1px solid',
    overflow: 'hidden',
    transition: 'all 0.2s',
  },
  variants: {
    isOpen: {
      true: {
        backgroundColor: '#f8fafc',
        borderColor: 'brand.200',
      },
      false: {
        backgroundColor: 'white',
        borderColor: '#e2e8f0',
      },
    },
  },
  defaultVariants: {
    isOpen: false,
  },
});

export const Button = styled('button', {
  base: {
    width: '100%',
    padding: { base: '18px 20px', md: '20px 24px' },
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'color 0.2s',
    gap: '16px',
    _hover: {
      color: 'brand.600',
    },
  },
  variants: {
    isOpen: {
      true: { color: 'brand.700' },
      false: { color: '#0f172a' },
    },
  },
  defaultVariants: {
    isOpen: false,
  },
});

export const Toggle = styled('span', {
  base: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '400',
    flexShrink: 0,
    transition: 'all 0.2s',
  },
  variants: {
    isOpen: {
      true: {
        backgroundColor: 'brand.50',
        color: 'brand.600',
        transform: 'rotate(45deg)',
      },
      false: {
        backgroundColor: '#f1f5f9',
        color: '#94a3b8',
        transform: 'none',
      },
    },
  },
  defaultVariants: {
    isOpen: false,
  },
});

export const Answer = styled('div', {
  base: {
    padding: { base: '0 20px 18px', md: '0 24px 20px' },
    color: '#64748b',
    fontSize: '14px',
    lineHeight: '1.75',
  },
});
