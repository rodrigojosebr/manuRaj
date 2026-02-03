import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserModel, UserDocument } from '../models/user.model';
import type { CreateUserInput, UpdateUserInput, UserRole } from '@manuraj/domain';

export interface CreateUserData extends Omit<CreateUserInput, 'password'> {
  tenantId: string;
  passwordHash: string;
}

export class UserRepository {
  /**
   * IMPORTANT: All methods that query users require tenantId to ensure tenant isolation.
   * Only findByIdGlobal bypasses this for super_admin operations.
   */

  async findById(tenantId: string, id: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(tenantId)) return null;
    return UserModel.findOne({
      _id: new Types.ObjectId(id),
      tenantId: new Types.ObjectId(tenantId),
    }).lean();
  }

  // For super_admin operations only - use with caution
  async findByIdGlobal(id: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return UserModel.findById(id).lean();
  }

  async findByEmail(tenantId: string, email: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(tenantId)) return null;
    return UserModel.findOne({
      tenantId: new Types.ObjectId(tenantId),
      email: email.toLowerCase(),
    }).lean();
  }

  // For login - finds user by email across any tenant (email + tenant slug validation happens at login)
  async findByEmailForLogin(email: string): Promise<(UserDocument & { tenantId: Types.ObjectId })[] | null> {
    return UserModel.find({ email: email.toLowerCase() })
      .populate('tenantId', 'slug name active')
      .lean();
  }

  async findByTenant(
    tenantId: string,
    options?: { role?: UserRole; active?: boolean; page?: number; limit?: number }
  ): Promise<{ users: UserDocument[]; total: number }> {
    if (!Types.ObjectId.isValid(tenantId)) {
      return { users: [], total: 0 };
    }

    const query: Record<string, unknown> = { tenantId: new Types.ObjectId(tenantId) };
    if (options?.role) query.role = options.role;
    if (options?.active !== undefined) query.active = options.active;

    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      UserModel.find(query)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserModel.countDocuments(query),
    ]);

    return { users, total };
  }

  async create(data: CreateUserData): Promise<UserDocument> {
    const user = new UserModel({
      tenantId: new Types.ObjectId(data.tenantId),
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      role: data.role,
      active: true,
    });
    return user.save();
  }

  async update(
    tenantId: string,
    id: string,
    data: UpdateUserInput
  ): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(tenantId)) return null;

    const updateData: Record<string, unknown> = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email.toLowerCase();
    if (data.role) updateData.role = data.role;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 12);
    }

    return UserModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
      },
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .select('-passwordHash')
      .lean();
  }

  async deactivate(tenantId: string, id: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(tenantId)) return null;
    return UserModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
      },
      { $set: { active: false } },
      { new: true }
    )
      .select('-passwordHash')
      .lean();
  }

  async activate(tenantId: string, id: string): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(tenantId)) return null;
    return UserModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
      },
      { $set: { active: true } },
      { new: true }
    )
      .select('-passwordHash')
      .lean();
  }

  async emailExistsInTenant(tenantId: string, email: string, excludeId?: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(tenantId)) return false;
    const query: Record<string, unknown> = {
      tenantId: new Types.ObjectId(tenantId),
      email: email.toLowerCase(),
    };
    if (excludeId && Types.ObjectId.isValid(excludeId)) {
      query._id = { $ne: new Types.ObjectId(excludeId) };
    }
    const count = await UserModel.countDocuments(query);
    return count > 0;
  }

  async verifyPassword(user: UserDocument, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }
}

export const userRepository = new UserRepository();
