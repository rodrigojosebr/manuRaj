'use client';

import { forwardRef, LabelHTMLAttributes } from 'react';
import { styled } from '../../../../styled-system/jsx';
import { cva } from '../../../../styled-system/css';

const StyledLabel = styled('label', cva({
  base: {
    display: 'block',
    fontWeight: 'medium',
    color: 'gray.700',
  },
  variants: {
    size: {
      sm: { fontSize: 'xs', marginBottom: '0.5' },
      md: { fontSize: 'sm', marginBottom: '1' },
      lg: { fontSize: 'md', marginBottom: '1.5' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
}));

const RequiredIndicator = styled('span', {
  base: { color: 'danger.500', marginLeft: '0.5' },
});

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ size, required, children, ...props }, ref) => {
    return (
      <StyledLabel ref={ref} size={size} {...props}>
        {children}
        {required && <RequiredIndicator>*</RequiredIndicator>}
      </StyledLabel>
    );
  }
);

Label.displayName = 'Label';
