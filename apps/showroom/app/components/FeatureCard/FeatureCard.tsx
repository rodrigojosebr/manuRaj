import * as S from './FeatureCard.styles';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <S.Card>
      <S.IconWrapper>{icon}</S.IconWrapper>
      <S.Title>{title}</S.Title>
      <S.Description>{description}</S.Description>
    </S.Card>
  );
}
