import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import type { PreventivePlan, ChecklistItem } from '@manuraj/domain';

export interface PreventivePlanDocument extends Omit<PreventivePlan, '_id' | 'tenantId' | 'machineId'>, Document {
  tenantId: Types.ObjectId;
  machineId: Types.ObjectId;
}

const checklistItemSchema = new Schema<ChecklistItem>(
  {
    label: { type: String, required: true, maxlength: 500 },
    required: { type: Boolean, required: true },
  },
  { _id: false }
);

const preventivePlanSchema = new Schema<PreventivePlanDocument>(
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
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    periodicityDays: {
      type: Number,
      required: true,
      min: 1,
      max: 365 * 5,
    },
    checklistItems: {
      type: [checklistItemSchema],
      required: true,
      validate: {
        validator: (v: ChecklistItem[]) => v.length >= 1 && v.length <= 50,
        message: 'Checklist must have between 1 and 50 items',
      },
    },
    nextDueDate: {
      type: Date,
      required: true,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'preventive_plans',
  }
);

// Indexes
preventivePlanSchema.index({ tenantId: 1, machineId: 1 });
preventivePlanSchema.index({ tenantId: 1, active: 1 });
preventivePlanSchema.index({ tenantId: 1, nextDueDate: 1 });

// Prevent model recompilation in hot reload
export const PreventivePlanModel: Model<PreventivePlanDocument> =
  mongoose.models.PreventivePlan || mongoose.model<PreventivePlanDocument>('PreventivePlan', preventivePlanSchema);
