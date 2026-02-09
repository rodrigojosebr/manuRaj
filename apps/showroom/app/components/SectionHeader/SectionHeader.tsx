import * as S from './SectionHeader.styles';

interface SectionHeaderProps {
  tag: string;
  title: string;
  subtitle: string;
  dark?: boolean;
}

export function SectionHeader({ tag, title, subtitle, dark = false }: SectionHeaderProps) {
  return (
    <S.Wrapper>
      <S.Tag dark={dark}>{tag}</S.Tag>
      <S.Title dark={dark}>{title}</S.Title>
      <S.Subtitle dark={dark}>{subtitle}</S.Subtitle>
    </S.Wrapper>
  );
}
