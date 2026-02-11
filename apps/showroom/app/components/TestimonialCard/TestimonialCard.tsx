import * as S from './TestimonialCard.styles';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  initials: string;
  color: string;
  text: string;
}

export function TestimonialCard({ name, role, company, initials, color, text }: TestimonialCardProps) {
  return (
    <S.Card>
      <S.Stars>
        {[1, 2, 3, 4, 5].map((i) => (
          <S.StarIcon key={i}>★</S.StarIcon>
        ))}
      </S.Stars>
      <S.Text>&ldquo;{text}&rdquo;</S.Text>
      <S.Author>
        <S.Avatar style={{ backgroundColor: color }}>{initials}</S.Avatar>
        <div>
          <S.Name>{name}</S.Name>
          <S.Role>{role} — {company}</S.Role>
        </div>
      </S.Author>
    </S.Card>
  );
}
