'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { Field, FieldProps } from './Field';
import { InputBase, InputBaseProps } from '../atoms/InputBase';

export interface TextFieldProps
  extends Omit<FieldProps, 'children'>,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input size variant */
  size?: InputBaseProps['size'];
}

/**
 * TextField - Convenience component combining Field + InputBase
 *
 * This is equivalent to:
 * ```tsx
 * <Field label="..." error="..." helperText="...">
 *   <InputBase />
 * </Field>
 * ```
 *
 * For more control, use Field with InputBase directly.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, helperText, required, size, id, className, ...inputProps }, ref) => {
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
        <InputBase ref={ref} {...inputProps} />
      </Field>
    );
  }
);

TextField.displayName = 'TextField';
