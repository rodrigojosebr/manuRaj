import { Types } from 'mongoose';
import { PreventivePlanModel, PreventivePlanDocument } from '../models/preventive-plan.model';
import type { CreatePreventivePlanInput, UpdatePreventivePlanInput } from '@manuraj/domain';

export class PreventivePlanRepository {
  /**
   * IMPORTANT: All methods require tenantId to ensure tenant isolation.
   */

  async findById(tenantId: string, id: string): Promise<PreventivePlanDocument | null> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(tenantId)) return null;
    return PreventivePlanModel.findOne({
      _id: new Types.ObjectId(id),
      tenantId: new Types.ObjectId(tenantId),
    })
      .populate('machineId', 'name code')
      .lean();
  }

  async findByTenant(
    tenantId: string,
    options?: { machineId?: string; active?: boolean; page?: number; limit?: number }
  ): Promise<{ plans: PreventivePlanDocument[]; total: number }> {
    if (!Types.ObjectId.isValid(tenantId)) {
      return { plans: [], total: 0 };
    }

    const query: Record<string, unknown> = { tenantId: new Types.ObjectId(tenantId) };
    if (options?.machineId && Types.ObjectId.isValid(options.machineId)) {
      query.machineId = new Types.ObjectId(options.machineId);
    }
    if (options?.active !== undefined) query.active = options.active;

    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const [plans, total] = await Promise.all([
      PreventivePlanModel.find(query)
        .sort({ nextDueDate: 1 })
        .skip(skip)
        .limit(limit)
        .populate('machineId', 'name code')
        .lean(),
      PreventivePlanModel.countDocuments(query),
    ]);

    return { plans, total };
  }

  async findDueSoon(tenantId: string, days = 7): Promise<PreventivePlanDocument[]> {
    if (!Types.ObjectId.isValid(tenantId)) return [];

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    return PreventivePlanModel.find({
      tenantId: new Types.ObjectId(tenantId),
      active: true,
      nextDueDate: { $lte: dueDate },
    })
      .sort({ nextDueDate: 1 })
      .populate('machineId', 'name code')
      .lean();
  }

  async create(tenantId: string, data: CreatePreventivePlanInput): Promise<PreventivePlanDocument> {
    const plan = new PreventivePlanModel({
      tenantId: new Types.ObjectId(tenantId),
      machineId: new Types.ObjectId(data.machineId),
      name: data.name,
      periodicityDays: data.periodicityDays,
      checklistItems: data.checklistItems,
      nextDueDate: new Date(data.nextDueDate),
      active: data.active ?? true,
    });
    return plan.save();
  }

  async update(
    tenantId: string,
    id: string,
    data: UpdatePreventivePlanInput
  ): Promise<PreventivePlanDocument | null> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(tenantId)) return null;

    const updateData: Record<string, unknown> = {};
    if (data.name) updateData.name = data.name;
    if (data.periodicityDays) updateData.periodicityDays = data.periodicityDays;
    if (data.checklistItems) updateData.checklistItems = data.checklistItems;
    if (data.nextDueDate) updateData.nextDueDate = new Date(data.nextDueDate);
    if (data.active !== undefined) updateData.active = data.active;

    return PreventivePlanModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
      },
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('machineId', 'name code')
      .lean();
  }

  async advanceNextDueDate(tenantId: string, id: string): Promise<PreventivePlanDocument | null> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(tenantId)) return null;

    const plan = await PreventivePlanModel.findOne({
      _id: new Types.ObjectId(id),
      tenantId: new Types.ObjectId(tenantId),
    });

    if (!plan) return null;

    const newDueDate = new Date(plan.nextDueDate);
    newDueDate.setDate(newDueDate.getDate() + plan.periodicityDays);

    return PreventivePlanModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), tenantId: new Types.ObjectId(tenantId) },
      { $set: { nextDueDate: newDueDate } },
      { new: true }
    )
      .populate('machineId', 'name code')
      .lean();
  }

  async delete(tenantId: string, id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(tenantId)) return false;
    const result = await PreventivePlanModel.deleteOne({
      _id: new Types.ObjectId(id),
      tenantId: new Types.ObjectId(tenantId),
    });
    return result.deletedCount === 1;
  }

  async countDue(tenantId: string): Promise<number> {
    if (!Types.ObjectId.isValid(tenantId)) return 0;
    return PreventivePlanModel.countDocuments({
      tenantId: new Types.ObjectId(tenantId),
      active: true,
      nextDueDate: { $lte: new Date() },
    });
  }
}

export const preventivePlanRepository = new PreventivePlanRepository();
