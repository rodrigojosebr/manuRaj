'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input } from '@pitkit';
import * as S from './page.styles';

const FEATURES = [
  { icon: '⚙️', text: 'Cadastro completo de máquinas e equipamentos' },
  { icon: '📋', text: 'Ordens corretivas, preventivas e solicitações' },
  { icon: '👥', text: 'Multi-tenant com controle de acesso por cargo' },
];

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
  const callbackUrl = rawCallbackUrl?.startsWith('/') && !rawCallbackUrl.startsWith('//') ? rawCallbackUrl : null;
  const successMessage = searchParams.get('message');

  const [tenantSlug, setTenantSlug] = useState(searchParams.get('tenant') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        router.push(callbackUrl || `/t/${tenantSlug}`);
      }
    } catch {
      setError('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.Wrapper>
      {/* Branding panel */}
      <S.BrandPanel>
        <S.BlobTop />
        <S.BlobBottom />

        <S.BrandContent>
          <S.BrandTitle>manuRaj</S.BrandTitle>
          <S.BrandText>
            Gestão de manutenção industrial inteligente.
            Controle suas máquinas, equipes e ordens de serviço em um só lugar.
          </S.BrandText>

          <S.FeatureList>
            {FEATURES.map((item) => (
              <S.FeatureItem key={item.text}>
                <S.FeatureIcon>{item.icon}</S.FeatureIcon>
                <span>{item.text}</span>
              </S.FeatureItem>
            ))}
          </S.FeatureList>
        </S.BrandContent>
      </S.BrandPanel>

      {/* Form panel */}
      <S.FormPanel>
        <S.FormCard>
          <S.HeadingDesktop>
            <S.Title size="desktop">Acesse sua conta</S.Title>
            <S.Subtitle>Insira seus dados para entrar no sistema</S.Subtitle>
          </S.HeadingDesktop>

          <S.HeadingMobile>
            <S.Title size="mobile">Entrar</S.Title>
            <S.Subtitle>Insira seus dados para acessar o sistema</S.Subtitle>
          </S.HeadingMobile>

          <S.Form onSubmit={handleSubmit}>
            {successMessage && (
              <S.Alert tone="success">
                <S.AlertText tone="success">{successMessage}</S.AlertText>
              </S.Alert>
            )}

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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <S.Alert tone="danger">
                <S.AlertText tone="danger">{error}</S.AlertText>
              </S.Alert>
            )}

            <Button type="submit" size="lg" fullWidth isLoading={isLoading}>
              Entrar
            </Button>

            <S.SignupHint>
              Não tem uma conta?{' '}
              <S.SignupLink href="/signup">Cadastre sua empresa</S.SignupLink>
            </S.SignupHint>
          </S.Form>
        </S.FormCard>
      </S.FormPanel>
    </S.Wrapper>
  );
}
