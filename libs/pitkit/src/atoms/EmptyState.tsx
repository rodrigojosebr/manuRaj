'use client';

import { ReactNode } from 'react';
import { cva } from '../../../../styled-system/css';
import { SvgIcon } from './SvgIcon';
import { isValidIconName } from './icon-registry';

const containerStyles = cva({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  variants: {
    size: {
      sm: { padding: '6', gap: '2' },
      md: { padding: '10', gap: '3' },
      lg: { padding: '16', gap: '4' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const iconStyles = cva({
  base: {
    lineHeight: 1,
  },
  variants: {
    size: {
      sm: { fontSize: '2xl' },
      md: { fontSize: '4xl' },
      lg: { fontSize: '5xl' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const titleStyles = cva({
  base: {
    fontWeight: '600',
    color: 'gray.900',
  },
  variants: {
    size: {
      sm: { fontSize: 'sm' },
      md: { fontSize: 'md' },
      lg: { fontSize: 'lg' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const descriptionStyles = cva({
  base: {
    color: 'gray.500',
  },
  variants: {
    size: {
      sm: { fontSize: 'xs' },
      md: { fontSize: 'sm' },
      lg: { fontSize: 'md' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  size = 'md',
  className,
}: EmptyStateProps) {
  return (
    <div className={`${containerStyles({ size })} ${className || ''}`}>
      {icon && (
        isValidIconName(icon)
          ? <SvgIcon icon={icon} size={size === 'sm' ? 'lg' : 'xl'} />
          : <span className={iconStyles({ size })}>{icon}</span>
      )}
      <p className={titleStyles({ size })}>{title}</p>
      {description && <p className={descriptionStyles({ size })}>{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
