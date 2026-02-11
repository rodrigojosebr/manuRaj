'use client';

import { ReactNode, cloneElement, isValidElement } from 'react';
import { css } from '../../../../styled-system/css';
import { Label } from '../atoms/Label';
import { HelperText } from '../atoms/HelperText';

const fieldWrapper = css({
  width: '100%',
});

/** Props that can be injected into form control children */
interface FormControlProps {
  id?: string;
  state?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export interface FieldProps {
  /** Label text displayed above the input */
  label?: string;
  /** Error message - when present, shows error state */
  error?: string;
  /** Helper text shown below the input (hidden when error is present) */
  helperText?: string;
  /** Mark field as required (adds asterisk to label) */
  required?: boolean;
  /** Size variant that propagates to Label and child input */
  size?: 'sm' | 'md' | 'lg';
  /** HTML id for the input - auto-generated from label if not provided */
  id?: string;
  /** The form control element (InputBase, SelectBase, TextareaBase, etc.) */
  children: ReactNode;
  /** Additional className for the wrapper */
  className?: string;
}

export function Field({
  label,
  error,
  helperText,
  required,
  size = 'md',
  id,
  children,
  className,
}: FieldProps) {
  const fieldId = id || label?.toLowerCase().replace(/\s/g, '-');
  const hasError = !!error;

  // Clone child to inject props (id, state)
  let enhancedChildren = children;
  if (isValidElement<FormControlProps>(children)) {
    enhancedChildren = cloneElement(children, {
      id: fieldId,
      state: hasError ? 'error' : children.props.state || 'default',
      size: children.props.size || size,
    });
  }

  return (
    <div className={`${fieldWrapper} ${className || ''}`}>
      {label && (
        <Label htmlFor={fieldId} size={size} required={required}>
          {label}
        </Label>
      )}
      {enhancedChildren}
      {error && <HelperText variant="error">{error}</HelperText>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </div>
  );
}
