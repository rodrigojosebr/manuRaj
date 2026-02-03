import { Types } from 'mongoose';
import { MachineModel, MachineDocument } from '../models/machine.model';
import type { CreateMachineInput, UpdateMachineInput, MachineStatus } from '@manuraj/domain';

export class MachineRepository {
  /**
   * IMPORTANT: All methods require tenantId to ensure tenant isolation.
   */

  async findById(tenantId: string, id: string): Promise<MachineDocument | null> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(tenantId)) return null;
    return MachineModel.findOne({
      _id: new Types.ObjectId(id),
      tenantId: new Types.ObjectId(tenantId),
    }).lean();
  }

  async findByCode(tenantId: string, code: string): Promise<MachineDocument | null> {
    if (!Types.ObjectId.isValid(tenantId)) return null;
    return MachineModel.findOne({
      tenantId: new Types.ObjectId(tenantId),
      code,
    }).lean();
  }

  async findByTenant(
    tenantId: string,
    options?: { status?: MachineStatus; location?: string; page?: number; limit?: number }
  ): Promise<{ machines: MachineDocument[]; total: number }> {
    if (!Types.ObjectId.isValid(tenantId)) {
      return { machines: [], total: 0 };
    }

    const query: Record<string, unknown> = { tenantId: new Types.ObjectId(tenantId) };
    if (options?.status) query.status = options.status;
    if (options?.location) query.location = options.location;

    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const [machines, total] = await Promise.all([
      MachineModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      MachineModel.countDocuments(query),
    ]);

    return { machines, total };
  }

  async create(tenantId: string, data: CreateMachineInput): Promise<MachineDocument> {
    const machine = new MachineModel({
      tenantId: new Types.ObjectId(tenantId),
      name: data.name,
      code: data.code,
      location: data.location,
      manufacturer: data.manufacturer,
      model: data.model,
      serial: data.serial,
      status: data.status || 'operational',
    });
    return machine.save();
  }

  async update(
    tenantId: string,
    id: string,
    data: UpdateMachineInput
  ): Promise<MachineDocument | null> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(tenantId)) return null;

    return MachineModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
      },
      { $set: data },
      { new: true, runValidators: true }
    ).lean();
  }

  async delete(tenantId: string, id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(tenantId)) return false;
    const result = await MachineModel.deleteOne({
      _id: new Types.ObjectId(id),
      tenantId: new Types.ObjectId(tenantId),
    });
    return result.deletedCount === 1;
  }

  async codeExistsInTenant(tenantId: string, code: string, excludeId?: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(tenantId)) return false;
    const query: Record<string, unknown> = {
      tenantId: new Types.ObjectId(tenantId),
      code,
    };
    if (excludeId && Types.ObjectId.isValid(excludeId)) {
      query._id = { $ne: new Types.ObjectId(excludeId) };
    }
    const count = await MachineModel.countDocuments(query);
    return count > 0;
  }

  async countByTenant(tenantId: string): Promise<number> {
    if (!Types.ObjectId.isValid(tenantId)) return 0;
    return MachineModel.countDocuments({ tenantId: new Types.ObjectId(tenantId) });
  }
}

export const machineRepository = new MachineRepository();
