'use client';

import { styled } from '../../../../styled-system/jsx';
import { cva } from '../../../../styled-system/css';

const SkeletonBase = styled('div', cva({
  base: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'gray.200',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  variants: {
    rounded: {
      true: { borderRadius: 'full' },
      false: { borderRadius: 'md' },
    },
  },
  defaultVariants: {
    rounded: false,
  },
}));

const TextWrapper = styled('div', {
  base: { display: 'flex', flexDirection: 'column', gap: '2' },
});

const CardWrapper = styled('div', {
  base: {
    backgroundColor: 'white',
    borderRadius: 'lg',
    border: '1px solid',
    borderColor: 'gray.200',
    padding: '4',
  },
});

const CardHeader = styled('div', {
  base: { marginBottom: '4' },
});

interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: boolean;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = '20px',
  rounded = false,
  className,
}: SkeletonProps) {
  return (
    <SkeletonBase rounded={rounded} className={className} style={{ width, height }} />
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <TextWrapper>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height="16px" width={i === lines - 1 ? '70%' : '100%'} />
      ))}
    </TextWrapper>
  );
}

export function SkeletonCard() {
  return (
    <CardWrapper>
      <CardHeader>
        <Skeleton height="24px" width="60%" />
      </CardHeader>
      <SkeletonText lines={3} />
    </CardWrapper>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <TextWrapper>
      <Skeleton height="40px" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height="52px" />
      ))}
    </TextWrapper>
  );
}
