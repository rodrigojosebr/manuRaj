//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {},

  // Transpile monorepo packages
  transpilePackages: [
    '@manuraj/domain',
    '@manuraj/data-access',
    '@manuraj/auth',
    '@manuraj/config',
    '@manuraj/ui',
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

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
