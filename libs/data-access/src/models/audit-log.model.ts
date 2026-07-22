import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import type { AuditAction, AuditEntity } from '@manuraj/domain';

export interface AuditLogDocument extends Document {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: Types.ObjectId;
  changes?: Record<string, { from: unknown; to: unknown }>;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const auditLogSchema = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
      maxlength: 200,
    },
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'login', 'start', 'finish', 'assign'] as AuditAction[],
      required: true,
    },
    entity: {
      type: String,
      enum: ['machine', 'work_order', 'user', 'tenant', 'preventive_plan', 'document'] as AuditEntity[],
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    changes: {
      type: Schema.Types.Mixed,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'audit_logs',
  }
);

// Query indexes
auditLogSchema.index({ tenantId: 1, createdAt: -1 });
auditLogSchema.index({ tenantId: 1, entity: 1, entityId: 1, createdAt: -1 });
auditLogSchema.index({ tenantId: 1, userId: 1, createdAt: -1 });

// TTL: auto-delete after 1 year
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

// Prevent model recompilation in hot reload
export const AuditLogModel: Model<AuditLogDocument> =
  mongoose.models.AuditLog || mongoose.model<AuditLogDocument>('AuditLog', auditLogSchema);
