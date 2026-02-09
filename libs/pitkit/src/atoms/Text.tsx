'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cva } from '../../../../styled-system/css';

const textStyles = cva({
  base: {
    lineHeight: '1.6',
  },
  variants: {
    size: {
      xs: { fontSize: '12px' },
      sm: { fontSize: '13px' },
      md: { fontSize: '14px' },
      lg: { fontSize: '16px' },
      xl: { fontSize: '18px' },
    },
    color: {
      default: { color: '#334155' },
      muted: { color: '#64748b' },
      light: { color: 'rgba(255,255,255,0.6)' },
      white: { color: 'white' },
      subtle: { color: '#94a3b8' },
    },
    weight: {
      normal: { fontWeight: '400' },
      medium: { fontWeight: '500' },
      semibold: { fontWeight: '600' },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'default',
    weight: 'normal',
  },
});

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  as?: 'p' | 'span';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'default' | 'muted' | 'light' | 'white' | 'subtle';
  weight?: 'normal' | 'medium' | 'semibold';
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ as: Tag = 'p', size, color, weight, className, children, ...props }, ref) => {
    return (
      <Tag
        ref={ref as React.Ref<HTMLParagraphElement>}
        className={`${textStyles({ size, color, weight })} ${className || ''}`}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Text.displayName = 'Text';
