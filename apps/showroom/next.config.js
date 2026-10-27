//@ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  // Transpile monorepo packages
  transpilePackages: [
    '@manuraj/domain',
    '@manuraj/pitkit',
    '@manuraj/shared-utils',
  ],

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
