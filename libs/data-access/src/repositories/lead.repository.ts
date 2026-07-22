import { LeadModel, LeadDocument } from '../models/lead.model';

export interface CreateLeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: string;
}

export class LeadRepository {
  /**
   * Create a new lead from the public landing page.
   * Not tenant-scoped — leads exist before any tenant is created.
   */
  async create(data: CreateLeadData): Promise<LeadDocument> {
    return LeadModel.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      message: data.message,
      source: data.source || 'showroom',
    });
  }

  async findAll(options?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ leads: LeadDocument[]; total: number }> {
    const query = options?.status ? { status: options.status } : {};

    const page = options?.page || 1;
    const limit = options?.limit || 50;
    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      LeadModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      LeadModel.countDocuments(query),
    ]);

    return { leads, total };
  }
}

export const leadRepository = new LeadRepository();
