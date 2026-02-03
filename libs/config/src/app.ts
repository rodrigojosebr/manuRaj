/**
 * Application configuration
 */

export const appConfig = {
  name: 'manuRaj',
  version: '0.1.0',
  description: 'Gestor de Manutenção Industrial',

  // Pagination defaults
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },

  // Session settings
  session: {
    maxAge: 24 * 60 * 60, // 24 hours in seconds
  },

  // Feature flags
  features: {
    adsEnabled: true,
    signupEnabled: true,
    multiTenant: true,
  },
};

/**
 * Environment helpers
 */
export const env = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // Required environment variables
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/manuraj',
  authSecret: process.env.AUTH_SECRET || 'development-secret-change-in-production',
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',

  // AWS
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  s3BucketName: process.env.S3_BUCKET_NAME || 'manuraj-documents',

  // Application
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

/**
 * Validate required environment variables
 * Call this during app startup
 */
export function validateEnv(): void {
  const required = ['MONGODB_URI', 'AUTH_SECRET'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0 && env.isProduction) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (missing.length > 0) {
    console.warn(`[Config] Warning: Missing environment variables: ${missing.join(', ')}`);
  }
}

/**
 * Default ad unit IDs for free tier tenants
 */
export const defaultAdUnitIds = {
  sidebar: 'ca-pub-XXXXXXX/sidebar',
  banner: 'ca-pub-XXXXXXX/banner',
  mobile: 'ca-pub-XXXXXXX/mobile',
};

/**
 * Get ad configuration for a tenant
 */
export function getAdConfig(tenant: { adsEnabled: boolean; adUnitIds?: string[] }) {
  if (!tenant.adsEnabled) {
    return { enabled: false, unitIds: [] };
  }

  return {
    enabled: true,
    unitIds: tenant.adUnitIds?.length ? tenant.adUnitIds : Object.values(defaultAdUnitIds),
  };
}
