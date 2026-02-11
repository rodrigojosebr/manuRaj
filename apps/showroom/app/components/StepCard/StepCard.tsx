import * as S from './StepCard.styles';

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

export function StepCard({ number, title, description }: StepCardProps) {
  return (
    <S.Card>
      <S.Number>{number}</S.Number>
      <S.Title>{title}</S.Title>
      <S.Description>{description}</S.Description>
    </S.Card>
  );
}
