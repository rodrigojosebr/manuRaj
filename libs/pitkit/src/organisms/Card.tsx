'use client';

import { ReactNode } from 'react';
import { css } from '../../../../styled-system/css';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = {
  none: '0',
  sm: '3',
  md: '4',
  lg: '6',
};

export function Card({ children, className, padding = 'md' }: CardProps) {
  return (
    <div
      className={`${css({
        backgroundColor: 'white',
        borderRadius: 'lg',
        border: '1px solid',
        borderColor: 'gray.200',
        boxShadow: 'sm',
        padding: paddingMap[padding],
      })} ${className || ''}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div
      className={`${css({
        paddingBottom: '4',
        borderBottom: '1px solid',
        borderColor: 'gray.200',
        marginBottom: '4',
      })} ${className || ''}`}
    >
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3
      className={`${css({
        fontSize: 'lg',
        fontWeight: 'semibold',
        color: 'gray.900',
      })} ${className || ''}`}
    >
      {children}
    </h3>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={className}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={`${css({
        paddingTop: '4',
        borderTop: '1px solid',
        borderColor: 'gray.200',
        marginTop: '4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '2',
      })} ${className || ''}`}
    >
      {children}
    </div>
  );
}
