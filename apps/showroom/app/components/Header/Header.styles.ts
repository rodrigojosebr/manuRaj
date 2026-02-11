import { styled } from '../../../../../styled-system/jsx';

export const Wrapper = styled('header', {
  base: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'rgba(10, 17, 40, 0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
});

export const Inner = styled('div', {
  base: {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    md: { padding: '16px 40px' },
  },
});

export const Logo = styled('a', {
  base: {
    fontSize: '22px',
    fontWeight: '700',
    color: 'white',
    textDecoration: 'none',
    letterSpacing: '-0.03em',
  },
});

export const LogoAccent = styled('span', {
  base: {
    color: 'brand.400',
  },
});

export const DesktopNav = styled('nav', {
  base: {
    display: 'none',
    gap: '32px',
    alignItems: 'center',
    md: { display: 'flex' },
  },
});

export const NavLink = styled('a', {
  base: {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    letterSpacing: '0.01em',
    transition: 'color 0.2s',
    _hover: { color: 'white' },
  },
});

export const NavCta = styled('a', {
  base: {
    backgroundColor: 'brand.500',
    color: 'white',
    padding: '10px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.2s',
    _hover: {
      backgroundColor: 'brand.400',
      transform: 'translateY(-1px)',
    },
  },
});

export const HamburgerButton = styled('button', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    padding: '8px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    md: { display: 'none' },
  },
});

export const HamburgerLine = styled('span', {
  base: {
    width: '22px',
    height: '2px',
    backgroundColor: 'white',
    borderRadius: '2px',
    transition: 'all 0.3s',
  },
  variants: {
    variant: {
      line1: {},
      line2: {},
      line3: {},
    },
    open: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      variant: 'line1',
      open: true,
      css: { transform: 'rotate(45deg) translate(5px, 5px)' },
    },
    {
      variant: 'line1',
      open: false,
      css: { transform: 'none' },
    },
    {
      variant: 'line2',
      open: true,
      css: { opacity: 0 },
    },
    {
      variant: 'line2',
      open: false,
      css: { opacity: 1 },
    },
    {
      variant: 'line3',
      open: true,
      css: { transform: 'rotate(-45deg) translate(5px, -5px)' },
    },
    {
      variant: 'line3',
      open: false,
      css: { transform: 'none' },
    },
  ],
  defaultVariants: {
    open: false,
  },
});

export const MobileMenu = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 20px 20px',
    backgroundColor: 'rgba(10, 17, 40, 0.98)',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    md: { display: 'none' },
  },
});

export const MobileMenuLink = styled('a', {
  base: {
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    padding: '14px 0',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    fontSize: '15px',
    fontWeight: '500',
  },
});

export const MobileMenuCta = styled('a', {
  base: {
    marginTop: '16px',
    backgroundColor: 'brand.500',
    color: 'white',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center',
  },
});
