import * as S from './Hero.styles';

interface FloatingBadge {
  icon: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay: string;
}

interface HeroProps {
  signupUrl: string;
  whatsappUrl: string;
  floatingBadges: FloatingBadge[];
}

export function Hero({ signupUrl, whatsappUrl, floatingBadges }: HeroProps) {
  return (
    <S.Section>
      <S.GridPattern />
      <S.Glow />

      <S.Content>
        <S.TextBlock>
          <S.Badge>
            <S.BadgeDot />
            <S.BadgeText>CMMS para a indústria brasileira</S.BadgeText>
          </S.Badge>

          <S.Title>
            Pare de improvisar.{' '}
            <S.TitleGradient
              style={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text' }}
            >
              Comece a gerenciar.
            </S.TitleGradient>
          </S.Title>

          <S.Subtitle>
            Sistema completo para gerenciar máquinas, ordens de serviço e equipes de manutenção.
            Reduza paradas não planejadas e aumente a vida útil dos equipamentos.
          </S.Subtitle>

          <S.CtaWrapper>
            <S.CtaPrimary href={signupUrl} target="_blank" rel="noopener noreferrer">
              Começar Grátis
            </S.CtaPrimary>
            <S.CtaSecondary href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Fale Conosco
            </S.CtaSecondary>
          </S.CtaWrapper>
        </S.TextBlock>

        <S.Visual>
          <S.RingOuter />
          <S.RingMiddle />
          <S.RingInner />
          <S.CenterIcon>⚙️</S.CenterIcon>
          {floatingBadges.map((badge, i) => (
            <S.FloatingBadge
              key={i}
              style={{
                top: badge.top,
                left: badge.left,
                right: badge.right,
                bottom: badge.bottom,
                animation: `float 5s ease-in-out ${badge.delay} infinite`,
              }}
            >
              {badge.icon}
            </S.FloatingBadge>
          ))}
        </S.Visual>
      </S.Content>
    </S.Section>
  );
}
