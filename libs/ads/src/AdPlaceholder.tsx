'use client';

import { css } from '../../../styled-system/css';

interface AdPlaceholderProps {
  width?: string;
  height?: string;
  label?: string;
  showBranding?: boolean;
}

/**
 * Placeholder component for ads
 * Used during development, when ads are loading, or on error
 */
export function AdPlaceholder({
  width = '100%',
  height = '250px',
  label = 'Espaço Publicitário',
  showBranding = true,
}: AdPlaceholderProps) {
  const isProduction = process.env.NODE_ENV === 'production';

  // In production, show minimal placeholder
  if (isProduction) {
    return (
      <div
        className={css({
          width,
          height,
          minHeight: height,
          backgroundColor: 'gray.50',
        })}
        aria-hidden="true"
      />
    );
  }

  // In development, show visible placeholder
  return (
    <div
      className={css({
        width,
        height,
        minHeight: height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'gray.100',
        border: '2px dashed',
        borderColor: 'gray.300',
        borderRadius: 'md',
        color: 'gray.500',
        fontSize: 'sm',
        fontWeight: 'medium',
        textAlign: 'center',
        padding: '4',
        gap: '2',
      })}
    >
      <span>{label}</span>
      {showBranding && (
        <span className={css({ fontSize: 'xs', color: 'gray.400' })}>
          {width} x {height}
        </span>
      )}
    </div>
  );
}
