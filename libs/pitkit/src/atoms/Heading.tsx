'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cva } from '../../../../styled-system/css';

const headingStyles = cva({
  base: {
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '1.15',
  },
  variants: {
    as: {
      h1: { fontSize: { base: '36px', md: '52px', lg: '60px' } },
      h2: { fontSize: { base: '28px', md: '40px' } },
      h3: { fontSize: '17px', letterSpacing: '-0.01em' },
      h4: { fontSize: '15px' },
      h5: { fontSize: '14px' },
      h6: { fontSize: '13px' },
    },
    color: {
      default: { color: '#0f172a' },
      white: { color: 'white' },
      muted: { color: '#64748b' },
      brand: { color: 'brand.600' },
    },
  },
  defaultVariants: {
    as: 'h2',
    color: 'default',
  },
});

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  color?: 'default' | 'white' | 'muted' | 'brand';
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Tag = 'h2', color, className, children, ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={`${headingStyles({ as: Tag, color })} ${className || ''}`}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Heading.displayName = 'Heading';
