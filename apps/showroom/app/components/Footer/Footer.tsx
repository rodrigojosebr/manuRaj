import * as S from './Footer.styles';

interface NavLink {
  label: string;
  href: string;
}

interface FooterProps {
  navLinks: NavLink[];
  signupUrl: string;
  whatsappUrl: string;
}

export function Footer({ navLinks, signupUrl, whatsappUrl }: FooterProps) {
  return (
    <S.Wrapper>
      <S.Container>
        <S.Grid>
          <div>
            <S.BrandName>manu<S.LogoAccent>Raj</S.LogoAccent></S.BrandName>
            <S.BrandDescription>
              Sistema completo de gestão de manutenção industrial. Gerencie máquinas, ordens de serviço e equipes em um só lugar.
            </S.BrandDescription>
          </div>
          <div>
            <S.ColumnTitle>Navegação</S.ColumnTitle>
            <S.LinkList>
              {navLinks.map((item) => (
                <S.Link key={item.href} href={item.href}>{item.label}</S.Link>
              ))}
            </S.LinkList>
          </div>
          <div>
            <S.ColumnTitle>Contato</S.ColumnTitle>
            <S.LinkList>
              <S.Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</S.Link>
              <S.Link href={signupUrl} target="_blank" rel="noopener noreferrer">Criar Conta</S.Link>
            </S.LinkList>
          </div>
        </S.Grid>
        <S.Bottom>
          <S.SmallText>© 2026 manuRaj. Todos os direitos reservados.</S.SmallText>
          <S.SmallText>Feito no Brasil</S.SmallText>
        </S.Bottom>
      </S.Container>
    </S.Wrapper>
  );
}
