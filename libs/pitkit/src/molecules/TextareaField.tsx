'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';
import { Field, FieldProps } from './Field';
import { TextareaBase, TextareaBaseProps } from '../atoms/TextareaBase';

export interface TextareaFieldProps
  extends Omit<FieldProps, 'children'>,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** Textarea size variant */
  size?: TextareaBaseProps['size'];
}

/**
 * TextareaField - Convenience component combining Field + TextareaBase
 *
 * This is equivalent to:
 * ```tsx
 * <Field label="..." error="..." helperText="...">
 *   <TextareaBase />
 * </Field>
 * ```
 *
 * For more control, use Field with TextareaBase directly.
 */
export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, helperText, required, size, id, className, ...textareaProps }, ref) => {
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
        <TextareaBase ref={ref} {...textareaProps} />
      </Field>
    );
  }
);

TextareaField.displayName = 'TextareaField';
