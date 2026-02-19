import { Types } from 'mongoose';
import { AuditLogModel, AuditLogDocument } from '../models/audit-log.model';
import type { AuditAction, AuditEntity } from '@manuraj/domain';

export interface AuditLogEntry {
  tenantId: string;
  userId: string;
  userName: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  changes?: Record<string, { from: unknown; to: unknown }>;
  metadata?: Record<string, unknown>;
}

export class AuditLogRepository {
  /**
   * Log an audit entry. Designed to be called fire-and-forget:
   * `void auditLogRepository.log({ ... })`
   */
  async log(entry: AuditLogEntry): Promise<void> {
    await AuditLogModel.create({
      tenantId: new Types.ObjectId(entry.tenantId),
      userId: new Types.ObjectId(entry.userId),
      userName: entry.userName,
      action: entry.action,
      entity: entry.entity,
      entityId: new Types.ObjectId(entry.entityId),
      changes: entry.changes,
      metadata: entry.metadata,
    });
  }

  async findByEntity(
    tenantId: string,
    entity: AuditEntity,
    entityId: string,
    options?: { page?: number; limit?: number }
  ): Promise<{ logs: AuditLogDocument[]; total: number }> {
    if (!Types.ObjectId.isValid(tenantId) || !Types.ObjectId.isValid(entityId)) {
      return { logs: [], total: 0 };
    }

    const query = {
      tenantId: new Types.ObjectId(tenantId),
      entity,
      entityId: new Types.ObjectId(entityId),
    };

    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLogModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      AuditLogModel.countDocuments(query),
    ]);

    return { logs, total };
  }

  async findByUser(
    tenantId: string,
    userId: string,
    options?: { page?: number; limit?: number }
  ): Promise<{ logs: AuditLogDocument[]; total: number }> {
    if (!Types.ObjectId.isValid(tenantId) || !Types.ObjectId.isValid(userId)) {
      return { logs: [], total: 0 };
    }

    const query = {
      tenantId: new Types.ObjectId(tenantId),
      userId: new Types.ObjectId(userId),
    };

    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLogModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      AuditLogModel.countDocuments(query),
    ]);

    return { logs, total };
  }

  async findByTenant(
    tenantId: string,
    options?: { page?: number; limit?: number }
  ): Promise<{ logs: AuditLogDocument[]; total: number }> {
    if (!Types.ObjectId.isValid(tenantId)) {
      return { logs: [], total: 0 };
    }

    const query = { tenantId: new Types.ObjectId(tenantId) };

    const page = options?.page || 1;
    const limit = options?.limit || 50;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLogModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      AuditLogModel.countDocuments(query),
    ]);

    return { logs, total };
  }
}

export const auditLogRepository = new AuditLogRepository();
