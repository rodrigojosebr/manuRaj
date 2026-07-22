'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { styled } from '../../../../styled-system/jsx';
import { cva } from '../../../../styled-system/css';
import { SvgIcon, type IconSize } from './SvgIcon';
import type { IconName } from './icon-registry';

const StyledButton = styled('button', cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'md',
    fontWeight: 'medium',
    transition: 'all 0.2s',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    _focus: {
      outline: '2px solid',
      outlineColor: 'brand.500',
      outlineOffset: '2px',
    },
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: 'brand.600',
        color: 'white',
        _hover: { backgroundColor: 'brand.700' },
      },
      secondary: {
        backgroundColor: 'gray.100',
        color: 'gray.900',
        _hover: { backgroundColor: 'gray.200' },
      },
      danger: {
        backgroundColor: 'danger.500',
        color: 'white',
        _hover: { backgroundColor: 'danger.600' },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'gray.700',
        _hover: { backgroundColor: 'gray.100' },
      },
      link: {
        backgroundColor: 'transparent',
        color: 'brand.600',
        _hover: { textDecoration: 'underline' },
      },
    },
    size: {
      sm: { height: '8', paddingX: '3', fontSize: 'sm' },
      md: { height: '10', paddingX: '4', fontSize: 'sm' },
      lg: { height: '12', paddingX: '6', fontSize: 'md' },
    },
    fullWidth: {
      true: { width: '100%' },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
}));

const IconLeft = styled('span', {
  base: { marginRight: '2', display: 'inline-flex' },
});

const IconRight = styled('span', {
  base: { marginLeft: '2', display: 'inline-flex' },
});

const LoadingSvg = styled('svg', {
  base: { animation: 'spin 1s linear infinite', width: '4', height: '4' },
});

const BUTTON_ICON_SIZE: Record<string, IconSize> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size = 'md', fullWidth, isLoading, disabled, leftIcon, rightIcon, children, ...props }, ref) => {
    const iconSize = BUTTON_ICON_SIZE[size] || 'sm';

    return (
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <IconLeft>
            <LoadingSvg fill="none" viewBox="0 0 24 24">
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </LoadingSvg>
          </IconLeft>
        ) : leftIcon ? (
          <IconLeft>
            <SvgIcon icon={leftIcon} size={iconSize} />
          </IconLeft>
        ) : null}
        {children}
        {rightIcon && !isLoading && (
          <IconRight>
            <SvgIcon icon={rightIcon} size={iconSize} />
          </IconRight>
        )}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';
