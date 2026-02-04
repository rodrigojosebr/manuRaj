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

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
