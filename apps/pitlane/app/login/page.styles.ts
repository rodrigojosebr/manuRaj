import Link from 'next/link';
import { styled } from '../../../../styled-system/jsx';

export const Wrapper = styled('div', {
  base: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: { base: 'column', lg: 'row' },
  },
});

/* ---- Branding panel ---- */

export const BrandPanel = styled('div', {
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

const blobBase = {
  position: 'absolute',
  borderRadius: 'full',
  opacity: 0.3,
  pointerEvents: 'none',
} as const;

export const BlobTop = styled('div', {
  base: {
    ...blobBase,
    top: '-20%',
    right: '-10%',
    width: '400px',
    height: '400px',
    backgroundColor: 'brand.600',
  },
});

export const BlobBottom = styled('div', {
  base: {
    ...blobBase,
    bottom: '-15%',
    left: '-10%',
    width: '300px',
    height: '300px',
    backgroundColor: 'brand.800',
  },
});

export const BrandContent = styled('div', {
  base: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    maxWidth: '440px',
  },
});

export const BrandTitle = styled('h1', {
  base: {
    fontSize: { base: '3xl', md: '4xl', lg: '5xl' },
    fontWeight: 'bold',
    letterSpacing: '-0.025em',
    marginBottom: '4',
  },
});

export const BrandText = styled('p', {
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
  base: { fontSize: 'lg', flexShrink: 0 },
});

/* ---- Form panel ---- */

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

export const FormCard = styled('div', {
  base: { width: '100%', maxWidth: '400px' },
});

export const HeadingDesktop = styled('div', {
  base: { display: { base: 'none', lg: 'block' }, marginBottom: '2' },
});

export const HeadingMobile = styled('div', {
  base: { display: { base: 'block', lg: 'none' }, marginBottom: '2' },
});

export const Title = styled('h2', {
  base: { fontWeight: 'bold', color: 'gray.900' },
  variants: {
    size: {
      desktop: { fontSize: '2xl' },
      mobile: { fontSize: 'xl' },
    },
  },
  defaultVariants: { size: 'desktop' },
});

export const Subtitle = styled('p', {
  base: { fontSize: 'sm', color: 'gray.500', marginTop: '1' },
});

export const Form = styled('form', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5',
    marginTop: '6',
  },
});

/* ---- Feedback (sucesso / erro) ---- */

export const Alert = styled('div', {
  base: {
    border: '1px solid',
    borderRadius: 'md',
    padding: '3',
    paddingX: '4',
  },
  variants: {
    tone: {
      success: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
      danger: { backgroundColor: '#fef2f2', borderColor: '#fecaca' },
    },
  },
  defaultVariants: { tone: 'success' },
});

export const AlertText = styled('p', {
  base: { fontSize: 'sm', textAlign: 'center' },
  variants: {
    tone: {
      success: { color: 'success.600' },
      danger: { color: 'danger.600' },
    },
  },
  defaultVariants: { tone: 'success' },
});

export const SignupHint = styled('p', {
  base: {
    textAlign: 'center',
    fontSize: 'sm',
    color: 'gray.500',
    marginTop: '2',
  },
});

export const SignupLink = styled(Link, {
  base: {
    color: 'brand.600',
    fontWeight: 'medium',
    _hover: { textDecoration: 'underline' },
  },
});
