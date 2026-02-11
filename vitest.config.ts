import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@manuraj/domain': path.resolve(__dirname, 'libs/domain/src/index.ts'),
      '@manuraj/data-access': path.resolve(__dirname, 'libs/data-access/src/index.ts'),
      '@manuraj/auth': path.resolve(__dirname, 'libs/auth/src/index.ts'),
      '@manuraj/config': path.resolve(__dirname, 'libs/config/src/index.ts'),
      '@pitkit': path.resolve(__dirname, 'libs/pitkit/src/index.ts'),
      '@manuraj/pitkit': path.resolve(__dirname, 'libs/pitkit/src/index.ts'),
      '@manuraj/ui': path.resolve(__dirname, 'libs/pitkit/src/index.ts'),
      '@manuraj/ads': path.resolve(__dirname, 'libs/ads/src/index.ts'),
      '@manuraj/shared-utils': path.resolve(__dirname, 'libs/shared-utils/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/**/*.integration.test.ts', 'tests/tenant-isolation.test.ts', 'node_modules'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
