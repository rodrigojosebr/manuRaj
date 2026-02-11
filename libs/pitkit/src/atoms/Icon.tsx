'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cva } from '../../../../styled-system/css';

const iconStyles = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  variants: {
    size: {
      sm: { width: '24px', height: '24px', fontSize: '16px' },
      md: { width: '40px', height: '40px', fontSize: '20px' },
      lg: { width: '48px', height: '48px', fontSize: '22px' },
      xl: { width: '72px', height: '72px', fontSize: '32px' },
      xxl: { width: '100px', height: '100px', fontSize: '48px' },
    },
    variant: {
      default: {},
      circle: { borderRadius: '9999px' },
      rounded: { borderRadius: '12px' },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  emoji?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  variant?: 'default' | 'circle' | 'rounded';
  bg?: string;
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  ({ emoji, size, variant, bg, className, style, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`${iconStyles({ size, variant })} ${className || ''}`}
        style={{ backgroundColor: bg, ...style }}
        {...props}
      >
        {emoji || children}
      </span>
    );
  }
);

Icon.displayName = 'Icon';
