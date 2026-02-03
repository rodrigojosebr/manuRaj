import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import type { MachineDocument as MachineDoc, DocumentType } from '@manuraj/domain';

export interface MachineDocumentDocument extends Omit<MachineDoc, '_id' | 'tenantId' | 'machineId' | 'uploadedBy'>, Document {
  tenantId: Types.ObjectId;
  machineId: Types.ObjectId;
  uploadedBy: Types.ObjectId;
}

const machineDocumentSchema = new Schema<MachineDocumentDocument>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true,
    },
    machineId: {
      type: Schema.Types.ObjectId,
      ref: 'Machine',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['manual', 'drawing', 'certificate', 'photo', 'other'] as DocumentType[],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    s3Key: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
      maxlength: 100,
    },
    size: {
      type: Number,
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'machine_documents',
  }
);

// Indexes
machineDocumentSchema.index({ tenantId: 1, machineId: 1 });
machineDocumentSchema.index({ tenantId: 1, type: 1 });

// Prevent model recompilation in hot reload
export const MachineDocumentModel: Model<MachineDocumentDocument> =
  mongoose.models.MachineDocument || mongoose.model<MachineDocumentDocument>('MachineDocument', machineDocumentSchema);
