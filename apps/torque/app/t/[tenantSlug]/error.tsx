'use client';

import { Button } from '@pitkit';
import { styled } from '../../../../../styled-system/jsx';

const ErrorPage = styled('div', {
  base: {
    padding: 'page',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '4',
    textAlign: 'center',
  },
});
const ErrorIcon = styled('span', { base: { fontSize: '3xl' } });
const ErrorTitle = styled('h2', { base: { fontSize: 'lg', fontWeight: 'semibold', color: 'gray.900' } });
const ErrorMessage = styled('p', { base: { fontSize: 'sm', color: 'gray.500', maxWidth: '320px' } });

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPage>
      <ErrorIcon>⚠️</ErrorIcon>
      <ErrorTitle>Algo deu errado</ErrorTitle>
      <ErrorMessage>Ocorreu um erro inesperado. Tente novamente.</ErrorMessage>
      <Button variant="primary" onClick={reset}>
        Tentar novamente
      </Button>
    </ErrorPage>
  );
}
