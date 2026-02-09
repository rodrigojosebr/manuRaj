import { styled } from '../../../../../styled-system/jsx';

export const Section = styled('section', {
  base: {
    paddingTop: { base: '140px', md: '180px' },
    paddingBottom: { base: '80px', md: '120px' },
    paddingX: { base: '20px', md: '40px' },
    background: 'linear-gradient(170deg, #0a1128 0%, #172554 50%, #1e3a8a 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
});

export const GridPattern = styled('div', {
  base: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
  },
});

export const Glow = styled('div', {
  base: {
    position: 'absolute',
    top: '20%',
    right: '10%',
    width: '500px',
    height: '500px',
    borderRadius: '9999px',
    background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
  },
});

export const Content = styled('div', {
  base: {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: { base: 'center', lg: 'flex-start' },
    gap: '48px',
    lg: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
});

export const TextBlock = styled('div', {
  base: {
    maxWidth: '600px',
    textAlign: { base: 'center', lg: 'left' },
  },
});

export const Badge = styled('div', {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '6px 16px',
    borderRadius: '100px',
    marginBottom: '32px',
  },
});

export const BadgeDot = styled('span', {
  base: {
    width: '8px',
    height: '8px',
    borderRadius: '9999px',
    backgroundColor: 'success.500',
  },
});

export const BadgeText = styled('span', {
  base: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: '0.02em',
  },
});

export const Title = styled('h1', {
  base: {
    fontSize: { base: '36px', md: '52px', lg: '60px' },
    fontWeight: '700',
    color: 'white',
    lineHeight: '1.08',
    letterSpacing: '-0.03em',
    marginBottom: '24px',
  },
});

export const TitleGradient = styled('span', {
  base: {
    backgroundClip: 'text',
    color: 'transparent',
  },
});

export const Subtitle = styled('p', {
  base: {
    fontSize: { base: '16px', md: '18px' },
    color: 'rgba(255,255,255,0.6)',
    lineHeight: '1.7',
    marginBottom: '40px',
    maxWidth: '520px',
    mx: { base: 'auto', lg: '0' },
  },
});

export const CtaWrapper = styled('div', {
  base: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: { base: 'center', lg: 'flex-start' },
  },
});

export const CtaPrimary = styled('a', {
  base: {
    backgroundColor: 'brand.500',
    color: 'white',
    padding: '14px 32px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.2s',
    _hover: {
      backgroundColor: 'brand.400',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
    },
  },
});

export const CtaSecondary = styled('a', {
  base: {
    color: 'rgba(255,255,255,0.8)',
    padding: '14px 32px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    textDecoration: 'none',
    border: '1px solid rgba(255,255,255,0.15)',
    transition: 'all 0.2s',
    _hover: {
      borderColor: 'rgba(255,255,255,0.35)',
      color: 'white',
      transform: 'translateY(-2px)',
    },
  },
});

// Visual (orb)
export const Visual = styled('div', {
  base: {
    position: 'relative',
    width: { base: '280px', md: '380px', lg: '420px' },
    height: { base: '280px', md: '380px', lg: '420px' },
    flexShrink: 0,
  },
});

export const RingOuter = styled('div', {
  base: {
    position: 'absolute',
    inset: 0,
    borderRadius: '9999px',
    border: '1px solid rgba(255,255,255,0.08)',
  },
});

export const RingMiddle = styled('div', {
  base: {
    position: 'absolute',
    inset: '40px',
    borderRadius: '9999px',
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
  },
});

export const RingInner = styled('div', {
  base: {
    position: 'absolute',
    inset: '80px',
    borderRadius: '9999px',
    border: '1px solid rgba(255,255,255,0.04)',
  },
});

export const CenterIcon = styled('div', {
  base: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100px',
    height: '100px',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    boxShadow: '0 0 60px rgba(37,99,235,0.3)',
  },
});

export const FloatingBadge = styled('div', {
  base: {
    position: 'absolute',
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    backdropFilter: 'blur(8px)',
  },
});
