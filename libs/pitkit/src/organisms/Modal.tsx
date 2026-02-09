'use client';

import { ReactNode, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { css } from '../../../../styled-system/css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: '400px',
  md: '500px',
  lg: '640px',
  xl: '800px',
};

export function Modal({ isOpen, onClose, children, title, size = 'md' }: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={css({
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4',
      })}
    >
      {/* Backdrop */}
      <div
        className={css({
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        })}
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className={css({
          position: 'relative',
          backgroundColor: 'white',
          borderRadius: 'lg',
          boxShadow: 'xl',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
        })}
        style={{ maxWidth: sizeMap[size] }}
      >
        {title && (
          <div
            className={css({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4',
              borderBottom: '1px solid',
              borderColor: 'gray.200',
            })}
          >
            <h2
              className={css({
                fontSize: 'lg',
                fontWeight: 'semibold',
                color: 'gray.900',
              })}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className={css({
                padding: '2',
                borderRadius: 'md',
                color: 'gray.500',
                _hover: {
                  backgroundColor: 'gray.100',
                },
              })}
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        <div className={css({ padding: '4' })}>{children}</div>
      </div>
    </div>
  );

  // Use portal to render at body level
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
}
