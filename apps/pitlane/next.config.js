//@ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  // Transpile monorepo packages
  transpilePackages: [
    '@manuraj/domain',
    '@manuraj/data-access',
    '@manuraj/auth',
    '@manuraj/config',
    '@manuraj/pitkit',
    '@manuraj/ads',
    '@manuraj/shared-utils',
  ],

  // Server external packages (moved from experimental)
  serverExternalPackages: ['mongoose', 'bcryptjs'],

  // Images configuration
  images: {
    domains: [],
    remotePatterns: [],
  },

  // Environment variables that should be available client-side
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
};

module.exports = nextConfig;
