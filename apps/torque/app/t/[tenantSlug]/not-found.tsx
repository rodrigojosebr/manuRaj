import Link from 'next/link';
import { EmptyState, Button } from '@pitkit';
import { styled } from '../../../../../styled-system/jsx';

const NotFoundPage = styled('div', {
  base: {
    padding: 'page',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
});

export default function NotFound() {
  return (
    <NotFoundPage>
      <EmptyState
        icon="search"
        title="Pagina nao encontrada"
        description="A pagina que voce procura nao existe ou foi movida."
        action={
          <Link href="." style={{ textDecoration: 'none' }}>
            <Button variant="primary">Voltar ao inicio</Button>
          </Link>
        }
      />
    </NotFoundPage>
  );
}
