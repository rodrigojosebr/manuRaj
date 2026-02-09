import { styled } from '../../../../../styled-system/jsx';

export const Wrapper = styled('footer', {
  base: {
    paddingY: '48px',
    paddingX: { base: '20px', md: '40px' },
    backgroundColor: '#0a1128',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
});

export const Container = styled('div', {
  base: {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
});

export const Grid = styled('div', {
  base: {
    display: 'grid',
    gridTemplateColumns: { base: '1fr', md: '2fr 1fr 1fr' },
    gap: { base: '40px', md: '60px' },
    marginBottom: '48px',
  },
});

export const BrandName = styled('p', {
  base: {
    fontWeight: '700',
    color: 'white',
    fontSize: '20px',
    marginBottom: '12px',
    letterSpacing: '-0.02em',
  },
});

export const LogoAccent = styled('span', {
  base: {
    color: 'brand.400',
  },
});

export const BrandDescription = styled('p', {
  base: {
    fontSize: '14px',
    lineHeight: '1.7',
    color: 'rgba(255,255,255,0.4)',
    maxWidth: '300px',
  },
});

export const ColumnTitle = styled('p', {
  base: {
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '12px',
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
});

export const LinkList = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
});

export const Link = styled('a', {
  base: {
    color: 'rgba(255,255,255,0.4)',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.2s',
    _hover: { color: 'white' },
  },
});

export const Bottom = styled('div', {
  base: {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingTop: '24px',
    display: 'flex',
    flexDirection: { base: 'column', md: 'row' },
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
});

export const SmallText = styled('p', {
  base: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.3)',
  },
});
