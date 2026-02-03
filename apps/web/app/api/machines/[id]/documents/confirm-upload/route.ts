import { NextRequest } from 'next/server';
import { connectDB } from '@manuraj/data-access';
import { machineRepository, machineDocumentRepository } from '@manuraj/data-access';
import { confirmUploadSchema, PERMISSIONS } from '@manuraj/domain';
import { validateS3KeyForTenant } from '@manuraj/config';
import {
  requirePermission,
  badRequestResponse,
  notFoundResponse,
  forbiddenResponse,
  successResponse,
  withErrorHandler,
  RouteContext,
} from '@manuraj/auth';


// POST /api/machines/:id/documents/confirm-upload
export const POST = withErrorHandler(async (req: NextRequest, context?: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.DOCUMENTS_UPLOAD);
  const { id: machineId } = await context!.params;

  const body = await req.json();
  const parsed = confirmUploadSchema.safeParse(body);

  if (!parsed.success) {
    return badRequestResponse(parsed.error.issues[0].message);
  }

  const { s3Key, contentType, size, type, title } = parsed.data;

  // CRITICAL: Validate that the S3 key belongs to this tenant
  if (!validateS3KeyForTenant(s3Key, user.tenantId)) {
    return forbiddenResponse('Acesso negado a este recurso');
  }

  await connectDB();

  // Verify machine belongs to tenant
  const machine = await machineRepository.findById(user.tenantId, machineId);
  if (!machine) {
    return notFoundResponse('Máquina não encontrada');
  }

  // Save document metadata to database
  const document = await machineDocumentRepository.create({
    tenantId: user.tenantId,
    machineId,
    type,
    title,
    s3Key,
    contentType,
    size,
    uploadedBy: user.id,
  });

  return successResponse(document, 201);
});
