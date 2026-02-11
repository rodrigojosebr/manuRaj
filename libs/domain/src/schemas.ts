import { z } from 'zod';

// Reusable schemas
export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId');

// User roles enum
export const userRoleSchema = z.enum([
  'operator',
  'maintainer',
  'maintenance_supervisor',
  'general_supervisor',
  'super_admin',
]);

// --- Auth Schemas ---
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  tenantName: z.string().min(2, 'Company name must be at least 2 characters').max(100),
  tenantSlug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  userName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// --- Tenant Schemas ---
export const createTenantSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
  plan: z.enum(['free', 'pro', 'enterprise']).default('free'),
  adsEnabled: z.boolean().default(true),
  adUnitIds: z.array(z.string()).optional(),
});

export const updateTenantSchema = createTenantSchema.partial();

// --- User Schemas ---
export const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  role: userRoleSchema,
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: userRoleSchema.optional(),
  active: z.boolean().optional(),
});

// --- Machine Schemas ---
export const machineStatusSchema = z.enum(['operational', 'maintenance', 'stopped', 'decommissioned']);

export const createMachineSchema = z.object({
  name: z.string().min(1).max(200),
  code: z.string().min(1).max(50),
  location: z.string().max(200).optional(),
  manufacturer: z.string().max(200).optional(),
  model: z.string().max(200).optional(),
  serial: z.string().max(100).optional(),
  status: machineStatusSchema.default('operational'),
});

export const updateMachineSchema = createMachineSchema.partial();

// --- Document Schemas ---
export const documentTypeSchema = z.enum(['manual', 'drawing', 'certificate', 'photo', 'other']);

export const prepareUploadSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1).max(100),
  size: z.number().int().positive().max(50 * 1024 * 1024), // Max 50MB
  type: documentTypeSchema,
  title: z.string().min(1).max(200),
});

export const confirmUploadSchema = z.object({
  s3Key: z.string().min(1),
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1).max(100),
  size: z.number().int().positive(),
  type: documentTypeSchema,
  title: z.string().min(1).max(200),
});

// --- Work Order Schemas ---
export const workOrderTypeSchema = z.enum(['corrective', 'preventive', 'request']);
export const workOrderStatusSchema = z.enum(['open', 'assigned', 'in_progress', 'completed', 'cancelled']);
export const workOrderPrioritySchema = z.enum(['low', 'medium', 'high', 'critical']);

export const partUsedSchema = z.object({
  name: z.string().min(1).max(200),
  qty: z.number().positive(),
  unit: z.string().max(50).optional(),
});

export const createWorkOrderSchema = z.object({
  machineId: objectIdSchema,
  type: workOrderTypeSchema,
  priority: workOrderPrioritySchema.default('medium'),
  description: z.string().min(1).max(2000),
  assignedTo: objectIdSchema.optional(),
  dueDate: z.string().datetime().optional(),
});

export const updateWorkOrderSchema = z.object({
  priority: workOrderPrioritySchema.optional(),
  description: z.string().min(1).max(2000).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  notes: z.string().max(5000).optional(),
});

export const assignWorkOrderSchema = z.object({
  assignedTo: objectIdSchema,
});

export const finishWorkOrderSchema = z.object({
  timeSpentMin: z.number().int().nonnegative().optional(),
  partsUsed: z.array(partUsedSchema).optional(),
  notes: z.string().max(5000).optional(),
});

// --- Preventive Plan Schemas ---
export const checklistItemSchema = z.object({
  label: z.string().min(1).max(500),
  required: z.boolean(),
});

export const createPreventivePlanSchema = z.object({
  machineId: objectIdSchema,
  name: z.string().min(1).max(200),
  periodicityDays: z.number().int().positive().max(365 * 5),
  checklistItems: z.array(checklistItemSchema).min(1).max(50),
  nextDueDate: z.string().datetime(),
  active: z.boolean().default(true),
});

export const updatePreventivePlanSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  periodicityDays: z.number().int().positive().max(365 * 5).optional(),
  checklistItems: z.array(checklistItemSchema).min(1).max(50).optional(),
  nextDueDate: z.string().datetime().optional(),
  active: z.boolean().optional(),
});

// --- Profile Self-Service Schemas (Torque /config) ---
export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

// --- Query Schemas ---
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const workOrderQuerySchema = paginationSchema.extend({
  status: workOrderStatusSchema.optional(),
  type: workOrderTypeSchema.optional(),
  machineId: objectIdSchema.optional(),
  assignedTo: objectIdSchema.optional(),
});

// Export types inferred from schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type CreateTenantInput = z.infer<typeof createTenantSchema>;
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateMachineInput = z.infer<typeof createMachineSchema>;
export type UpdateMachineInput = z.infer<typeof updateMachineSchema>;
export type PrepareUploadInput = z.infer<typeof prepareUploadSchema>;
export type ConfirmUploadInput = z.infer<typeof confirmUploadSchema>;
export type CreateWorkOrderInput = z.infer<typeof createWorkOrderSchema>;
export type UpdateWorkOrderInput = z.infer<typeof updateWorkOrderSchema>;
export type AssignWorkOrderInput = z.infer<typeof assignWorkOrderSchema>;
export type FinishWorkOrderInput = z.infer<typeof finishWorkOrderSchema>;
export type CreatePreventivePlanInput = z.infer<typeof createPreventivePlanSchema>;
export type UpdatePreventivePlanInput = z.infer<typeof updatePreventivePlanSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type WorkOrderQueryInput = z.infer<typeof workOrderQuerySchema>;
