import Link from 'next/link';
import { EmptyState, Button } from '@pitkit';
import { css } from '../../../../../styled-system/css';

export default function NotFound() {
  return (
    <div
      className={css({
        padding: 'page',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
      })}
    >
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
    </div>
  );
}
