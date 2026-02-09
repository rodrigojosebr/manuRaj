'use client';

import { forwardRef, SelectHTMLAttributes } from 'react';
import { Field, FieldProps } from './Field';
import { SelectBase, SelectBaseProps } from '../atoms/SelectBase';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps
  extends Omit<FieldProps, 'children'>,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Array of options to display */
  options: SelectOption[];
  /** Placeholder text shown as first disabled option */
  placeholder?: string;
  /** Select size variant */
  size?: SelectBaseProps['size'];
}

/**
 * SelectField - Convenience component combining Field + SelectBase
 *
 * This is equivalent to:
 * ```tsx
 * <Field label="..." error="..." helperText="...">
 *   <SelectBase>
 *     <option>...</option>
 *   </SelectBase>
 * </Field>
 * ```
 *
 * For more control, use Field with SelectBase directly.
 */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, helperText, required, size, id, className, options, placeholder, ...selectProps }, ref) => {
    return (
      <Field
        label={label}
        error={error}
        helperText={helperText}
        required={required}
        size={size}
        id={id}
        className={className}
      >
        <SelectBase ref={ref} {...selectProps}>
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
        </SelectBase>
      </Field>
    );
  }
);

SelectField.displayName = 'SelectField';
