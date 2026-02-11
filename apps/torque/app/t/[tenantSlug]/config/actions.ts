'use server';

import { auth } from '@manuraj/auth';
import { connectDB, userRepository } from '@manuraj/data-access';
import { updateProfileSchema, changePasswordSchema } from '@manuraj/domain';

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function updateProfileAction(data: {
  name: string;
  email: string;
}): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: 'Nao autenticado.' };
  }

  const { tenantId, id: userId } = session.user;

  const parsed = updateProfileSchema.safeParse(data);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { success: false, error: firstError?.message || 'Dados invalidos.' };
  }

  await connectDB();

  // Check email uniqueness if changed
  const emailExists = await userRepository.emailExistsInTenant(
    tenantId,
    parsed.data.email,
    userId
  );

  if (emailExists) {
    return { success: false, error: 'Este email ja esta em uso por outro usuario.' };
  }

  const updated = await userRepository.update(tenantId, userId, {
    name: parsed.data.name,
    email: parsed.data.email,
  });

  if (!updated) {
    return { success: false, error: 'Erro ao atualizar perfil.' };
  }

  return { success: true };
}

export async function changePasswordAction(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: 'Nao autenticado.' };
  }

  const { tenantId, id: userId } = session.user;

  const parsed = changePasswordSchema.safeParse(data);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { success: false, error: firstError?.message || 'Dados invalidos.' };
  }

  await connectDB();

  // Fetch user with passwordHash to verify current password
  const user = await userRepository.findById(tenantId, userId);

  if (!user) {
    return { success: false, error: 'Usuario nao encontrado.' };
  }

  const isValid = await userRepository.verifyPassword(user, parsed.data.currentPassword);

  if (!isValid) {
    return { success: false, error: 'Senha atual incorreta.' };
  }

  // Update password (repository handles hashing automatically)
  const updated = await userRepository.update(tenantId, userId, {
    password: parsed.data.newPassword,
  });

  if (!updated) {
    return { success: false, error: 'Erro ao alterar senha.' };
  }

  return { success: true };
}
