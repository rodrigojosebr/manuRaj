import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import type { WorkOrder, WorkOrderType, WorkOrderStatus, WorkOrderPriority, PartUsed } from '@manuraj/domain';

export interface WorkOrderDocument extends Omit<WorkOrder, '_id' | 'tenantId' | 'machineId' | 'assignedTo' | 'createdBy' | 'attachments'>, Document {
  tenantId: Types.ObjectId;
  machineId: Types.ObjectId;
  assignedTo?: Types.ObjectId;
  createdBy: Types.ObjectId;
  attachments?: Types.ObjectId[];
}

const partUsedSchema = new Schema<PartUsed>(
  {
    name: { type: String, required: true, maxlength: 200 },
    qty: { type: Number, required: true, min: 0 },
    unit: { type: String, maxlength: 50 },
  },
  { _id: false }
);

const workOrderSchema = new Schema<WorkOrderDocument>(
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
    type: {
      type: String,
      enum: ['corrective', 'preventive', 'request'] as WorkOrderType[],
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'assigned', 'in_progress', 'completed', 'cancelled'] as WorkOrderStatus[],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'] as WorkOrderPriority[],
      default: 'medium',
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    dueDate: {
      type: Date,
    },
    startedAt: {
      type: Date,
    },
    finishedAt: {
      type: Date,
    },
    timeSpentMin: {
      type: Number,
      min: 0,
    },
    partsUsed: {
      type: [partUsedSchema],
      default: [],
    },
    notes: {
      type: String,
      maxlength: 5000,
    },
    attachments: {
      type: [Schema.Types.ObjectId],
      ref: 'MachineDocument',
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'work_orders',
  }
);

// Indexes for common queries
workOrderSchema.index({ tenantId: 1, status: 1 });
workOrderSchema.index({ tenantId: 1, machineId: 1 });
workOrderSchema.index({ tenantId: 1, assignedTo: 1 });
workOrderSchema.index({ tenantId: 1, type: 1 });
workOrderSchema.index({ tenantId: 1, dueDate: 1 });
workOrderSchema.index({ tenantId: 1, createdAt: -1 });

// Prevent model recompilation in hot reload
export const WorkOrderModel: Model<WorkOrderDocument> =
  mongoose.models.WorkOrder || mongoose.model<WorkOrderDocument>('WorkOrder', workOrderSchema);
