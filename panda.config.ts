import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  preflight: true,
  include: [
    './apps/web/app/**/*.{ts,tsx}',
    './apps/web/components/**/*.{ts,tsx}',
    './libs/ui/src/**/*.{ts,tsx}',
    './libs/ads/src/**/*.{ts,tsx}',
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
            50: { value: '#eff6ff' },
            100: { value: '#dbeafe' },
            200: { value: '#bfdbfe' },
            300: { value: '#93c5fd' },
            400: { value: '#60a5fa' },
            500: { value: '#3b82f6' },
            600: { value: '#2563eb' },
            700: { value: '#1d4ed8' },
            800: { value: '#1e40af' },
            900: { value: '#1e3a8a' },
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
  outdir: 'styled-system',
  jsxFramework: 'react',
});
