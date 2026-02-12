'use client';

import { cva } from '../../../../styled-system/css';
import { ICON_REGISTRY, type IconName } from './icon-registry';

const svgIconStyles = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  variants: {
    size: {
      xs: { width: '14px', height: '14px' },
      sm: { width: '16px', height: '16px' },
      md: { width: '20px', height: '20px' },
      lg: { width: '24px', height: '24px' },
      xl: { width: '32px', height: '32px' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface SvgIconProps {
  icon: IconName;
  size?: IconSize;
  alt?: string;
  className?: string;
}

export function SvgIcon({ icon, size = 'md', alt, className }: SvgIconProps) {
  const children = ICON_REGISTRY[icon];
  if (!children) return null;

  return (
    <span
      className={`${svgIconStyles({ size })} ${className || ''}`}
      role={alt ? 'img' : 'presentation'}
      aria-label={alt}
      aria-hidden={!alt}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </span>
  );
}

SvgIcon.displayName = 'Icon';
