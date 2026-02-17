'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';
import { styled } from '../../../../styled-system/jsx';
import { cva } from '../../../../styled-system/css';

const StyledTextarea = styled('textarea', cva({
  base: {
    width: '100%',
    fontSize: 'sm',
    borderRadius: 'md',
    border: '1px solid',
    backgroundColor: 'white',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    resize: 'vertical',
    minHeight: '80px',
    _placeholder: {
      color: 'gray.400',
    },
    _disabled: {
      backgroundColor: 'gray.100',
      cursor: 'not-allowed',
    },
  },
  variants: {
    textareaSize: {
      sm: { padding: '2', fontSize: 'xs' },
      md: { padding: '3', fontSize: 'sm' },
      lg: { padding: '4', fontSize: 'md' },
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
    textareaSize: 'md',
    state: 'default',
  },
}));

export interface TextareaBaseProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** Size variant for the textarea */
  size?: 'sm' | 'md' | 'lg';
  /** Visual state of the textarea */
  state?: 'default' | 'error' | 'success';
}

export const TextareaBase = forwardRef<HTMLTextAreaElement, TextareaBaseProps>(
  ({ size = 'md', state, ...props }, ref) => {
    return (
      <StyledTextarea ref={ref} textareaSize={size} state={state} {...props} />
    );
  }
);

TextareaBase.displayName = 'TextareaBase';
