'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button, Input } from '@pitkit';
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
    <S.Container>
      {/* Branding panel */}
      <S.BrandingPanel>
        <S.DecorCircleTop />
        <S.DecorCircleBottom />

        <S.BrandingContent>
          <S.BrandingTitle>manuRaj</S.BrandingTitle>
          <S.BrandingSubtitle>
            App operacional para manutentores e operadores.
            Gerencie suas ordens de servico em campo.
          </S.BrandingSubtitle>

          <S.FeatureList>
            {features.map((item) => (
              <S.FeatureItem key={item.text}>
                <S.FeatureIcon>{item.icon}</S.FeatureIcon>
                <span>{item.text}</span>
              </S.FeatureItem>
            ))}
          </S.FeatureList>
        </S.BrandingContent>
      </S.BrandingPanel>

      {/* Form panel */}
      <S.FormPanel>
        <S.FormContainer>
          <S.TitleDesktopWrap>
            <S.TitleDesktopH2>Acesse sua conta</S.TitleDesktopH2>
            <S.TitleDesktopSub>
              Insira seus dados para entrar no sistema
            </S.TitleDesktopSub>
          </S.TitleDesktopWrap>

          <S.TitleMobileWrap>
            <S.TitleMobileH2>Entrar</S.TitleMobileH2>
            <S.TitleMobileSub>
              Insira seus dados para acessar o sistema
            </S.TitleMobileSub>
          </S.TitleMobileWrap>

          <S.Form onSubmit={handleSubmit}>
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
              <S.ErrorBox>
                <S.ErrorText>{error}</S.ErrorText>
              </S.ErrorBox>
            )}

            <Button type="submit" size="lg" fullWidth isLoading={loading}>
              Entrar
            </Button>
          </S.Form>
        </S.FormContainer>
      </S.FormPanel>
    </S.Container>
  );
}
