import { NextRequest } from 'next/server';
import { connectDB } from '@manuraj/data-access';
import { tenantRepository, userRepository, UserRepository } from '@manuraj/data-access';
import { signupSchema } from '@manuraj/domain';
import { badRequestResponse, serverErrorResponse, successResponse } from '@manuraj/auth';

export async function POST(req: NextRequest) {
  try {
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

    // Create tenant
    const tenant = await tenantRepository.create({
      name: tenantName,
      slug: tenantSlug,
      plan: 'free',
      adsEnabled: true,
    });

    // Hash password
    const passwordHash = await UserRepository.hashPassword(password);

    // Create admin user for this tenant
    const user = await userRepository.create({
      tenantId: tenant._id.toString(),
      name: userName,
      email,
      passwordHash,
      role: 'general_supervisor', // First user is general supervisor
    });

    return successResponse(
      {
        tenant: {
          id: tenant._id.toString(),
          name: tenant.name,
          slug: tenant.slug,
        },
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      201
    );
  } catch (error) {
    console.error('[Signup] Error:', error);
    return serverErrorResponse('Erro ao criar conta');
  }
}
