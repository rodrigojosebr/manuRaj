// User roles
export type UserRole =
  | 'operator'
  | 'maintainer'
  | 'maintenance_supervisor'
  | 'general_supervisor'
  | 'super_admin';

// Tenant
export interface Tenant {
  _id: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  adsEnabled: boolean;
  adUnitIds?: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User
export interface User {
  _id: string;
  tenantId: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPublic {
  _id: string;
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
}

// Machine status
export type MachineStatus = 'operational' | 'maintenance' | 'stopped' | 'decommissioned';

// Machine
export interface Machine {
  _id: string;
  tenantId: string;
  name: string;
  code: string;
  location?: string;
  manufacturer?: string;
  model?: string;
  serial?: string;
  status: MachineStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Machine Document Types
export type DocumentType = 'manual' | 'drawing' | 'certificate' | 'photo' | 'other';

// Machine Document
export interface MachineDocument {
  _id: string;
  tenantId: string;
  machineId: string;
  type: DocumentType;
  title: string;
  s3Key: string;
  contentType: string;
  size: number;
  uploadedBy: string;
  createdAt: Date;
}

// Work Order Types
export type WorkOrderType = 'corrective' | 'preventive' | 'request';

// Work Order Status
export type WorkOrderStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

// Work Order Priority
export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'critical';

// Parts used in work order
export interface PartUsed {
  name: string;
  qty: number;
  unit?: string;
}

// Work Order
export interface WorkOrder {
  _id: string;
  tenantId: string;
  machineId: string;
  type: WorkOrderType;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  description: string;
  assignedTo?: string;
  dueDate?: Date;
  startedAt?: Date;
  finishedAt?: Date;
  timeSpentMin?: number;
  partsUsed?: PartUsed[];
  notes?: string;
  attachments?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Checklist Item for Preventive Plans
export interface ChecklistItem {
  label: string;
  required: boolean;
}

// Preventive Plan
export interface PreventivePlan {
  _id: string;
  tenantId: string;
  machineId: string;
  name: string;
  periodicityDays: number;
  checklistItems: ChecklistItem[];
  nextDueDate: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Session User (used in auth)
export interface SessionUser {
  id: string;
  tenantId: string;
  tenantSlug: string;
  name: string;
  email: string;
  role: UserRole;
}

// API Error Response
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// API Success Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Metrics Response
export interface MetricsResponse {
  totalMachines: number;
  openWorkOrders: number;
  overdueWorkOrders: number;
  completedThisMonth: number;
  avgCompletionTimeMin: number;
  preventivePlansDue: number;
}
