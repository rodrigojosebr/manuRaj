'use client';

import { forwardRef, SelectHTMLAttributes, ReactNode } from 'react';
import { cva } from '../../../../styled-system/css';

const selectStyles = cva({
  base: {
    width: '100%',
    fontSize: 'sm',
    borderRadius: 'md',
    border: '1px solid',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5em 1.5em',
    _disabled: {
      backgroundColor: 'gray.100',
      cursor: 'not-allowed',
    },
  },
  variants: {
    size: {
      sm: {
        height: '8',
        paddingX: '2.5',
        paddingRight: '8',
        fontSize: 'xs',
      },
      md: {
        height: '10',
        paddingX: '3',
        paddingRight: '10',
        fontSize: 'sm',
      },
      lg: {
        height: '12',
        paddingX: '4',
        paddingRight: '12',
        fontSize: 'md',
      },
    },
    state: {
      default: {
        borderColor: 'gray.300',
        _focus: {
          outline: 'none',
          borderColor: 'brand.500',
          boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
        },
      },
      error: {
        borderColor: 'danger.500',
        _focus: {
          outline: 'none',
          borderColor: 'danger.500',
          boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
        },
      },
      success: {
        borderColor: 'success.500',
        _focus: {
          outline: 'none',
          borderColor: 'success.500',
          boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.1)',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
    state: 'default',
  },
});

export interface SelectBaseProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Size variant for the select */
  size?: 'sm' | 'md' | 'lg';
  /** Visual state of the select */
  state?: 'default' | 'error' | 'success';
  /** Options to render inside the select */
  children: ReactNode;
}

export const SelectBase = forwardRef<HTMLSelectElement, SelectBaseProps>(
  ({ size, state, className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`${selectStyles({ size, state })} ${className || ''}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);

SelectBase.displayName = 'SelectBase';
