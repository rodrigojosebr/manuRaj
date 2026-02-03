import { Types } from 'mongoose';
import { MachineDocumentModel, MachineDocumentDocument } from '../models/machine-document.model';
import type { DocumentType } from '@manuraj/domain';

export interface CreateDocumentData {
  tenantId: string;
  machineId: string;
  type: DocumentType;
  title: string;
  s3Key: string;
  contentType: string;
  size: number;
  uploadedBy: string;
}

export class MachineDocumentRepository {
  /**
   * IMPORTANT: All methods require tenantId to ensure tenant isolation.
   */

  async findById(tenantId: string, id: string): Promise<MachineDocumentDocument | null> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(tenantId)) return null;
    return MachineDocumentModel.findOne({
      _id: new Types.ObjectId(id),
      tenantId: new Types.ObjectId(tenantId),
    }).lean();
  }

  async findByMachine(
    tenantId: string,
    machineId: string,
    options?: { type?: DocumentType; page?: number; limit?: number }
  ): Promise<{ documents: MachineDocumentDocument[]; total: number }> {
    if (!Types.ObjectId.isValid(tenantId) || !Types.ObjectId.isValid(machineId)) {
      return { documents: [], total: 0 };
    }

    const query: Record<string, unknown> = {
      tenantId: new Types.ObjectId(tenantId),
      machineId: new Types.ObjectId(machineId),
    };
    if (options?.type) query.type = options.type;

    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      MachineDocumentModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('uploadedBy', 'name')
        .lean(),
      MachineDocumentModel.countDocuments(query),
    ]);

    return { documents, total };
  }

  async create(data: CreateDocumentData): Promise<MachineDocumentDocument> {
    const doc = new MachineDocumentModel({
      tenantId: new Types.ObjectId(data.tenantId),
      machineId: new Types.ObjectId(data.machineId),
      type: data.type,
      title: data.title,
      s3Key: data.s3Key,
      contentType: data.contentType,
      size: data.size,
      uploadedBy: new Types.ObjectId(data.uploadedBy),
    });
    return doc.save();
  }

  async delete(tenantId: string, id: string): Promise<MachineDocumentDocument | null> {
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(tenantId)) return null;
    return MachineDocumentModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      tenantId: new Types.ObjectId(tenantId),
    }).lean();
  }

  async countByMachine(tenantId: string, machineId: string): Promise<number> {
    if (!Types.ObjectId.isValid(tenantId) || !Types.ObjectId.isValid(machineId)) return 0;
    return MachineDocumentModel.countDocuments({
      tenantId: new Types.ObjectId(tenantId),
      machineId: new Types.ObjectId(machineId),
    });
  }
}

export const machineDocumentRepository = new MachineDocumentRepository();
