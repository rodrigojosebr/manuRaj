import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import type { Machine, MachineStatus } from '@manuraj/domain';

export interface MachineDocument extends Omit<Machine, '_id' | 'tenantId'>, Document {
  tenantId: Types.ObjectId;
}

const machineSchema = new Schema<MachineDocument>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    manufacturer: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    model: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    serial: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['operational', 'maintenance', 'stopped', 'decommissioned'] as MachineStatus[],
      default: 'operational',
    },
  },
  {
    timestamps: true,
    collection: 'machines',
  }
);

// Compound unique index: code is unique per tenant
machineSchema.index({ tenantId: 1, code: 1 }, { unique: true });
machineSchema.index({ tenantId: 1, status: 1 });
machineSchema.index({ tenantId: 1, location: 1 });

// Prevent model recompilation in hot reload
export const MachineModel: Model<MachineDocument> =
  mongoose.models.Machine || mongoose.model<MachineDocument>('Machine', machineSchema);
