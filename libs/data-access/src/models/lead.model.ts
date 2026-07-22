import mongoose, { Schema, Document, Model } from 'mongoose';
import type { LeadStatus } from '@manuraj/domain';

export interface LeadDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source: string;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 200,
    },
    phone: {
      type: String,
      maxlength: 30,
    },
    company: {
      type: String,
      maxlength: 100,
    },
    message: {
      type: String,
      maxlength: 2000,
    },
    source: {
      type: String,
      default: 'showroom',
      maxlength: 50,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'discarded'] as LeadStatus[],
      default: 'new',
    },
  },
  {
    timestamps: true,
    collection: 'leads',
  }
);

// Query indexes
leadSchema.index({ createdAt: -1 });
leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ email: 1 });

// Prevent model recompilation in hot reload
export const LeadModel: Model<LeadDocument> =
  mongoose.models.Lead || mongoose.model<LeadDocument>('Lead', leadSchema);
