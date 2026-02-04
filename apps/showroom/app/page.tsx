import Link from 'next/link';
import { css } from '../../../styled-system/css';

export default function LandingPage() {
  return (
    <div>
      {/* Header/Navbar */}
      <header className={css({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid',
        borderColor: 'gray.100',
        zIndex: 50,
      })}>
        <div className={css({
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '4',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        })}>
          <Link href="/" className={css({
            fontSize: 'xl',
            fontWeight: 'bold',
            color: 'brand.600',
            textDecoration: 'none',
          })}>
            manuRaj
          </Link>

          <nav className={css({ display: 'flex', gap: '6', alignItems: 'center' })}>
            <Link href="#features" className={css({
              color: 'gray.600',
              textDecoration: 'none',
              fontSize: 'sm',
              _hover: { color: 'brand.600' },
            })}>
              Recursos
            </Link>
            <Link href="#pricing" className={css({
              color: 'gray.600',
              textDecoration: 'none',
              fontSize: 'sm',
              _hover: { color: 'brand.600' },
            })}>
              Planos
            </Link>
            <Link href="/login" className={css({
              color: 'gray.600',
              textDecoration: 'none',
              fontSize: 'sm',
              _hover: { color: 'brand.600' },
            })}>
              Entrar
            </Link>
            <Link href="/signup" className={css({
              backgroundColor: 'brand.600',
              color: 'white',
              padding: '2 4',
              borderRadius: 'lg',
              fontSize: 'sm',
              fontWeight: 'medium',
              textDecoration: 'none',
              _hover: { backgroundColor: 'brand.700' },
            })}>
              Começar Grátis
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className={css({
        paddingTop: '32',
        paddingBottom: '20',
        paddingX: '4',
        background: 'linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)',
      })}>
        <div className={css({
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
        })}>
          <h1 className={css({
            fontSize: { base: '3xl', md: '5xl' },
            fontWeight: 'bold',
            color: 'gray.900',
            marginBottom: '6',
            lineHeight: '1.2',
          })}>
            Gestão de Manutenção
            <br />
            <span className={css({ color: 'brand.600' })}>Simples e Eficiente</span>
          </h1>

          <p className={css({
            fontSize: { base: 'lg', md: 'xl' },
            color: 'gray.600',
            maxWidth: '600px',
            margin: '0 auto',
            marginBottom: '8',
          })}>
            Sistema completo para gerenciar máquinas, ordens de serviço e equipes de manutenção.
            Reduza paradas não planejadas e aumente a vida útil dos seus equipamentos.
          </p>

          <div className={css({ display: 'flex', gap: '4', justifyContent: 'center', flexWrap: 'wrap' })}>
            <Link href="/signup" className={css({
              backgroundColor: 'brand.600',
              color: 'white',
              padding: '4 8',
              borderRadius: 'xl',
              fontSize: 'lg',
              fontWeight: 'semibold',
              textDecoration: 'none',
              _hover: { backgroundColor: 'brand.700' },
            })}>
              Começar Grátis
            </Link>
            <Link href="#features" className={css({
              backgroundColor: 'white',
              color: 'brand.600',
              padding: '4 8',
              borderRadius: 'xl',
              fontSize: 'lg',
              fontWeight: 'semibold',
              textDecoration: 'none',
              border: '2px solid',
              borderColor: 'brand.600',
              _hover: { backgroundColor: 'brand.50' },
            })}>
              Ver Recursos
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={css({
        paddingY: '20',
        paddingX: '4',
      })}>
        <div className={css({ maxWidth: '1200px', margin: '0 auto' })}>
          <h2 className={css({
            fontSize: '3xl',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '4',
          })}>
            Tudo que você precisa
          </h2>
          <p className={css({
            textAlign: 'center',
            color: 'gray.600',
            marginBottom: '12',
            maxWidth: '600px',
            margin: '0 auto 48px',
          })}>
            Ferramentas completas para gestão de manutenção industrial
          </p>

          <div className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
            gap: '8',
          })}>
            <FeatureCard
              icon="⚙️"
              title="Gestão de Máquinas"
              description="Cadastre equipamentos com informações técnicas, manuais e histórico completo de manutenções."
            />
            <FeatureCard
              icon="📋"
              title="Ordens de Serviço"
              description="Crie, atribua e acompanhe OS corretivas e preventivas. Controle tempo e peças utilizadas."
            />
            <FeatureCard
              icon="📅"
              title="Planos Preventivos"
              description="Configure manutenções periódicas automáticas com checklists personalizados."
            />
            <FeatureCard
              icon="👥"
              title="Gestão de Equipe"
              description="Controle acessos por função: operadores, manutentores e supervisores."
            />
            <FeatureCard
              icon="📊"
              title="Métricas e Relatórios"
              description="Dashboard com indicadores de performance, tempo médio de reparo e muito mais."
            />
            <FeatureCard
              icon="📱"
              title="App Mobile"
              description="Acesso via tablet ou celular para manutentores em campo."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={css({
        paddingY: '20',
        paddingX: '4',
        backgroundColor: 'gray.50',
      })}>
        <div className={css({ maxWidth: '1200px', margin: '0 auto' })}>
          <h2 className={css({
            fontSize: '3xl',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '4',
          })}>
            Planos
          </h2>
          <p className={css({
            textAlign: 'center',
            color: 'gray.600',
            marginBottom: '12',
          })}>
            Comece grátis e escale conforme sua necessidade
          </p>

          <div className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
            gap: '8',
            maxWidth: '900px',
            margin: '0 auto',
          })}>
            <PricingCard
              name="Free"
              price="R$ 0"
              description="Para pequenas operações"
              features={[
                'Até 10 máquinas',
                'Até 5 usuários',
                'OS ilimitadas',
                'Suporte por email',
              ]}
              cta="Começar Grátis"
              href="/signup"
            />
            <PricingCard
              name="Pro"
              price="R$ 199"
              period="/mês"
              description="Para operações em crescimento"
              features={[
                'Até 100 máquinas',
                'Até 25 usuários',
                'Planos preventivos',
                'Relatórios avançados',
                'Suporte prioritário',
              ]}
              cta="Começar Trial"
              href="/signup?plan=pro"
              highlighted
            />
            <PricingCard
              name="Enterprise"
              price="Sob consulta"
              description="Para grandes indústrias"
              features={[
                'Máquinas ilimitadas',
                'Usuários ilimitados',
                'API de integração',
                'SSO / LDAP',
                'Suporte dedicado',
              ]}
              cta="Falar com Vendas"
              href="/contact"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={css({
        paddingY: '20',
        paddingX: '4',
        backgroundColor: 'brand.600',
      })}>
        <div className={css({
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
        })}>
          <h2 className={css({
            fontSize: '3xl',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '4',
          })}>
            Pronto para começar?
          </h2>
          <p className={css({
            color: 'brand.100',
            marginBottom: '8',
            fontSize: 'lg',
          })}>
            Crie sua conta gratuita em menos de 2 minutos.
          </p>
          <Link href="/signup" className={css({
            display: 'inline-block',
            backgroundColor: 'white',
            color: 'brand.600',
            padding: '4 8',
            borderRadius: 'xl',
            fontSize: 'lg',
            fontWeight: 'semibold',
            textDecoration: 'none',
            _hover: { backgroundColor: 'brand.50' },
          })}>
            Criar Conta Grátis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={css({
        paddingY: '12',
        paddingX: '4',
        backgroundColor: 'gray.900',
        color: 'gray.400',
      })}>
        <div className={css({
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: { base: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '4',
        })}>
          <p className={css({ fontWeight: 'bold', color: 'white' })}>manuRaj</p>
          <p className={css({ fontSize: 'sm' })}>
            © 2025 manuRaj. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className={css({
      padding: '6',
      backgroundColor: 'white',
      borderRadius: 'xl',
      boxShadow: 'sm',
      border: '1px solid',
      borderColor: 'gray.100',
    })}>
      <span className={css({ fontSize: '3xl', display: 'block', marginBottom: '4' })}>{icon}</span>
      <h3 className={css({ fontSize: 'xl', fontWeight: 'semibold', marginBottom: '2' })}>{title}</h3>
      <p className={css({ color: 'gray.600' })}>{description}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  href,
  highlighted,
}: {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
}) {
  return (
    <div className={css({
      padding: '8',
      backgroundColor: highlighted ? 'brand.600' : 'white',
      color: highlighted ? 'white' : 'gray.900',
      borderRadius: 'xl',
      boxShadow: highlighted ? 'xl' : 'sm',
      border: highlighted ? 'none' : '1px solid',
      borderColor: 'gray.200',
      transform: highlighted ? 'scale(1.05)' : 'none',
    })}>
      <h3 className={css({ fontSize: 'xl', fontWeight: 'semibold', marginBottom: '2' })}>{name}</h3>
      <p className={css({
        color: highlighted ? 'brand.100' : 'gray.500',
        fontSize: 'sm',
        marginBottom: '4',
      })}>
        {description}
      </p>
      <p className={css({ fontSize: '3xl', fontWeight: 'bold', marginBottom: '6' })}>
        {price}
        {period && <span className={css({ fontSize: 'lg', fontWeight: 'normal' })}>{period}</span>}
      </p>
      <ul className={css({ marginBottom: '6' })}>
        {features.map((feature, i) => (
          <li key={i} className={css({
            display: 'flex',
            alignItems: 'center',
            gap: '2',
            marginBottom: '2',
            fontSize: 'sm',
          })}>
            <span>✓</span> {feature}
          </li>
        ))}
      </ul>
      <Link href={href} className={css({
        display: 'block',
        textAlign: 'center',
        padding: '3',
        borderRadius: 'lg',
        fontWeight: 'semibold',
        textDecoration: 'none',
        backgroundColor: highlighted ? 'white' : 'brand.600',
        color: highlighted ? 'brand.600' : 'white',
        _hover: { opacity: 0.9 },
      })}>
        {cta}
      </Link>
    </div>
  );
}
