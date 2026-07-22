'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { styled } from '../../../../styled-system/jsx';
import { Field, FieldProps } from './Field';
import { InputBase, InputBaseProps } from '../atoms/InputBase';
import { SvgIcon } from '../atoms/SvgIcon';
import type { IconName } from '../atoms/icon-registry';

const INPUT_ICON_PADDING: Record<string, string> = {
  sm: '30px',
  md: '36px',
  lg: '42px',
};

const IconInputWrapper = styled('div', {
  base: { position: 'relative', width: '100%' },
});

const InputIcon = styled('span', {
  base: {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'inline-flex',
    color: 'gray.400',
    pointerEvents: 'none',
  },
});

export interface TextFieldProps
  extends Omit<FieldProps, 'children'>,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input size variant */
  size?: InputBaseProps['size'];
  /** Icon displayed inside the input on the left */
  icon?: IconName;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, helperText, required, size = 'md', id, className, icon, style, ...inputProps }, ref) => {
    const input = icon ? (
      <IconInputWrapper>
        <InputIcon>
          <SvgIcon icon={icon} size={size === 'lg' ? 'md' : 'sm'} />
        </InputIcon>
        <InputBase
          ref={ref}
          style={{ paddingLeft: INPUT_ICON_PADDING[size], ...style }}
          {...inputProps}
        />
      </IconInputWrapper>
    ) : (
      <InputBase ref={ref} style={style} {...inputProps} />
    );

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
        {input}
      </Field>
    );
  }
);

TextField.displayName = 'TextField';
