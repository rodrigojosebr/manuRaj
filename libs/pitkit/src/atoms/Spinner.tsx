'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { css, cva } from '../../../../styled-system/css';

const spinnerStyles = cva({
  base: {
    animation: 'spin 1s linear infinite',
  },
  variants: {
    size: {
      xs: { width: '3', height: '3' },
      sm: { width: '4', height: '4' },
      md: { width: '5', height: '5' },
      lg: { width: '6', height: '6' },
      xl: { width: '8', height: '8' },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`${css({ display: 'inline-flex' })} ${className || ''}`}
        {...props}
      >
        <svg
          className={spinnerStyles({ size })}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className={css({ opacity: 0.25 })}
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className={css({ opacity: 0.75 })}
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </span>
    );
  }
);

Spinner.displayName = 'Spinner';
