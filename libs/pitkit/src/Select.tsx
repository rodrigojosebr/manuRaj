'use client';

import { forwardRef, SelectHTMLAttributes } from 'react';
import { css } from '../../../styled-system/css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className={css({ width: '100%' })}>
        {label && (
          <label
            htmlFor={selectId}
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
        <select
          ref={ref}
          id={selectId}
          className={`${css({
            width: '100%',
            height: '10',
            paddingX: '3',
            fontSize: 'sm',
            borderRadius: 'md',
            border: '1px solid',
            borderColor: error ? 'danger.500' : 'gray.300',
            backgroundColor: 'white',
            cursor: 'pointer',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
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
          })} ${className || ''}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select';
