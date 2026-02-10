'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button, Input, Heading, Text } from '@pitkit';
import * as S from './page.styles';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get('callbackUrl');
  const callbackUrl =
    rawCallbackUrl?.startsWith('/') && !rawCallbackUrl.startsWith('//')
      ? rawCallbackUrl
      : null;

  const [tenantSlug, setTenantSlug] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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
        router.push(callbackUrl || `/t/${tenantSlug}`);
      }
    } catch {
      setError('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: '🔧', text: 'Receba e execute ordens de servico' },
    { icon: '📱', text: 'Acesso rapido pelo celular' },
    { icon: '⚡', text: 'Registre tempo, pecas e observacoes' },
  ];

  return (
    <div className={S.container}>
      {/* Branding panel */}
      <div className={S.brandingPanel}>
        <div className={S.decorCircleTop} />
        <div className={S.decorCircleBottom} />

        <div className={S.brandingContent}>
          <h1 className={S.brandingTitle}>manuRaj</h1>
          <p className={S.brandingSubtitle}>
            App operacional para manutentores e operadores.
            Gerencie suas ordens de servico em campo.
          </p>

          <div className={S.featureList}>
            {features.map((item) => (
              <div key={item.text} className={S.featureItem}>
                <span className={S.featureIcon}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className={S.formPanel}>
        <div className={S.formContainer}>
          <div className={S.titleDesktopWrap}>
            <Heading as="h2" className={S.titleDesktopH2}>Acesse sua conta</Heading>
            <Text size="sm" color="muted" className={S.titleDesktopSub}>
              Insira seus dados para entrar no sistema
            </Text>
          </div>

          <div className={S.titleMobileWrap}>
            <Heading as="h2" className={S.titleMobileH2}>Entrar</Heading>
            <Text size="sm" color="muted" className={S.titleMobileSub}>
              Insira seus dados para acessar o sistema
            </Text>
          </div>

          <form onSubmit={handleSubmit} className={S.form}>
            <Input
              label="Empresa"
              placeholder="Codigo da empresa"
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className={S.errorBox}>
                <p className={S.errorText}>{error}</p>
              </div>
            )}

            <Button type="submit" size="lg" fullWidth isLoading={loading}>
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
