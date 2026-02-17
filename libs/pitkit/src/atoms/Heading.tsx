'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { styled } from '../../../../styled-system/jsx';
import { cva } from '../../../../styled-system/css';

const headingCva = cva({
  base: {
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '1.15',
  },
  variants: {
    level: {
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
    level: 'h2',
    color: 'default',
  },
});

const StyledH1 = styled('h1', headingCva);
const StyledH2 = styled('h2', headingCva);
const StyledH3 = styled('h3', headingCva);
const StyledH4 = styled('h4', headingCva);
const StyledH5 = styled('h5', headingCva);
const StyledH6 = styled('h6', headingCva);

const tagMap = {
  h1: StyledH1, h2: StyledH2, h3: StyledH3,
  h4: StyledH4, h5: StyledH5, h6: StyledH6,
} as const;

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  color?: 'default' | 'white' | 'muted' | 'brand';
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Tag = 'h2', color, children, ...props }, ref) => {
    const StyledTag = tagMap[Tag];
    return (
      <StyledTag ref={ref} level={Tag} color={color} {...props}>
        {children}
      </StyledTag>
    );
  }
);

Heading.displayName = 'Heading';
