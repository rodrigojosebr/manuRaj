import { NextRequest } from 'next/server';
import { connectDB } from '@manuraj/data-access';
import { userRepository, UserRepository } from '@manuraj/data-access';
import { createUserSchema, paginationSchema, userRoleSchema, PERMISSIONS } from '@manuraj/domain';
import {
  requirePermission,
  badRequestResponse,
  successResponse,
  withErrorHandler,
} from '@manuraj/auth';

// GET /api/users - List users in tenant
export const GET = withErrorHandler(async (req: NextRequest) => {
  const user = await requirePermission(PERMISSIONS.USERS_READ);

  await connectDB();

  const { searchParams } = new URL(req.url);
  const parsed = paginationSchema.safeParse({
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
  });

  const page = parsed.success ? parsed.data.page : 1;
  const limit = parsed.success ? parsed.data.limit : 20;
  const rawRole = searchParams.get('role');
  const parsedRole = rawRole ? userRoleSchema.safeParse(rawRole) : null;
  const role = parsedRole?.success ? parsedRole.data : undefined;
  const active = searchParams.get('active');

  const { users, total } = await userRepository.findByTenant(user.tenantId, {
    role,
    active: active !== null ? active === 'true' : undefined,
    page,
    limit,
  });

  return successResponse({
    data: users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

// POST /api/users - Create a user in tenant
export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await requirePermission(PERMISSIONS.USERS_CREATE);

  const body = await req.json();
  const parsed = createUserSchema.safeParse(body);

  if (!parsed.success) {
    return badRequestResponse(parsed.error.issues[0].message);
  }

  await connectDB();

  // Check if email already exists in tenant
  const emailExists = await userRepository.emailExistsInTenant(user.tenantId, parsed.data.email);
  if (emailExists) {
    return badRequestResponse('Email já cadastrado nesta empresa');
  }

  // Hash password
  const passwordHash = await UserRepository.hashPassword(parsed.data.password);

  // Only super_admin can create super_admin users
  if (parsed.data.role === 'super_admin' && user.role !== 'super_admin') {
    return badRequestResponse('Permissão insuficiente para criar este tipo de usuário');
  }

  const newUser = await userRepository.create({
    tenantId: user.tenantId,
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash,
    role: parsed.data.role,
  });

  // Don't return password hash
  const { passwordHash: _, ...userWithoutPassword } = newUser.toObject();

  return successResponse(userWithoutPassword, 201);
});
