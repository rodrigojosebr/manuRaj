import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import type { User, UserRole } from '@manuraj/domain';

export interface UserDocument extends Omit<User, '_id' | 'tenantId'>, Document {
  tenantId: Types.ObjectId;
}

const userSchema = new Schema<UserDocument>(
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
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 255,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['operator', 'maintainer', 'maintenance_supervisor', 'general_supervisor', 'super_admin'] as UserRole[],
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Compound unique index: email is unique per tenant
userSchema.index({ tenantId: 1, email: 1 }, { unique: true });
userSchema.index({ tenantId: 1, role: 1 });
userSchema.index({ tenantId: 1, active: 1 });

// Prevent model recompilation in hot reload
export const UserModel: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);
