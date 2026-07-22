'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { styled } from '../../../../styled-system/jsx';
import { cva } from '../../../../styled-system/css';

const StyledHelperText = styled('p', cva({
  base: {
    fontSize: 'sm',
    marginTop: '1',
    lineHeight: '1.4',
  },
  variants: {
    variant: {
      default: { color: 'gray.500' },
      error: { color: 'danger.500' },
      success: { color: 'success.600' },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
}));

export interface HelperTextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: 'default' | 'error' | 'success';
}

export const HelperText = forwardRef<HTMLParagraphElement, HelperTextProps>(
  ({ variant, children, ...props }, ref) => {
    if (!children) return null;

    return (
      <StyledHelperText ref={ref} variant={variant} {...props}>
        {children}
      </StyledHelperText>
    );
  }
);

HelperText.displayName = 'HelperText';
