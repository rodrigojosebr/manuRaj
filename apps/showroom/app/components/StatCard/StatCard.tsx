import * as S from './StatCard.styles';

interface StatCardProps {
  stat: string;
  label: string;
  accent: string;
}

export function StatCard({ stat, label, accent }: StatCardProps) {
  return (
    <S.Card>
      <S.Value style={{ color: accent }}>{stat}</S.Value>
      <S.Label>{label}</S.Label>
    </S.Card>
  );
}
