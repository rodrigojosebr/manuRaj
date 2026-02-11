'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cva } from '../../../../styled-system/css';

const helperTextStyles = cva({
  base: {
    fontSize: 'sm',
    marginTop: '1',
    lineHeight: '1.4',
  },
  variants: {
    variant: {
      default: {
        color: 'gray.500',
      },
      error: {
        color: 'danger.500',
      },
      success: {
        color: 'success.600',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface HelperTextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: 'default' | 'error' | 'success';
}

export const HelperText = forwardRef<HTMLParagraphElement, HelperTextProps>(
  ({ variant, className, children, ...props }, ref) => {
    if (!children) return null;

    return (
      <p
        ref={ref}
        className={`${helperTextStyles({ variant })} ${className || ''}`}
        {...props}
      >
        {children}
      </p>
    );
  }
);

HelperText.displayName = 'HelperText';
