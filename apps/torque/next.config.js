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
    '@manuraj/shared-utils',
    '@manuraj/ads',
  ],

  // Server external packages
  serverExternalPackages: ['mongoose', 'bcryptjs'],

  // Images configuration
  images: {
    domains: [],
    remotePatterns: [],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
};

module.exports = nextConfig;
