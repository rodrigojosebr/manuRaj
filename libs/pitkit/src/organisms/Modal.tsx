'use client';

import { ReactNode, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { styled } from '../../../../styled-system/jsx';

const Overlay = styled('div', {
  base: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4',
  },
});

const Backdrop = styled('div', {
  base: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

const ModalPanel = styled('div', {
  base: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 'lg',
    boxShadow: 'xl',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
});

const ModalHeaderWrapper = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4',
    borderBottom: '1px solid',
    borderColor: 'gray.200',
  },
});

const ModalTitle = styled('h2', {
  base: {
    fontSize: 'lg',
    fontWeight: 'semibold',
    color: 'gray.900',
  },
});

const CloseButton = styled('button', {
  base: {
    padding: '2',
    borderRadius: 'md',
    color: 'gray.500',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    _hover: { backgroundColor: 'gray.100' },
  },
});

const ModalBody = styled('div', {
  base: { padding: '4' },
});

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
    <Overlay>
      <Backdrop onClick={onClose} />
      <ModalPanel style={{ maxWidth: sizeMap[size] }}>
        {title && (
          <ModalHeaderWrapper>
            <ModalTitle>{title}</ModalTitle>
            <CloseButton onClick={onClose}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </CloseButton>
          </ModalHeaderWrapper>
        )}
        <ModalBody>{children}</ModalBody>
      </ModalPanel>
    </Overlay>
  );

  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
}
