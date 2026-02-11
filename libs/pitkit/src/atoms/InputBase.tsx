'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cva } from '../../../../styled-system/css';

const inputStyles = cva({
  base: {
    width: '100%',
    fontSize: 'sm',
    borderRadius: 'md',
    border: '1px solid',
    backgroundColor: 'white',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    _placeholder: {
      color: 'gray.400',
    },
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
        fontSize: 'xs',
      },
      md: {
        height: '10',
        paddingX: '3',
        fontSize: 'sm',
      },
      lg: {
        height: '12',
        paddingX: '4',
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

export interface InputBaseProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Size variant for the input */
  size?: 'sm' | 'md' | 'lg';
  /** Visual state of the input */
  state?: 'default' | 'error' | 'success';
}

export const InputBase = forwardRef<HTMLInputElement, InputBaseProps>(
  ({ size, state, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`${inputStyles({ size, state })} ${className || ''}`}
        {...props}
      />
    );
  }
);

InputBase.displayName = 'InputBase';
