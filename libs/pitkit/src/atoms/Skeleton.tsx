'use client';

import { css } from '../../../../styled-system/css';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: boolean;
}

export function Skeleton({
  width = '100%',
  height = '20px',
  className,
  rounded = false,
}: SkeletonProps) {
  return (
    <div
      className={`${css({
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'gray.200',
        borderRadius: rounded ? 'full' : 'md',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      })} ${className || ''}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="16px"
          width={i === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div
      className={css({
        backgroundColor: 'white',
        borderRadius: 'lg',
        border: '1px solid',
        borderColor: 'gray.200',
        padding: '4',
      })}
    >
      <Skeleton height="24px" width="60%" className={css({ marginBottom: '4' })} />
      <SkeletonText lines={3} />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
      <Skeleton height="40px" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height="52px" />
      ))}
    </div>
  );
}
