import { redirect } from 'next/navigation';
import { auth } from '@manuraj/auth';
import { css } from '../../../styled-system/css';
import Link from 'next/link';

export default async function HomePage() {
  const session = await auth();

  // If logged in, redirect to tenant dashboard
  if (session?.user) {
    redirect(`/t/${session.user.tenantSlug}`);
  }

  // Landing page for non-logged-in users
  return (
    <div
      className={css({
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8',
        backgroundColor: 'gray.50',
        textAlign: 'center',
      })}
    >
      <h1
        className={css({
          fontSize: { base: '3xl', md: '5xl' },
          fontWeight: 'bold',
          color: 'brand.600',
          marginBottom: '4',
        })}
      >
        manuRaj
      </h1>
      <p
        className={css({
          fontSize: { base: 'lg', md: 'xl' },
          color: 'gray.600',
          maxWidth: '600px',
          marginBottom: '8',
        })}
      >
        Sistema de Gestão de Manutenção Industrial.
        Gerencie máquinas, ordens de serviço e planos preventivos de forma simples e eficiente.
      </p>
      <div className={css({ display: 'flex', gap: '4' })}>
        <Link
          href="/login"
          className={css({
            padding: '3 6',
            backgroundColor: 'brand.600',
            color: 'white',
            borderRadius: 'md',
            fontWeight: 'medium',
            _hover: {
              backgroundColor: 'brand.700',
            },
          })}
        >
          Entrar
        </Link>
        <Link
          href="/signup"
          className={css({
            padding: '3 6',
            backgroundColor: 'white',
            color: 'brand.600',
            border: '1px solid',
            borderColor: 'brand.600',
            borderRadius: 'md',
            fontWeight: 'medium',
            _hover: {
              backgroundColor: 'brand.50',
            },
          })}
        >
          Criar Conta
        </Link>
      </div>
    </div>
  );
}
