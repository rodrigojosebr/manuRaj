import { NextRequest } from 'next/server';
import { connectDB } from '@manuraj/data-access';
import { machineRepository } from '@manuraj/data-access';
import { prepareUploadSchema, PERMISSIONS } from '@manuraj/domain';
import {
  generateS3Key,
  generateUploadUrl,
  isAllowedContentType,
  isAllowedFileSize,
} from '@manuraj/config';
import {
  requirePermission,
  badRequestResponse,
  notFoundResponse,
  successResponse,
  withErrorHandler,
  RouteContext,
} from '@manuraj/auth';


// POST /api/machines/:id/documents/prepare-upload
export const POST = withErrorHandler(async (req: NextRequest, context?: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.DOCUMENTS_UPLOAD);
  const { id: machineId } = await context!.params;

  const body = await req.json();
  const parsed = prepareUploadSchema.safeParse(body);

  if (!parsed.success) {
    return badRequestResponse(parsed.error.issues[0].message);
  }

  const { filename, contentType, size, type, title } = parsed.data;

  // Validate content type
  if (!isAllowedContentType(contentType)) {
    return badRequestResponse('Tipo de arquivo não permitido');
  }

  // Validate file size
  if (!isAllowedFileSize(size)) {
    return badRequestResponse('Tamanho de arquivo inválido (máximo 50MB)');
  }

  await connectDB();

  // Verify machine belongs to tenant
  const machine = await machineRepository.findById(user.tenantId, machineId);
  if (!machine) {
    return notFoundResponse('Máquina não encontrada');
  }

  // Generate S3 key with tenant prefix
  const s3Key = generateS3Key(user.tenantId, machineId, filename);

  // Generate pre-signed upload URL
  const { uploadUrl } = await generateUploadUrl(s3Key, contentType, size);

  return successResponse({
    uploadUrl,
    s3Key,
    metadata: {
      filename,
      contentType,
      size,
      type,
      title,
    },
  });
});
