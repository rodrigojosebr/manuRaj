'use client';

import { Button } from '@pitkit';
import { css } from '../../../../../styled-system/css';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className={css({
        padding: 'page',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '4',
        textAlign: 'center',
      })}
    >
      <span className={css({ fontSize: '3xl' })}>⚠️</span>
      <h2 className={css({ fontSize: 'lg', fontWeight: 'semibold', color: 'gray.900' })}>
        Algo deu errado
      </h2>
      <p className={css({ fontSize: 'sm', color: 'gray.500', maxWidth: '320px' })}>
        Ocorreu um erro inesperado. Tente novamente.
      </p>
      <Button variant="primary" onClick={reset}>
        Tentar novamente
      </Button>
    </div>
  );
}
