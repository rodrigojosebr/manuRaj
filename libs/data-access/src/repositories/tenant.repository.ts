import { Types } from 'mongoose';
import { TenantModel, TenantDocument } from '../models/tenant.model';
import type { CreateTenantInput, UpdateTenantInput } from '@manuraj/domain';

export class TenantRepository {
  async findById(id: string): Promise<TenantDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return TenantModel.findById(id).lean();
  }

  async findBySlug(slug: string): Promise<TenantDocument | null> {
    return TenantModel.findOne({ slug: slug.toLowerCase() }).lean();
  }

  async findAll(includeInactive = false): Promise<TenantDocument[]> {
    const query = includeInactive ? {} : { active: true };
    return TenantModel.find(query).sort({ createdAt: -1 }).lean();
  }

  async create(data: CreateTenantInput): Promise<TenantDocument> {
    const tenant = new TenantModel({
      name: data.name,
      slug: data.slug.toLowerCase(),
      plan: data.plan || 'free',
      adsEnabled: data.adsEnabled ?? true,
      adUnitIds: data.adUnitIds || [],
      active: true,
    });
    return tenant.save();
  }

  async update(id: string, data: UpdateTenantInput): Promise<TenantDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return TenantModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();
  }

  async deactivate(id: string): Promise<TenantDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return TenantModel.findByIdAndUpdate(
      id,
      { $set: { active: false } },
      { new: true }
    ).lean();
  }

  async activate(id: string): Promise<TenantDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return TenantModel.findByIdAndUpdate(
      id,
      { $set: { active: true } },
      { new: true }
    ).lean();
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const query: Record<string, unknown> = { slug: slug.toLowerCase() };
    if (excludeId && Types.ObjectId.isValid(excludeId)) {
      query._id = { $ne: new Types.ObjectId(excludeId) };
    }
    const count = await TenantModel.countDocuments(query);
    return count > 0;
  }
}

export const tenantRepository = new TenantRepository();
