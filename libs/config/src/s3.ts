import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// S3 Configuration
const s3Config = {
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
};

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'manuraj-documents';
const PRESIGNED_URL_EXPIRY = 60 * 15; // 15 minutes
const DOWNLOAD_URL_EXPIRY = 60 * 60; // 1 hour

// Lazy initialization to avoid issues during build
let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client(s3Config);
  }
  return s3Client;
}

/**
 * Sanitize filename for S3 key
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

/**
 * Generate S3 key for a document
 * Format: tenants/{tenantId}/machines/{machineId}/docs/{uuid}-{filename}
 */
export function generateS3Key(tenantId: string, machineId: string, filename: string): string {
  const sanitized = sanitizeFilename(filename);
  const uuid = uuidv4();
  return `tenants/${tenantId}/machines/${machineId}/docs/${uuid}-${sanitized}`;
}

/**
 * Generate a pre-signed URL for uploading a file to S3
 */
export async function generateUploadUrl(
  s3Key: string,
  contentType: string,
  maxSize?: number
): Promise<{ uploadUrl: string; s3Key: string }> {
  const client = getS3Client();

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
    ContentType: contentType,
    ...(maxSize && { ContentLength: maxSize }),
  });

  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: PRESIGNED_URL_EXPIRY,
  });

  return { uploadUrl, s3Key };
}

/**
 * Generate a pre-signed URL for downloading a file from S3
 */
export async function generateDownloadUrl(s3Key: string): Promise<string> {
  const client = getS3Client();

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
  });

  return getSignedUrl(client, command, {
    expiresIn: DOWNLOAD_URL_EXPIRY,
  });
}

/**
 * Delete a file from S3
 */
export async function deleteFromS3(s3Key: string): Promise<void> {
  const client = getS3Client();

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
  });

  await client.send(command);
}

/**
 * Validate that an S3 key belongs to a specific tenant
 * This is a security check to prevent accessing other tenant's files
 */
export function validateS3KeyForTenant(s3Key: string, tenantId: string): boolean {
  return s3Key.startsWith(`tenants/${tenantId}/`);
}

/**
 * Get allowed content types for document uploads
 */
export const ALLOWED_CONTENT_TYPES = [
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  // Other
  'text/plain',
  'text/csv',
];

/**
 * Validate content type
 */
export function isAllowedContentType(contentType: string): boolean {
  return ALLOWED_CONTENT_TYPES.includes(contentType);
}

/**
 * Maximum file size (50MB)
 */
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Validate file size
 */
export function isAllowedFileSize(size: number): boolean {
  return size > 0 && size <= MAX_FILE_SIZE;
}
