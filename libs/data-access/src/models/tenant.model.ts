import mongoose, { Schema, Document, Model } from 'mongoose';
import type { Tenant } from '@manuraj/domain';

export interface TenantDocument extends Omit<Tenant, '_id'>, Document {}

const tenantSchema = new Schema<TenantDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 50,
      match: /^[a-z0-9-]+$/,
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    adsEnabled: {
      type: Boolean,
      default: true,
    },
    adUnitIds: {
      type: [String],
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'tenants',
  }
);

// Indexes
tenantSchema.index({ slug: 1 }, { unique: true });
tenantSchema.index({ active: 1 });

// Prevent model recompilation in hot reload
export const TenantModel: Model<TenantDocument> =
  mongoose.models.Tenant || mongoose.model<TenantDocument>('Tenant', tenantSchema);
