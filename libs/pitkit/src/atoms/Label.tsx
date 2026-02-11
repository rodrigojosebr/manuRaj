'use client';

import { forwardRef, LabelHTMLAttributes } from 'react';
import { css, cva } from '../../../../styled-system/css';

const labelStyles = cva({
  base: {
    display: 'block',
    fontWeight: 'medium',
    color: 'gray.700',
  },
  variants: {
    size: {
      sm: {
        fontSize: 'xs',
        marginBottom: '0.5',
      },
      md: {
        fontSize: 'sm',
        marginBottom: '1',
      },
      lg: {
        fontSize: 'md',
        marginBottom: '1.5',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const requiredIndicator = css({
  color: 'danger.500',
  marginLeft: '0.5',
});

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ size, required, className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`${labelStyles({ size })} ${className || ''}`}
        {...props}
      >
        {children}
        {required && <span className={requiredIndicator}>*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';
