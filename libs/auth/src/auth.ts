import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from '@manuraj/data-access';
import { UserModel } from '@manuraj/data-access';
import { TenantModel } from '@manuraj/data-access';
import { loginSchema } from '@manuraj/domain';
import { authConfig } from './auth.config';

/**
 * Full NextAuth configuration with providers.
 * This runs in Node.js runtime only (not edge).
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        tenantSlug: { label: 'Tenant', type: 'text' },
      },
      async authorize(credentials) {
        try {
          // Validate input
          const parsed = loginSchema.safeParse({
            email: credentials?.email,
            password: credentials?.password,
          });

          if (!parsed.success) {
            return null;
          }

          const tenantSlug = credentials?.tenantSlug as string;
          if (!tenantSlug) {
            return null;
          }

          await connectDB();

          // Find tenant by slug
          const tenant = await TenantModel.findOne({
            slug: tenantSlug.toLowerCase(),
            active: true,
          }).lean();

          if (!tenant) {
            return null;
          }

          // Find user by email in this tenant
          const user = await UserModel.findOne({
            tenantId: tenant._id,
            email: parsed.data.email.toLowerCase(),
            active: true,
          }).lean();

          if (!user) {
            return null;
          }

          // Verify password
          const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
          if (!isValid) {
            return null;
          }

          // Return user data for session
          return {
            id: user._id.toString(),
            tenantId: tenant._id.toString(),
            tenantSlug: tenant.slug,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('[Auth] Authorization error:', error);
          return null;
        }
      },
    }),
  ],
});
