'use client';

import { useState } from 'react';
import * as S from './Header.styles';

interface NavLink {
  label: string;
  href: string;
}

interface HeaderProps {
  navLinks: NavLink[];
  signupUrl: string;
}

export function Header({ navLinks, signupUrl }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <S.Wrapper>
      <S.Inner>
        <S.Logo href="#">
          manu<S.LogoAccent>Raj</S.LogoAccent>
        </S.Logo>

        <S.DesktopNav>
          {navLinks.map((item) => (
            <S.NavLink key={item.href} href={item.href}>
              {item.label}
            </S.NavLink>
          ))}
          <S.NavCta href={signupUrl} target="_blank" rel="noopener noreferrer">
            Começar Grátis
          </S.NavCta>
        </S.DesktopNav>

        <S.HamburgerButton
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          <S.HamburgerLine variant="line1" open={mobileMenuOpen} />
          <S.HamburgerLine variant="line2" open={mobileMenuOpen} />
          <S.HamburgerLine variant="line3" open={mobileMenuOpen} />
        </S.HamburgerButton>
      </S.Inner>

      {mobileMenuOpen && (
        <S.MobileMenu>
          {navLinks.map((item) => (
            <S.MobileMenuLink
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </S.MobileMenuLink>
          ))}
          <S.MobileMenuCta
            href={signupUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
          >
            Começar Grátis
          </S.MobileMenuCta>
        </S.MobileMenu>
      )}
    </S.Wrapper>
  );
}
