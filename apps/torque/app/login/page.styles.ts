import { styled } from '../../../../styled-system/jsx';

// ─── Container ──────────────────────────────────────────────────────────────
export const Container = styled('div', {
  base: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: { base: 'column', lg: 'row' },
  },
});

// ─── Branding Panel ─────────────────────────────────────────────────────────
export const BrandingPanel = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: { base: '8', md: '12', lg: '16' },
    backgroundColor: 'brand.700',
    color: 'white',
    width: { base: '100%', lg: '50%' },
    minHeight: { base: 'auto', lg: '100vh' },
    position: 'relative',
    overflow: 'hidden',
  },
});

export const DecorCircleTop = styled('div', {
  base: {
    position: 'absolute',
    top: '-20%',
    right: '-10%',
    width: '400px',
    height: '400px',
    borderRadius: 'full',
    backgroundColor: 'brand.600',
    opacity: 0.3,
    pointerEvents: 'none',
  },
});

export const DecorCircleBottom = styled('div', {
  base: {
    position: 'absolute',
    bottom: '-15%',
    left: '-10%',
    width: '300px',
    height: '300px',
    borderRadius: 'full',
    backgroundColor: 'brand.800',
    opacity: 0.3,
    pointerEvents: 'none',
  },
});

export const BrandingContent = styled('div', {
  base: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    maxWidth: '440px',
  },
});

export const BrandingTitle = styled('h1', {
  base: {
    fontSize: { base: '3xl', md: '4xl', lg: '5xl' },
    fontWeight: 'bold',
    letterSpacing: '-0.025em',
    marginBottom: '4',
    color: 'white',
  },
});

export const BrandingSubtitle = styled('p', {
  base: {
    fontSize: { base: 'md', md: 'lg' },
    opacity: 0.9,
    lineHeight: '1.6',
    marginBottom: '8',
  },
});

export const FeatureList = styled('div', {
  base: {
    display: { base: 'none', lg: 'flex' },
    flexDirection: 'column',
    gap: '4',
    marginTop: '4',
  },
});

export const FeatureItem = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '3',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 'lg',
    padding: '3',
    paddingX: '4',
    fontSize: 'sm',
  },
});

export const FeatureIcon = styled('span', {
  base: {
    fontSize: 'lg',
    flexShrink: 0,
  },
});

// ─── Form Panel ─────────────────────────────────────────────────────────────
export const FormPanel = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: { base: '6', md: '8', lg: '16' },
    width: { base: '100%', lg: '50%' },
    minHeight: { base: 'auto', lg: '100vh' },
    backgroundColor: 'white',
  },
});

export const FormContainer = styled('div', {
  base: {
    width: '100%',
    maxWidth: '400px',
  },
});

export const Form = styled('form', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5',
    marginTop: '6',
  },
});

export const ErrorBox = styled('div', {
  base: {
    backgroundColor: '#fef2f2',
    border: '1px solid',
    borderColor: '#fecaca',
    borderRadius: 'md',
    padding: '3',
    paddingX: '4',
  },
});

export const ErrorText = styled('p', {
  base: {
    color: 'danger.600',
    fontSize: 'sm',
    textAlign: 'center',
  },
});

// ─── Title Variants ─────────────────────────────────────────────────────────
export const TitleDesktopWrap = styled('div', {
  base: {
    display: { base: 'none', lg: 'block' },
    marginBottom: '2',
  },
});

export const TitleDesktopH2 = styled('h2', {
  base: {
    fontSize: '2xl',
    fontWeight: 'bold',
    color: 'gray.900',
  },
});

export const TitleDesktopSub = styled('p', {
  base: {
    fontSize: 'sm',
    color: 'gray.500',
    marginTop: '1',
  },
});

export const TitleMobileWrap = styled('div', {
  base: {
    display: { base: 'block', lg: 'none' },
    marginBottom: '2',
  },
});

export const TitleMobileH2 = styled('h2', {
  base: {
    fontSize: 'xl',
    fontWeight: 'bold',
    color: 'gray.900',
  },
});

export const TitleMobileSub = styled('p', {
  base: {
    fontSize: 'sm',
    color: 'gray.500',
    marginTop: '1',
  },
});
