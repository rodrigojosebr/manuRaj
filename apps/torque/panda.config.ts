import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  preflight: true,
  include: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../libs/pitkit/src/**/*.{ts,tsx}',
  ],
  exclude: [],
  theme: {
    extend: {
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      tokens: {
        colors: {
          brand: {
            50: { value: '#ecfdf5' },
            100: { value: '#d1fae5' },
            200: { value: '#a7f3d0' },
            300: { value: '#6ee7b7' },
            400: { value: '#34d399' },
            500: { value: '#10b981' },
            600: { value: '#059669' },
            700: { value: '#047857' },
            800: { value: '#065f46' },
            900: { value: '#064e3b' },
          },
          success: {
            500: { value: '#22c55e' },
            600: { value: '#16a34a' },
          },
          warning: {
            500: { value: '#f59e0b' },
            600: { value: '#d97706' },
          },
          danger: {
            500: { value: '#ef4444' },
            600: { value: '#dc2626' },
          },
        },
        fonts: {
          body: { value: 'system-ui, -apple-system, sans-serif' },
          heading: { value: 'system-ui, -apple-system, sans-serif' },
          mono: { value: 'ui-monospace, monospace' },
        },
        animations: {
          pulse: { value: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' },
          spin: { value: 'spin 1s linear infinite' },
        },
        spacing: {
          page: { value: '{spacing.6}' },           // 24px — padding de página
          section: { value: '{spacing.8}' },         // 32px — gap entre seções
          'card-padding': { value: '{spacing.6}' },  // 24px — padding interno de card
          'card-gap': { value: '{spacing.5}' },      // 20px — gap entre cards
          'field-gap': { value: '{spacing.4}' },     // 16px — gap entre campos
        },
      },
      semanticTokens: {
        colors: {
          bg: {
            canvas: { value: { base: '{colors.gray.50}', _dark: '{colors.gray.900}' } },
            surface: { value: { base: 'white', _dark: '{colors.gray.800}' } },
            subtle: { value: { base: '{colors.gray.100}', _dark: '{colors.gray.700}' } },
          },
          text: {
            primary: { value: { base: '{colors.gray.900}', _dark: 'white' } },
            secondary: { value: { base: '{colors.gray.600}', _dark: '{colors.gray.400}' } },
            muted: { value: { base: '{colors.gray.500}', _dark: '{colors.gray.500}' } },
          },
          border: {
            default: { value: { base: '{colors.gray.200}', _dark: '{colors.gray.700}' } },
          },
        },
      },
    },
  },
  // Output to shared styled-system
  outdir: '../../styled-system',
  jsxFramework: 'react',
});
