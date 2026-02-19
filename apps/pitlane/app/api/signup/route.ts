import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@manuraj/data-access';
import { tenantRepository, userRepository, UserRepository } from '@manuraj/data-access';
import { signupSchema } from '@manuraj/domain';
import { badRequestResponse, successResponse, withErrorHandler } from '@manuraj/auth';

// POST /api/signup - Create new tenant and admin user
export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();

  // Validate input
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return badRequestResponse(parsed.error.issues[0].message);
  }

  const { tenantName, tenantSlug, userName, email, password } = parsed.data;

  await connectDB();

  // Check if slug already exists
  const slugExists = await tenantRepository.slugExists(tenantSlug);
  if (slugExists) {
    return badRequestResponse('Este identificador de empresa já está em uso');
  }

  // Hash password before transaction (CPU-intensive, no DB ops)
  const passwordHash = await UserRepository.hashPassword(password);

  // Use transaction to ensure atomicity: tenant + user created together
  const session = await mongoose.startSession();

  try {
    let tenantData: { id: string; name: string; slug: string };
    let userData: { id: string; name: string; email: string; role: string };

    await session.withTransaction(async () => {
      // Create tenant
      const tenant = await tenantRepository.create({
        name: tenantName,
        slug: tenantSlug,
        plan: 'free',
        adsEnabled: true,
      });

      // Create admin user for this tenant
      const user = await userRepository.create({
        tenantId: tenant._id.toString(),
        name: userName,
        email,
        passwordHash,
        role: 'general_supervisor',
      });

      tenantData = {
        id: tenant._id.toString(),
        name: tenant.name,
        slug: tenant.slug,
      };
      userData = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      };
    });

    return successResponse({ tenant: tenantData!, user: userData! }, 201);
  } finally {
    await session.endSession();
  }
});
