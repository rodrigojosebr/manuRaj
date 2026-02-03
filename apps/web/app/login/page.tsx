'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { css } from '../../../../styled-system/css';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@manuraj/ui';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const [tenantSlug, setTenantSlug] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        tenantSlug,
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Credenciais inválidas');
      } else {
        // Redirect to tenant dashboard
        router.push(callbackUrl || `/t/${tenantSlug}`);
      }
    } catch {
      setError('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={css({
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4',
        backgroundColor: 'gray.50',
      })}
    >
      <Card className={css({ width: '100%', maxWidth: '400px' })}>
        <CardHeader>
          <CardTitle className={css({ textAlign: 'center' })}>
            <span className={css({ color: 'brand.600', fontSize: '2xl', fontWeight: 'bold' })}>
              manuRaj
            </span>
          </CardTitle>
          <p className={css({ textAlign: 'center', color: 'gray.600', marginTop: '2' })}>
            Faça login para acessar o sistema
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
            <Input
              label="Identificador da empresa"
              placeholder="ex: minha-empresa"
              value={tenantSlug}
              onChange={(e) => setTenantSlug(e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Senha"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className={css({ color: 'danger.500', fontSize: 'sm', textAlign: 'center' })}>
                {error}
              </p>
            )}

            <Button type="submit" fullWidth isLoading={isLoading}>
              Entrar
            </Button>

            <p className={css({ textAlign: 'center', fontSize: 'sm', color: 'gray.600' })}>
              Não tem uma conta?{' '}
              <Link
                href="/signup"
                className={css({ color: 'brand.600', _hover: { textDecoration: 'underline' } })}
              >
                Cadastre sua empresa
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
