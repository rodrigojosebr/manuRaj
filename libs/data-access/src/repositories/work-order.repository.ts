import { Types } from 'mongoose';
import { WorkOrderModel, WorkOrderDocument } from '../models/work-order.model';
import type {
  CreateWorkOrderInput,
  UpdateWorkOrderInput,
  FinishWorkOrderInput,
  WorkOrderStatus,
  WorkOrderType,
} from '@manuraj/domain';

export class WorkOrderRepository {
  /**
   * IMPORTANT: All methods require tenantId to ensure tenant isolation.
   */

  async findById(tenantId: string, id: string): Promise<WorkOrderDocument | null> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(tenantId)) return null;
    return WorkOrderModel.findOne({
      _id: new Types.ObjectId(id),
      tenantId: new Types.ObjectId(tenantId),
    })
      .populate('machineId', 'name code')
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name')
      .lean();
  }

  async findByTenant(
    tenantId: string,
    options?: {
      status?: WorkOrderStatus;
      type?: WorkOrderType;
      machineId?: string;
      assignedTo?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{ workOrders: WorkOrderDocument[]; total: number }> {
    if (!Types.ObjectId.isValid(tenantId)) {
      return { workOrders: [], total: 0 };
    }

    const query: Record<string, unknown> = { tenantId: new Types.ObjectId(tenantId) };
    if (options?.status) query.status = options.status;
    if (options?.type) query.type = options.type;
    if (options?.machineId && Types.ObjectId.isValid(options.machineId)) {
      query.machineId = new Types.ObjectId(options.machineId);
    }
    if (options?.assignedTo && Types.ObjectId.isValid(options.assignedTo)) {
      query.assignedTo = new Types.ObjectId(options.assignedTo);
    }

    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const [workOrders, total] = await Promise.all([
      WorkOrderModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('machineId', 'name code')
        .populate('assignedTo', 'name')
        .populate('createdBy', 'name')
        .lean(),
      WorkOrderModel.countDocuments(query),
    ]);

    return { workOrders, total };
  }

  async findAssignedToUser(
    tenantId: string,
    userId: string,
    options?: { status?: WorkOrderStatus; page?: number; limit?: number }
  ): Promise<{ workOrders: WorkOrderDocument[]; total: number }> {
    if (!Types.ObjectId.isValid(tenantId) || !Types.ObjectId.isValid(userId)) {
      return { workOrders: [], total: 0 };
    }

    const query: Record<string, unknown> = {
      tenantId: new Types.ObjectId(tenantId),
      assignedTo: new Types.ObjectId(userId),
    };
    if (options?.status) query.status = options.status;

    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const [workOrders, total] = await Promise.all([
      WorkOrderModel.find(query)
        .sort({ priority: -1, dueDate: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('machineId', 'name code')
        .lean(),
      WorkOrderModel.countDocuments(query),
    ]);

    return { workOrders, total };
  }

  async create(tenantId: string, userId: string, data: CreateWorkOrderInput): Promise<WorkOrderDocument> {
    const workOrder = new WorkOrderModel({
      tenantId: new Types.ObjectId(tenantId),
      machineId: new Types.ObjectId(data.machineId),
      type: data.type,
      status: data.assignedTo ? 'assigned' : 'open',
      priority: data.priority || 'medium',
      description: data.description,
      assignedTo: data.assignedTo ? new Types.ObjectId(data.assignedTo) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      createdBy: new Types.ObjectId(userId),
    });
    return workOrder.save();
  }

  async update(
    tenantId: string,
    id: string,
    data: UpdateWorkOrderInput
  ): Promise<WorkOrderDocument | null> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(tenantId)) return null;

    const updateData: Record<string, unknown> = {};
    if (data.priority) updateData.priority = data.priority;
    if (data.description) updateData.description = data.description;
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }
    if (data.notes !== undefined) updateData.notes = data.notes;

    return WorkOrderModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
      },
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('machineId', 'name code')
      .populate('assignedTo', 'name')
      .lean();
  }

  async assign(tenantId: string, id: string, assignedTo: string): Promise<WorkOrderDocument | null> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(tenantId) || !Types.ObjectId.isValid(assignedTo)) {
      return null;
    }

    return WorkOrderModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
        status: { $in: ['open', 'assigned'] },
      },
      {
        $set: {
          assignedTo: new Types.ObjectId(assignedTo),
          status: 'assigned',
        },
      },
      { new: true }
    )
      .populate('machineId', 'name code')
      .populate('assignedTo', 'name')
      .lean();
  }

  async start(tenantId: string, id: string, userId: string): Promise<WorkOrderDocument | null> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(tenantId)) return null;

    return WorkOrderModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
        assignedTo: new Types.ObjectId(userId),
        status: { $in: ['assigned', 'open'] },
      },
      {
        $set: {
          status: 'in_progress',
          startedAt: new Date(),
        },
      },
      { new: true }
    )
      .populate('machineId', 'name code')
      .lean();
  }

  async finish(
    tenantId: string,
    id: string,
    userId: string,
    data: FinishWorkOrderInput
  ): Promise<WorkOrderDocument | null> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(tenantId)) return null;

    const updateData: Record<string, unknown> = {
      status: 'completed',
      finishedAt: new Date(),
    };
    if (data.timeSpentMin !== undefined) updateData.timeSpentMin = data.timeSpentMin;
    if (data.partsUsed) updateData.partsUsed = data.partsUsed;
    if (data.notes) updateData.notes = data.notes;

    return WorkOrderModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
        assignedTo: new Types.ObjectId(userId),
        status: 'in_progress',
      },
      { $set: updateData },
      { new: true }
    )
      .populate('machineId', 'name code')
      .lean();
  }

  async cancel(tenantId: string, id: string): Promise<WorkOrderDocument | null> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(tenantId)) return null;

    return WorkOrderModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
        status: { $nin: ['completed', 'cancelled'] },
      },
      { $set: { status: 'cancelled' } },
      { new: true }
    ).lean();
  }

  async delete(tenantId: string, id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(tenantId)) return false;
    const result = await WorkOrderModel.deleteOne({
      _id: new Types.ObjectId(id),
      tenantId: new Types.ObjectId(tenantId),
    });
    return result.deletedCount === 1;
  }

  // Metrics helpers
  async countByStatus(tenantId: string, status: WorkOrderStatus): Promise<number> {
    if (!Types.ObjectId.isValid(tenantId)) return 0;
    return WorkOrderModel.countDocuments({
      tenantId: new Types.ObjectId(tenantId),
      status,
    });
  }

  async countOverdue(tenantId: string): Promise<number> {
    if (!Types.ObjectId.isValid(tenantId)) return 0;
    return WorkOrderModel.countDocuments({
      tenantId: new Types.ObjectId(tenantId),
      status: { $nin: ['completed', 'cancelled'] },
      dueDate: { $lt: new Date() },
    });
  }

  async countCompletedThisMonth(tenantId: string): Promise<number> {
    if (!Types.ObjectId.isValid(tenantId)) return 0;
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return WorkOrderModel.countDocuments({
      tenantId: new Types.ObjectId(tenantId),
      status: 'completed',
      finishedAt: { $gte: startOfMonth },
    });
  }

  async getAvgCompletionTime(tenantId: string): Promise<number> {
    if (!Types.ObjectId.isValid(tenantId)) return 0;

    const result = await WorkOrderModel.aggregate([
      {
        $match: {
          tenantId: new Types.ObjectId(tenantId),
          status: 'completed',
          timeSpentMin: { $exists: true, $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: '$timeSpentMin' },
        },
      },
    ]);

    return result[0]?.avgTime || 0;
  }
}

export const workOrderRepository = new WorkOrderRepository();
