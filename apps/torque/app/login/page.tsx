'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { css } from '../../../../styled-system/css';
import { Button, Input } from '@manuraj/ui';

export default function LoginPage() {
  const router = useRouter();
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
        router.push(`/t/${tenantSlug}`);
      }
    } catch {
      setError('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={css({
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { base: 'column', lg: 'row' },
      })}
    >
      {/* Branding panel */}
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: { base: '8', md: '12', lg: '16' },
          backgroundColor: 'brand.700',
          color: 'white',
          width: { base: '100%', lg: '50%' },
          minHeight: { base: 'auto', lg: '100vh' },
          position: 'relative',
          overflow: 'hidden',
        })}
      >
        {/* Background decoration */}
        <div
          className={css({
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: 'full',
            backgroundColor: 'brand.600',
            opacity: 0.3,
            pointerEvents: 'none',
          })}
        />
        <div
          className={css({
            position: 'absolute',
            bottom: '-15%',
            left: '-10%',
            width: '300px',
            height: '300px',
            borderRadius: 'full',
            backgroundColor: 'brand.800',
            opacity: 0.3,
            pointerEvents: 'none',
          })}
        />

        <div
          className={css({
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            maxWidth: '440px',
          })}
        >
          <h1
            className={css({
              fontSize: { base: '3xl', md: '4xl', lg: '5xl' },
              fontWeight: 'bold',
              letterSpacing: '-0.025em',
              marginBottom: '4',
            })}
          >
            manuRaj
          </h1>
          <p
            className={css({
              fontSize: { base: 'md', md: 'lg' },
              opacity: 0.9,
              lineHeight: '1.6',
              marginBottom: '8',
            })}
          >
            App operacional para manutentores e operadores.
            Gerencie suas ordens de servico em campo.
          </p>

          <div
            className={css({
              display: { base: 'none', lg: 'flex' },
              flexDirection: 'column',
              gap: '4',
              marginTop: '4',
            })}
          >
            {[
              { icon: '🔧', text: 'Receba e execute ordens de servico' },
              { icon: '📱', text: 'Acesso rapido pelo celular' },
              { icon: '⚡', text: 'Registre tempo, pecas e observacoes' },
            ].map((item) => (
              <div
                key={item.text}
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 'lg',
                  padding: '3',
                  paddingX: '4',
                  fontSize: 'sm',
                })}
              >
                <span className={css({ fontSize: 'lg', flexShrink: 0 })}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: { base: '6', md: '8', lg: '16' },
          width: { base: '100%', lg: '50%' },
          minHeight: { base: 'auto', lg: '100vh' },
          backgroundColor: 'white',
        })}
      >
        <div
          className={css({
            width: '100%',
            maxWidth: '400px',
          })}
        >
          <div
            className={css({
              display: { base: 'none', lg: 'block' },
              marginBottom: '2',
            })}
          >
            <h2
              className={css({
                fontSize: '2xl',
                fontWeight: 'bold',
                color: 'gray.900',
              })}
            >
              Acesse sua conta
            </h2>
            <p
              className={css({
                fontSize: 'sm',
                color: 'gray.500',
                marginTop: '1',
              })}
            >
              Insira seus dados para entrar no sistema
            </p>
          </div>

          <div
            className={css({
              display: { base: 'block', lg: 'none' },
              marginBottom: '2',
            })}
          >
            <h2
              className={css({
                fontSize: 'xl',
                fontWeight: 'bold',
                color: 'gray.900',
              })}
            >
              Entrar
            </h2>
            <p
              className={css({
                fontSize: 'sm',
                color: 'gray.500',
                marginTop: '1',
              })}
            >
              Insira seus dados para acessar o sistema
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '5',
              marginTop: '6',
            })}
          >
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
              <div
                className={css({
                  backgroundColor: '#fef2f2',
                  border: '1px solid',
                  borderColor: '#fecaca',
                  borderRadius: 'md',
                  padding: '3',
                  paddingX: '4',
                })}
              >
                <p className={css({ color: 'danger.600', fontSize: 'sm', textAlign: 'center' })}>
                  {error}
                </p>
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
