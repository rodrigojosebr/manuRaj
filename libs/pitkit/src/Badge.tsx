'use client';

import { ReactNode } from 'react';
import { cva } from '../../../styled-system/css';

const badgeStyles = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 'full',
    fontSize: 'xs',
    fontWeight: 'medium',
    paddingX: '2.5',
    paddingY: '0.5',
  },
  variants: {
    variant: {
      default: {
        backgroundColor: 'gray.100',
        color: 'gray.800',
      },
      primary: {
        backgroundColor: 'brand.100',
        color: 'brand.800',
      },
      success: {
        backgroundColor: 'green.100',
        color: 'green.800',
      },
      warning: {
        backgroundColor: 'yellow.100',
        color: 'yellow.800',
      },
      danger: {
        backgroundColor: 'red.100',
        color: 'red.800',
      },
      info: {
        backgroundColor: 'blue.100',
        color: 'blue.800',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function Badge({ children, variant, className }: BadgeProps) {
  return (
    <span className={`${badgeStyles({ variant })} ${className || ''}`}>
      {children}
    </span>
  );
}

// Helper to get badge variant based on work order status
export function getStatusBadgeVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'open':
      return 'info';
    case 'assigned':
      return 'primary';
    case 'in_progress':
      return 'warning';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    default:
      return 'default';
  }
}

// Helper to get badge variant based on priority
export function getPriorityBadgeVariant(priority: string): BadgeProps['variant'] {
  switch (priority) {
    case 'low':
      return 'default';
    case 'medium':
      return 'info';
    case 'high':
      return 'warning';
    case 'critical':
      return 'danger';
    default:
      return 'default';
  }
}

// Helper to get badge variant based on machine status
export function getMachineStatusBadgeVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'operational':
      return 'success';
    case 'maintenance':
      return 'warning';
    case 'stopped':
      return 'danger';
    case 'decommissioned':
      return 'default';
    default:
      return 'default';
  }
}
