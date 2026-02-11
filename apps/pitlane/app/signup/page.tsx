'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { css } from '../../../../styled-system/css';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@pitkit';

export default function SignupPage() {
  const router = useRouter();

  const [tenantName, setTenantName] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-generate slug from tenant name
  const handleTenantNameChange = (value: string) => {
    setTenantName(value);
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setTenantSlug(slug);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantName,
          tenantSlug,
          userName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Erro ao criar conta');
        return;
      }

      // Redirect to login with success message
      router.push(`/login?message=Conta criada com sucesso!`);
    } catch {
      setError('Erro ao criar conta');
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
      <Card className={css({ width: '100%', maxWidth: '450px' })}>
        <CardHeader>
          <CardTitle className={css({ textAlign: 'center' })}>
            <span className={css({ color: 'brand.600', fontSize: '2xl', fontWeight: 'bold' })}>
              manuRaj
            </span>
          </CardTitle>
          <p className={css({ textAlign: 'center', color: 'gray.600', marginTop: '2' })}>
            Crie sua conta e comece a gerenciar a manutenção
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
            <Input
              label="Nome da empresa"
              placeholder="Minha Empresa Ltda"
              value={tenantName}
              onChange={(e) => handleTenantNameChange(e.target.value)}
              required
            />
            <Input
              label="Identificador (URL)"
              placeholder="minha-empresa"
              value={tenantSlug}
              onChange={(e) => setTenantSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              helperText="Será usado para acessar: manuraj.com/t/minha-empresa"
              required
            />
            <Input
              label="Seu nome"
              placeholder="João Silva"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
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
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />

            {error && (
              <p className={css({ color: 'danger.500', fontSize: 'sm', textAlign: 'center' })}>
                {error}
              </p>
            )}

            <Button type="submit" fullWidth isLoading={isLoading}>
              Criar conta
            </Button>

            <p className={css({ textAlign: 'center', fontSize: 'sm', color: 'gray.600' })}>
              Já tem uma conta?{' '}
              <Link
                href="/login"
                className={css({ color: 'brand.600', _hover: { textDecoration: 'underline' } })}
              >
                Faça login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
