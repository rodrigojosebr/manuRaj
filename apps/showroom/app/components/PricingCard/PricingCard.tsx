import * as S from './PricingCard.styles';

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
  badge?: string;
  position?: 'left' | 'center' | 'right';
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  href,
  highlighted = false,
  badge,
  position = 'center',
}: PricingCardProps) {
  return (
    <S.Card highlighted={highlighted} position={position}>
      {badge && <S.Badge>{badge}</S.Badge>}
      <S.Name>{name}</S.Name>
      <S.Description highlighted={highlighted}>{description}</S.Description>
      <S.PriceWrapper>
        <S.Price>{price}</S.Price>
        {period && <S.Period highlighted={highlighted}>{period}</S.Period>}
      </S.PriceWrapper>
      <S.FeatureList>
        {features.map((feature, i) => (
          <S.FeatureItem key={i}>
            <S.Checkmark highlighted={highlighted}>✓</S.Checkmark>
            <S.FeatureText highlighted={highlighted}>{feature}</S.FeatureText>
          </S.FeatureItem>
        ))}
      </S.FeatureList>
      <S.CtaButton href={href} target="_blank" rel="noopener noreferrer" highlighted={highlighted}>
        {cta}
      </S.CtaButton>
    </S.Card>
  );
}
