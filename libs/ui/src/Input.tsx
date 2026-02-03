'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { css } from '../../../styled-system/css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className={css({ width: '100%' })}>
        {label && (
          <label
            htmlFor={inputId}
            className={css({
              display: 'block',
              fontSize: 'sm',
              fontWeight: 'medium',
              color: 'gray.700',
              marginBottom: '1',
            })}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${css({
            width: '100%',
            height: '10',
            paddingX: '3',
            fontSize: 'sm',
            borderRadius: 'md',
            border: '1px solid',
            borderColor: error ? 'danger.500' : 'gray.300',
            backgroundColor: 'white',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            _focus: {
              outline: 'none',
              borderColor: error ? 'danger.500' : 'brand.500',
              boxShadow: error
                ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
                : '0 0 0 3px rgba(59, 130, 246, 0.1)',
            },
            _disabled: {
              backgroundColor: 'gray.100',
              cursor: 'not-allowed',
            },
            _placeholder: {
              color: 'gray.400',
            },
          })} ${className || ''}`}
          {...props}
        />
        {error && (
          <p
            className={css({
              fontSize: 'sm',
              color: 'danger.500',
              marginTop: '1',
            })}
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            className={css({
              fontSize: 'sm',
              color: 'gray.500',
              marginTop: '1',
            })}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
