'use client';

import { ReactNode } from 'react';
import { styled } from '../../../../styled-system/jsx';
import { cva } from '../../../../styled-system/css';

// ─── Types ───────────────────────────────────────────────────────────────────
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';
export type CardColorScheme = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type CardBorderPosition = 'none' | 'left' | 'top';

// ─── Card styles (cva + compound variants) ──────────────────────────────────
const StyledCard = styled('div', cva({
  base: {
    backgroundColor: 'white',
    borderRadius: 'lg',
    overflow: 'hidden',
  },
  variants: {
    variant: {
      default: { border: '1px solid', borderColor: 'gray.200', boxShadow: 'sm' },
      elevated: { boxShadow: 'md' },
      outlined: { border: '1px solid', borderColor: 'gray.200' },
      filled: {},
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
    colorScheme: {
      brand: {}, success: {}, warning: {}, danger: {}, info: {}, neutral: {},
    },
    borderPosition: {
      none: {}, left: {}, top: {},
    },
  },
  compoundVariants: [
    // filled + colorScheme → colored background
    { variant: 'filled', colorScheme: 'brand', css: { backgroundColor: 'brand.50' } },
    { variant: 'filled', colorScheme: 'success', css: { backgroundColor: 'green.50' } },
    { variant: 'filled', colorScheme: 'warning', css: { backgroundColor: 'orange.50' } },
    { variant: 'filled', colorScheme: 'danger', css: { backgroundColor: 'red.50' } },
    { variant: 'filled', colorScheme: 'info', css: { backgroundColor: 'blue.50' } },
    { variant: 'filled', colorScheme: 'neutral', css: { backgroundColor: 'gray.50' } },
    // borderPosition left + colorScheme
    { borderPosition: 'left', colorScheme: 'brand', css: { borderLeft: '4px solid', borderLeftColor: 'brand.500' } },
    { borderPosition: 'left', colorScheme: 'success', css: { borderLeft: '4px solid', borderLeftColor: 'green.500' } },
    { borderPosition: 'left', colorScheme: 'warning', css: { borderLeft: '4px solid', borderLeftColor: 'orange.500' } },
    { borderPosition: 'left', colorScheme: 'danger', css: { borderLeft: '4px solid', borderLeftColor: 'red.500' } },
    { borderPosition: 'left', colorScheme: 'info', css: { borderLeft: '4px solid', borderLeftColor: 'blue.500' } },
    { borderPosition: 'left', colorScheme: 'neutral', css: { borderLeft: '4px solid', borderLeftColor: 'gray.400' } },
    // borderPosition top + colorScheme
    { borderPosition: 'top', colorScheme: 'brand', css: { borderTop: '4px solid', borderTopColor: 'brand.500' } },
    { borderPosition: 'top', colorScheme: 'success', css: { borderTop: '4px solid', borderTopColor: 'green.500' } },
    { borderPosition: 'top', colorScheme: 'warning', css: { borderTop: '4px solid', borderTopColor: 'orange.500' } },
    { borderPosition: 'top', colorScheme: 'danger', css: { borderTop: '4px solid', borderTopColor: 'red.500' } },
    { borderPosition: 'top', colorScheme: 'info', css: { borderTop: '4px solid', borderTopColor: 'blue.500' } },
    { borderPosition: 'top', colorScheme: 'neutral', css: { borderTop: '4px solid', borderTopColor: 'gray.400' } },
  ],
  defaultVariants: {
    variant: 'default',
    padding: 'md',
    interactive: false,
    borderPosition: 'none',
  },
}));

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
  return (
    <StyledCard
      variant={variant}
      padding={padding}
      interactive={interactive}
      colorScheme={colorScheme}
      borderPosition={borderPosition}
      className={className}
    >
      {children}
    </StyledCard>
  );
}

// ─── CardHeader ──────────────────────────────────────────────────────────────
const StyledCardHeader = styled('div', {
  base: {
    paddingBottom: '4',
    borderBottom: '1px solid',
    borderColor: 'gray.200',
    marginBottom: '4',
  },
});

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <StyledCardHeader className={className}>{children}</StyledCardHeader>;
}

// ─── CardTitle ───────────────────────────────────────────────────────────────
const StyledCardTitle = styled('h3', {
  base: {
    fontSize: 'lg',
    fontWeight: 'semibold',
    color: 'gray.900',
  },
});

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return <StyledCardTitle className={className}>{children}</StyledCardTitle>;
}

// ─── CardContent ─────────────────────────────────────────────────────────────
const StyledCardContent = styled('div', {});

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <StyledCardContent className={className}>{children}</StyledCardContent>;
}

// ─── CardFooter ──────────────────────────────────────────────────────────────
const StyledCardFooter = styled('div', {
  base: {
    paddingTop: '4',
    borderTop: '1px solid',
    borderColor: 'gray.200',
    marginTop: '4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '2',
  },
});

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return <StyledCardFooter className={className}>{children}</StyledCardFooter>;
}
