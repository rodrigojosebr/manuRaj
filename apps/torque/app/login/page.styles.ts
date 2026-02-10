import { css } from '../../../../styled-system/css';

// ─── Container ──────────────────────────────────────────────────────────────
export const container = css({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: { base: 'column', lg: 'row' },
});

// ─── Branding Panel ─────────────────────────────────────────────────────────
export const brandingPanel = css({
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
});

export const decorCircleTop = css({
  position: 'absolute',
  top: '-20%',
  right: '-10%',
  width: '400px',
  height: '400px',
  borderRadius: 'full',
  backgroundColor: 'brand.600',
  opacity: 0.3,
  pointerEvents: 'none',
});

export const decorCircleBottom = css({
  position: 'absolute',
  bottom: '-15%',
  left: '-10%',
  width: '300px',
  height: '300px',
  borderRadius: 'full',
  backgroundColor: 'brand.800',
  opacity: 0.3,
  pointerEvents: 'none',
});

export const brandingContent = css({
  position: 'relative',
  zIndex: 1,
  textAlign: 'center',
  maxWidth: '440px',
});

export const brandingTitle = css({
  fontSize: { base: '3xl', md: '4xl', lg: '5xl' },
  fontWeight: 'bold',
  letterSpacing: '-0.025em',
  marginBottom: '4',
});

export const brandingSubtitle = css({
  fontSize: { base: 'md', md: 'lg' },
  opacity: 0.9,
  lineHeight: '1.6',
  marginBottom: '8',
});

export const featureList = css({
  display: { base: 'none', lg: 'flex' },
  flexDirection: 'column',
  gap: '4',
  marginTop: '4',
});

export const featureItem = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
  backgroundColor: 'rgba(255,255,255,0.1)',
  borderRadius: 'lg',
  padding: '3',
  paddingX: '4',
  fontSize: 'sm',
});

export const featureIcon = css({
  fontSize: 'lg',
  flexShrink: 0,
});

// ─── Form Panel ─────────────────────────────────────────────────────────────
export const formPanel = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: { base: '6', md: '8', lg: '16' },
  width: { base: '100%', lg: '50%' },
  minHeight: { base: 'auto', lg: '100vh' },
  backgroundColor: 'white',
});

export const formContainer = css({
  width: '100%',
  maxWidth: '400px',
});

export const form = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '5',
  marginTop: '6',
});

export const errorBox = css({
  backgroundColor: '#fef2f2',
  border: '1px solid',
  borderColor: '#fecaca',
  borderRadius: 'md',
  padding: '3',
  paddingX: '4',
});

export const errorText = css({
  color: 'danger.600',
  fontSize: 'sm',
  textAlign: 'center',
});

// ─── Title Variants ─────────────────────────────────────────────────────────
export const titleDesktopWrap = css({
  display: { base: 'none', lg: 'block' },
  marginBottom: '2',
});

export const titleDesktopH2 = css({
  fontSize: '2xl',
  fontWeight: 'bold',
  color: 'gray.900',
});

export const titleDesktopSub = css({
  fontSize: 'sm',
  color: 'gray.500',
  marginTop: '1',
});

export const titleMobileWrap = css({
  display: { base: 'block', lg: 'none' },
  marginBottom: '2',
});

export const titleMobileH2 = css({
  fontSize: 'xl',
  fontWeight: 'bold',
  color: 'gray.900',
});

export const titleMobileSub = css({
  fontSize: 'sm',
  color: 'gray.500',
  marginTop: '1',
});
