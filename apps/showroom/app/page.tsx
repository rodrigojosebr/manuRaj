'use client';

import { styled } from '../../../styled-system/jsx';

// Components
import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { SectionHeader } from './components/SectionHeader/SectionHeader';
import { StatCard } from './components/StatCard/StatCard';
import { FeatureCard } from './components/FeatureCard/FeatureCard';
import { StepCard } from './components/StepCard/StepCard';
import { TestimonialCard } from './components/TestimonialCard/TestimonialCard';
import { PricingCard } from './components/PricingCard/PricingCard';
import { FaqItem } from './components/FaqItem/FaqItem';
import { ContactForm } from './components/ContactForm/ContactForm';
import { Footer } from './components/Footer/Footer';

// ─── Constants ───

const PITLANE_URL = process.env.NEXT_PUBLIC_PITLANE_URL || 'http://localhost:3000';
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Tenho interesse no manuRaj.')}`;
const SIGNUP_URL = `${PITLANE_URL}/signup`;

const NAV_LINKS = [
  { label: 'Recursos', href: '#features' },
  { label: 'Planos', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contato', href: '#contato' },
];

const HERO_FLOATING_BADGES = [
  { icon: '📋', top: '10%', left: '5%', delay: '0s' },
  { icon: '📊', top: '5%', right: '10%', delay: '1s' },
  { icon: '📱', bottom: '15%', left: '0%', delay: '2s' },
  { icon: '👥', bottom: '5%', right: '5%', delay: '0.5s' },
];

const STATS = [
  { stat: '35%', label: 'das paradas industriais são por falhas que poderiam ser prevenidas', accent: '#ef4444' },
  { stat: 'R$ 50 mil', label: 'é o custo médio por hora de parada não planejada', accent: '#f59e0b' },
  { stat: '3x mais', label: 'caro é o reparo corretivo comparado à manutenção preventiva', accent: '#2563eb' },
];

const FEATURES = [
  { icon: '⚙️', title: 'Gestão de Máquinas', description: 'Cadastre equipamentos com dados técnicos, manuais, desenhos e histórico completo de manutenções.' },
  { icon: '📋', title: 'Ordens de Serviço', description: 'Crie, atribua e acompanhe OS corretivas e preventivas. Controle tempo e peças utilizadas.' },
  { icon: '📅', title: 'Planos Preventivos', description: 'Configure manutenções periódicas automáticas com checklists personalizados por máquina.' },
  { icon: '👥', title: 'Gestão de Equipe', description: 'Controle acessos por função: operadores, manutentores e supervisores com permissões granulares.' },
  { icon: '📊', title: 'Métricas e Relatórios', description: 'Dashboard com indicadores de performance, MTTR, disponibilidade e backlog de OS.' },
  { icon: '📱', title: 'App Mobile (Torque)', description: 'App mobile-first para manutentores em campo. Receba OS, registre atividades e consulte máquinas.' },
];

const STEPS = [
  { number: '1', title: 'Cadastre sua empresa', description: 'Crie sua conta gratuita em menos de 2 minutos. Sem cartão de crédito.' },
  { number: '2', title: 'Registre suas máquinas', description: 'Adicione seus equipamentos com informações técnicas e documentos.' },
  { number: '3', title: 'Gerencie de qualquer lugar', description: 'Crie ordens de serviço, acompanhe manutenções e tome decisões com dados.' },
];

const TESTIMONIALS = [
  { name: 'Carlos Mendes', role: 'Supervisor de Manutenção', company: 'Metalúrgica São Paulo', initials: 'CM', color: '#2563eb', text: 'Antes do manuRaj, a gente controlava tudo em planilha. Hoje temos visibilidade total das manutenções e reduzimos 40% das paradas não planejadas.' },
  { name: 'Ana Rodrigues', role: 'Gerente Industrial', company: 'Indústria Alimentos BR', initials: 'AR', color: '#059669', text: 'A facilidade de uso impressiona. Nossos manutentores em campo usam o Torque no celular e as OS são atualizadas em tempo real. Muito prático.' },
  { name: 'Roberto Lima', role: 'Diretor de Operações', company: 'Plásticos Nacional', initials: 'RL', color: '#7c3aed', text: 'O plano gratuito já atendeu nossa operação menor. Quando crescemos, migrar para o Pro foi natural. Excelente custo-benefício.' },
];

const PRICING_PLANS = [
  { name: 'Grátis', price: 'R$ 0', period: '', description: 'Para pequenas operações', features: ['Até 30 máquinas', 'Usuários ilimitados', 'OS ilimitadas', 'Planos preventivos', 'App mobile (Torque)', 'Exibe anúncios'], cta: 'Começar Grátis', href: SIGNUP_URL, position: 'left' as const },
  { name: 'Profissional', price: 'R$ 1,00', period: '/máquina/mês', description: 'Para operações em crescimento', features: ['31 a 100 máquinas', 'Usuários ilimitados', 'OS ilimitadas', 'Sem anúncios', 'Planos preventivos', 'Relatórios avançados', 'Suporte prioritário'], cta: 'Começar Grátis', href: SIGNUP_URL, highlighted: true, badge: 'Popular', position: 'center' as const },
  { name: 'Enterprise', price: 'R$ 0,80', period: '/máquina/mês', description: 'Para grandes indústrias', features: ['100+ máquinas', 'Usuários ilimitados', 'OS ilimitadas', 'Sem anúncios', 'Suporte dedicado', 'Onboarding assistido', 'SLA garantido'], cta: 'Fale Conosco', href: WHATSAPP_URL, position: 'right' as const },
];

const FAQ_ITEMS = [
  { question: 'O que é o manuRaj?', answer: 'O manuRaj é um sistema de gestão de manutenção industrial (CMMS) 100% online. Ele permite que sua empresa gerencie máquinas, ordens de serviço corretivas e preventivas, equipes de manutenção e documentos técnicos — tudo em um só lugar.' },
  { question: 'Preciso instalar algum aplicativo?', answer: 'Não! O manuRaj funciona diretamente no navegador, tanto no computador quanto no celular. O app Torque (para manutentores em campo) também funciona no navegador mobile, sem precisar baixar nada.' },
  { question: 'Como funciona o plano gratuito?', answer: 'O plano gratuito permite gerenciar até 30 máquinas com usuários e ordens de serviço ilimitadas. A única diferença é que anúncios discretos são exibidos na interface. Sem limite de tempo — é grátis para sempre.' },
  { question: 'Meus dados estão seguros?', answer: 'Sim. Seus dados são armazenados em servidores MongoDB Atlas com criptografia em repouso e em trânsito. O acesso é isolado por empresa (multi-tenant), garantindo que nenhum outro cliente acesse suas informações.' },
  { question: 'Posso migrar de plano a qualquer momento?', answer: 'Sim! Você pode começar no plano gratuito e migrar para o Profissional ou Enterprise quando sua operação crescer. A migração é instantânea e seus dados são preservados.' },
  { question: 'Como entro em contato com o suporte?', answer: 'Você pode nos contatar pelo WhatsApp a qualquer momento. Clientes dos planos Profissional e Enterprise têm suporte prioritário com tempo de resposta reduzido.' },
];

// ─── Styled Components (Page-level) ───

const PageWrapper = styled('div', {
  base: {
    minHeight: '100vh',
  },
});

const sectionBase = {
  paddingY: { base: '80px', md: '120px' },
  paddingX: { base: '20px', md: '40px' },
} as const;

const SectionWhite = styled('section', {
  base: {
    ...sectionBase,
    backgroundColor: 'white',
  },
});

const SectionGray = styled('section', {
  base: {
    ...sectionBase,
    backgroundColor: '#f8fafc',
    borderTop: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0',
  },
});

const SectionDark = styled('section', {
  base: {
    ...sectionBase,
    background: 'linear-gradient(180deg, #0f172a 0%, #172554 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
});

const Container = styled('div', {
  base: {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
});

const ContainerNarrow = styled('div', {
  base: {
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%',
  },
});

const ContentAbove = styled('div', {
  base: {
    position: 'relative',
    zIndex: 1,
  },
});

const GridPattern = styled('div', {
  base: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
    backgroundSize: '32px 32px',
  },
});

const GridPatternLarge = styled('div', {
  base: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
  },
});

const CardsGrid = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
    gap: { base: '16px', md: '24px' },
    marginTop: '64px',
  },
});

const CardsGridFeatures = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
    gap: { base: '16px', md: '20px' },
    marginTop: '64px',
  },
});

const StepsGrid = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
    gap: { base: '32px', md: '40px' },
    marginTop: '64px',
    position: 'relative',
  },
});

const ConnectingLine = styled('div', {
  base: {
    display: { base: 'none', md: 'block' },
    position: 'absolute',
    top: '36px',
    left: '15%',
    right: '15%',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), rgba(255,255,255,0.12), transparent)',
  },
});

const PricingGrid = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
    gap: { base: '16px', md: '0' },
    marginTop: '64px',
    maxWidth: '960px',
    mx: 'auto',
  },
});

const FaqList = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '64px',
  },
});

// CTA Section
const CtaSection = styled('section', {
  base: {
    paddingY: { base: '80px', md: '120px' },
    paddingX: { base: '20px', md: '40px' },
    background: 'linear-gradient(170deg, #0a1128 0%, #172554 60%, #1e3a8a 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
});

const CtaGlow = styled('div', {
  base: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '600px',
    height: '600px',
    borderRadius: '9999px',
    background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 60%)',
  },
});

const CtaContent = styled('div', {
  base: {
    maxWidth: '700px',
    margin: '0 auto',
    width: '100%',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  },
});

const CtaTitle = styled('h2', {
  base: {
    fontSize: { base: '28px', md: '40px' },
    fontWeight: '700',
    color: 'white',
    lineHeight: '1.15',
    letterSpacing: '-0.02em',
    marginBottom: '20px',
  },
});

const CtaSubtitle = styled('p', {
  base: {
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '40px',
    fontSize: { base: '15px', md: '17px' },
    lineHeight: '1.6',
  },
});

const CtaButtons = styled('div', {
  base: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});

const CtaPrimaryLarge = styled('a', {
  base: {
    backgroundColor: 'brand.500',
    color: 'white',
    padding: '14px 36px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.2s',
    _hover: {
      backgroundColor: 'brand.400',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
    },
  },
});

const CtaSecondaryLarge = styled('a', {
  base: {
    color: 'rgba(255,255,255,0.8)',
    padding: '14px 36px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    textDecoration: 'none',
    border: '1px solid rgba(255,255,255,0.15)',
    transition: 'all 0.2s',
    _hover: {
      borderColor: 'rgba(255,255,255,0.35)',
      color: 'white',
      transform: 'translateY(-2px)',
    },
  },
});

// ─── Page Component ───

export default function LandingPage() {
  return (
    <PageWrapper>
      <Header navLinks={NAV_LINKS} signupUrl={SIGNUP_URL} />

      <Hero signupUrl={SIGNUP_URL} whatsappUrl={WHATSAPP_URL} floatingBadges={HERO_FLOATING_BADGES} />

      {/* ═══ PROBLEMA / DOR ═══ */}
      <SectionWhite>
        <Container>
          <SectionHeader
            tag="O problema"
            title="Quanto custa uma máquina parada?"
            subtitle="A manutenção improvisada custa caro. Veja os números da indústria brasileira."
          />
          <CardsGrid>
            {STATS.map((item, i) => (
              <StatCard key={i} stat={item.stat} label={item.label} accent={item.accent} />
            ))}
          </CardsGrid>
        </Container>
      </SectionWhite>

      {/* ═══ FEATURES ═══ */}
      <SectionGray id="features">
        <Container>
          <SectionHeader
            tag="Recursos"
            title="Tudo para manter sua fábrica rodando"
            subtitle="Ferramentas completas de gestão de manutenção, do chão de fábrica ao escritório."
          />
          <CardsGridFeatures>
            {FEATURES.map((item, i) => (
              <FeatureCard key={i} icon={item.icon} title={item.title} description={item.description} />
            ))}
          </CardsGridFeatures>
        </Container>
      </SectionGray>

      {/* ═══ COMO FUNCIONA ═══ */}
      <SectionDark>
        <GridPattern />
        <ContentAbove>
          <Container>
            <SectionHeader
              tag="Como funciona"
              title="Comece em 3 passos"
              subtitle="Sem instalação, sem complicação. Funciona direto no navegador."
              dark
            />
            <StepsGrid>
              <ConnectingLine />
              {STEPS.map((item, i) => (
                <StepCard key={i} number={item.number} title={item.title} description={item.description} />
              ))}
            </StepsGrid>
          </Container>
        </ContentAbove>
      </SectionDark>

      {/* ═══ DEPOIMENTOS ═══ */}
      <SectionWhite>
        <Container>
          <SectionHeader
            tag="Depoimentos"
            title="Quem usa, aprova"
            subtitle="Veja o que nossos clientes dizem sobre o manuRaj."
          />
          <CardsGrid>
            {TESTIMONIALS.map((item, i) => (
              <TestimonialCard
                key={i}
                name={item.name}
                role={item.role}
                company={item.company}
                initials={item.initials}
                color={item.color}
                text={item.text}
              />
            ))}
          </CardsGrid>
        </Container>
      </SectionWhite>

      {/* ═══ PRICING ═══ */}
      <SectionGray id="pricing">
        <Container>
          <SectionHeader
            tag="Planos"
            title="Planos que cabem no seu bolso"
            subtitle="Comece grátis e escale conforme sua operação cresce. Sem surpresas."
          />
          <PricingGrid>
            {PRICING_PLANS.map((plan, i) => (
              <PricingCard
                key={i}
                name={plan.name}
                price={plan.price}
                period={plan.period}
                description={plan.description}
                features={plan.features}
                cta={plan.cta}
                href={plan.href}
                highlighted={plan.highlighted}
                badge={plan.badge}
                position={plan.position}
              />
            ))}
          </PricingGrid>
        </Container>
      </SectionGray>

      {/* ═══ FAQ ═══ */}
      <SectionWhite id="faq">
        <ContainerNarrow>
          <SectionHeader
            tag="FAQ"
            title="Perguntas frequentes"
            subtitle="Tire suas dúvidas sobre o manuRaj."
          />
          <FaqList>
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={i} question={item.question} answer={item.answer} />
            ))}
          </FaqList>
        </ContainerNarrow>
      </SectionWhite>

      {/* ═══ CONTATO ═══ */}
      <SectionGray id="contato">
        <ContainerNarrow>
          <SectionHeader
            tag="Contato"
            title="Fale com a gente"
            subtitle="Tem dúvidas ou quer conhecer o plano Enterprise? Deixe seu contato que retornamos."
          />
          <ContactForm />
        </ContainerNarrow>
      </SectionGray>

      {/* ═══ CTA FINAL ═══ */}
      <CtaSection>
        <GridPatternLarge />
        <CtaGlow />
        <CtaContent>
          <CtaTitle>Pronto para parar de improvisar?</CtaTitle>
          <CtaSubtitle>Crie sua conta gratuita em menos de 2 minutos. Sem cartão de crédito.</CtaSubtitle>
          <CtaButtons>
            <CtaPrimaryLarge href={SIGNUP_URL} target="_blank" rel="noopener noreferrer">
              Criar Conta Grátis
            </CtaPrimaryLarge>
            <CtaSecondaryLarge href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </CtaSecondaryLarge>
          </CtaButtons>
        </CtaContent>
      </CtaSection>

      <Footer navLinks={NAV_LINKS} signupUrl={SIGNUP_URL} whatsappUrl={WHATSAPP_URL} />
    </PageWrapper>
  );
}
