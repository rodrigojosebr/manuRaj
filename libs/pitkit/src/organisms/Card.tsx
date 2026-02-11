'use client';

import { ReactNode } from 'react';
import { css, cx } from '../../../../styled-system/css';
import { cva } from '../../../../styled-system/css';

// ─── Types ───────────────────────────────────────────────────────────────────
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';
export type CardColorScheme = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type CardBorderPosition = 'none' | 'left' | 'top';

// ─── Card styles (cva) ──────────────────────────────────────────────────────
const cardStyles = cva({
  base: {
    backgroundColor: 'white',
    borderRadius: 'lg',
    overflow: 'hidden',
  },
  variants: {
    variant: {
      default: {
        border: '1px solid',
        borderColor: 'gray.200',
        boxShadow: 'sm',
      },
      elevated: {
        boxShadow: 'md',
      },
      outlined: {
        border: '1px solid',
        borderColor: 'gray.200',
      },
      filled: {
        // bg set dynamically via colorScheme
      },
    },
    padding: {
      none: { padding: '0' },
      sm: { padding: '3' },
      md: { padding: '4' },
      lg: { padding: '6' },
    },
    interactive: {
      true: {
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, transform 0.1s',
        _hover: { boxShadow: 'md' },
        _active: { transform: 'scale(0.98)' },
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
    interactive: false,
  },
});

// ─── Color scheme helpers ────────────────────────────────────────────────────
const filledBgMap: Record<CardColorScheme, string> = {
  brand: 'brand.50',
  success: 'green.50',
  warning: 'orange.50',
  danger: 'red.50',
  info: 'blue.50',
  neutral: 'gray.50',
};

const borderColorMap: Record<CardColorScheme, string> = {
  brand: 'brand.500',
  success: 'green.500',
  warning: 'orange.500',
  danger: 'red.500',
  info: 'blue.500',
  neutral: 'gray.400',
};

function getColorSchemeClass(
  variant: CardVariant | undefined,
  colorScheme: CardColorScheme | undefined,
  borderPosition: CardBorderPosition | undefined
): string {
  if (!colorScheme) return '';

  const classes: string[] = [];

  // Filled variant → colored background
  if (variant === 'filled') {
    classes.push(css({ backgroundColor: filledBgMap[colorScheme] }));
  }

  // Border accent
  if (borderPosition === 'left') {
    classes.push(css({ borderLeft: '4px solid', borderLeftColor: borderColorMap[colorScheme] }));
  } else if (borderPosition === 'top') {
    classes.push(css({ borderTop: '4px solid', borderTopColor: borderColorMap[colorScheme] }));
  }

  return classes.join(' ');
}

// ─── Card ────────────────────────────────────────────────────────────────────
interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  colorScheme?: CardColorScheme;
  interactive?: boolean;
  borderPosition?: CardBorderPosition;
}

export function Card({
  children,
  className,
  variant = 'default',
  padding = 'md',
  colorScheme,
  interactive = false,
  borderPosition = 'none',
}: CardProps) {
  const colorClass = getColorSchemeClass(variant, colorScheme, borderPosition);

  return (
    <div className={cx(cardStyles({ variant, padding, interactive }), colorClass, className)}>
      {children}
    </div>
  );
}

// ─── CardHeader ──────────────────────────────────────────────────────────────
interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div
      className={cx(
        css({
          paddingBottom: '4',
          borderBottom: '1px solid',
          borderColor: 'gray.200',
          marginBottom: '4',
        }),
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── CardTitle ───────────────────────────────────────────────────────────────
interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3
      className={cx(
        css({
          fontSize: 'lg',
          fontWeight: 'semibold',
          color: 'gray.900',
        }),
        className
      )}
    >
      {children}
    </h3>
  );
}

// ─── CardContent ─────────────────────────────────────────────────────────────
interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={className}>{children}</div>;
}

// ─── CardFooter ──────────────────────────────────────────────────────────────
interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={cx(
        css({
          paddingTop: '4',
          borderTop: '1px solid',
          borderColor: 'gray.200',
          marginTop: '4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '2',
        }),
        className
      )}
    >
      {children}
    </div>
  );
}
