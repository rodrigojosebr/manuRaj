/**
 * Zod Schema Validation Tests
 *
 * Tests for all Zod schemas used for input validation.
 * Run with: npx vitest run tests/domain/schemas.test.ts
 */

import { describe, it, expect } from 'vitest';
import {
  objectIdSchema,
  userRoleSchema,
  loginSchema,
  signupSchema,
  createUserSchema,
  updateUserSchema,
  createMachineSchema,
  updateMachineSchema,
  machineStatusSchema,
  documentTypeSchema,
  prepareUploadSchema,
  workOrderTypeSchema,
  workOrderStatusSchema,
  workOrderPrioritySchema,
  createWorkOrderSchema,
  finishWorkOrderSchema,
  createPreventivePlanSchema,
  paginationSchema,
} from '@manuraj/domain';

describe('Zod Schemas', () => {
  describe('objectIdSchema', () => {
    it('should accept valid MongoDB ObjectId', () => {
      const validId = '507f1f77bcf86cd799439011';
      expect(objectIdSchema.safeParse(validId).success).toBe(true);
    });

    it('should accept uppercase ObjectId', () => {
      const validId = '507F1F77BCF86CD799439011';
      expect(objectIdSchema.safeParse(validId).success).toBe(true);
    });

    it('should reject invalid ObjectId (wrong length)', () => {
      const invalidId = '507f1f77bcf86cd79943901'; // 23 chars
      expect(objectIdSchema.safeParse(invalidId).success).toBe(false);
    });

    it('should reject invalid ObjectId (invalid chars)', () => {
      const invalidId = '507f1f77bcf86cd79943901z'; // 'z' is invalid
      expect(objectIdSchema.safeParse(invalidId).success).toBe(false);
    });

    it('should reject empty string', () => {
      expect(objectIdSchema.safeParse('').success).toBe(false);
    });
  });

  describe('userRoleSchema', () => {
    it('should accept all valid roles', () => {
      const validRoles = [
        'operator',
        'maintainer',
        'maintenance_supervisor',
        'general_supervisor',
        'super_admin',
      ];
      validRoles.forEach((role) => {
        expect(userRoleSchema.safeParse(role).success).toBe(true);
      });
    });

    it('should reject invalid role', () => {
      expect(userRoleSchema.safeParse('admin').success).toBe(false);
      expect(userRoleSchema.safeParse('user').success).toBe(false);
      expect(userRoleSchema.safeParse('').success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('should accept valid login data', () => {
      const data = { email: 'user@example.com', password: '123456' };
      expect(loginSchema.safeParse(data).success).toBe(true);
    });

    it('should reject invalid email', () => {
      const data = { email: 'not-an-email', password: '123456' };
      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const data = { email: 'user@example.com', password: '12345' };
      const result = loginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject missing fields', () => {
      expect(loginSchema.safeParse({ email: 'user@example.com' }).success).toBe(false);
      expect(loginSchema.safeParse({ password: '123456' }).success).toBe(false);
      expect(loginSchema.safeParse({}).success).toBe(false);
    });
  });

  describe('signupSchema', () => {
    const validSignup = {
      tenantName: 'My Company',
      tenantSlug: 'my-company',
      userName: 'John Doe',
      email: 'john@mycompany.com',
      password: '12345678',
    };

    it('should accept valid signup data', () => {
      expect(signupSchema.safeParse(validSignup).success).toBe(true);
    });

    it('should reject invalid tenant slug (uppercase)', () => {
      const data = { ...validSignup, tenantSlug: 'My-Company' };
      expect(signupSchema.safeParse(data).success).toBe(false);
    });

    it('should reject invalid tenant slug (spaces)', () => {
      const data = { ...validSignup, tenantSlug: 'my company' };
      expect(signupSchema.safeParse(data).success).toBe(false);
    });

    it('should accept tenant slug with numbers and hyphens', () => {
      const data = { ...validSignup, tenantSlug: 'company-123' };
      expect(signupSchema.safeParse(data).success).toBe(true);
    });

    it('should require password with at least 8 characters', () => {
      const data = { ...validSignup, password: '1234567' };
      expect(signupSchema.safeParse(data).success).toBe(false);
    });

    it('should require tenant name with at least 2 characters', () => {
      const data = { ...validSignup, tenantName: 'A' };
      expect(signupSchema.safeParse(data).success).toBe(false);
    });
  });

  describe('createUserSchema', () => {
    const validUser = {
      name: 'João Silva',
      email: 'joao@empresa.com',
      password: '12345678',
      role: 'maintainer',
    };

    it('should accept valid user data', () => {
      expect(createUserSchema.safeParse(validUser).success).toBe(true);
    });

    it('should accept all valid roles', () => {
      const roles = ['operator', 'maintainer', 'maintenance_supervisor', 'general_supervisor'];
      roles.forEach((role) => {
        const data = { ...validUser, role };
        expect(createUserSchema.safeParse(data).success).toBe(true);
      });
    });

    it('should reject invalid email', () => {
      const data = { ...validUser, email: 'invalid' };
      expect(createUserSchema.safeParse(data).success).toBe(false);
    });

    it('should reject short name', () => {
      const data = { ...validUser, name: 'J' };
      expect(createUserSchema.safeParse(data).success).toBe(false);
    });
  });

  describe('updateUserSchema', () => {
    it('should accept partial updates', () => {
      expect(updateUserSchema.safeParse({ name: 'New Name' }).success).toBe(true);
      expect(updateUserSchema.safeParse({ email: 'new@email.com' }).success).toBe(true);
      expect(updateUserSchema.safeParse({ active: false }).success).toBe(true);
    });

    it('should accept empty object (no updates)', () => {
      expect(updateUserSchema.safeParse({}).success).toBe(true);
    });

    it('should still validate provided fields', () => {
      expect(updateUserSchema.safeParse({ email: 'invalid' }).success).toBe(false);
      expect(updateUserSchema.safeParse({ name: 'J' }).success).toBe(false);
    });
  });

  describe('createMachineSchema', () => {
    const validMachine = {
      name: 'Torno CNC',
      code: 'TRN-001',
    };

    it('should accept minimal required fields', () => {
      expect(createMachineSchema.safeParse(validMachine).success).toBe(true);
    });

    it('should accept all optional fields', () => {
      const fullMachine = {
        ...validMachine,
        location: 'Setor A',
        manufacturer: 'ROMI',
        model: 'G550',
        serial: 'ABC123',
        status: 'operational',
      };
      expect(createMachineSchema.safeParse(fullMachine).success).toBe(true);
    });

    it('should default status to operational', () => {
      const result = createMachineSchema.parse(validMachine);
      expect(result.status).toBe('operational');
    });

    it('should reject empty name', () => {
      const data = { ...validMachine, name: '' };
      expect(createMachineSchema.safeParse(data).success).toBe(false);
    });

    it('should reject empty code', () => {
      const data = { ...validMachine, code: '' };
      expect(createMachineSchema.safeParse(data).success).toBe(false);
    });
  });

  describe('machineStatusSchema', () => {
    it('should accept all valid statuses', () => {
      const statuses = ['operational', 'maintenance', 'stopped', 'decommissioned'];
      statuses.forEach((status) => {
        expect(machineStatusSchema.safeParse(status).success).toBe(true);
      });
    });

    it('should reject invalid status', () => {
      expect(machineStatusSchema.safeParse('running').success).toBe(false);
      expect(machineStatusSchema.safeParse('broken').success).toBe(false);
    });
  });

  describe('documentTypeSchema', () => {
    it('should accept all valid document types', () => {
      const types = ['manual', 'drawing', 'certificate', 'photo', 'other'];
      types.forEach((type) => {
        expect(documentTypeSchema.safeParse(type).success).toBe(true);
      });
    });

    it('should reject invalid type', () => {
      expect(documentTypeSchema.safeParse('pdf').success).toBe(false);
      expect(documentTypeSchema.safeParse('image').success).toBe(false);
    });
  });

  describe('prepareUploadSchema', () => {
    const validUpload = {
      filename: 'manual.pdf',
      contentType: 'application/pdf',
      size: 1024 * 1024, // 1MB
      type: 'manual',
      title: 'Manual do Torno',
    };

    it('should accept valid upload data', () => {
      expect(prepareUploadSchema.safeParse(validUpload).success).toBe(true);
    });

    it('should reject file larger than 50MB', () => {
      const data = { ...validUpload, size: 51 * 1024 * 1024 };
      expect(prepareUploadSchema.safeParse(data).success).toBe(false);
    });

    it('should reject zero size', () => {
      const data = { ...validUpload, size: 0 };
      expect(prepareUploadSchema.safeParse(data).success).toBe(false);
    });

    it('should reject negative size', () => {
      const data = { ...validUpload, size: -100 };
      expect(prepareUploadSchema.safeParse(data).success).toBe(false);
    });

    it('should reject empty filename', () => {
      const data = { ...validUpload, filename: '' };
      expect(prepareUploadSchema.safeParse(data).success).toBe(false);
    });
  });

  describe('workOrderTypeSchema', () => {
    it('should accept all valid types', () => {
      const types = ['corrective', 'preventive', 'request'];
      types.forEach((type) => {
        expect(workOrderTypeSchema.safeParse(type).success).toBe(true);
      });
    });
  });

  describe('workOrderStatusSchema', () => {
    it('should accept all valid statuses', () => {
      const statuses = ['open', 'assigned', 'in_progress', 'completed', 'cancelled'];
      statuses.forEach((status) => {
        expect(workOrderStatusSchema.safeParse(status).success).toBe(true);
      });
    });
  });

  describe('workOrderPrioritySchema', () => {
    it('should accept all valid priorities', () => {
      const priorities = ['low', 'medium', 'high', 'critical'];
      priorities.forEach((priority) => {
        expect(workOrderPrioritySchema.safeParse(priority).success).toBe(true);
      });
    });
  });

  describe('createWorkOrderSchema', () => {
    const validWorkOrder = {
      machineId: '507f1f77bcf86cd799439011',
      type: 'corrective',
      description: 'Machine not working properly',
    };

    it('should accept valid work order', () => {
      expect(createWorkOrderSchema.safeParse(validWorkOrder).success).toBe(true);
    });

    it('should default priority to medium', () => {
      const result = createWorkOrderSchema.parse(validWorkOrder);
      expect(result.priority).toBe('medium');
    });

    it('should accept optional fields', () => {
      const data = {
        ...validWorkOrder,
        assignedTo: '507f1f77bcf86cd799439012',
        priority: 'critical',
        dueDate: '2025-12-31T23:59:59.000Z',
      };
      expect(createWorkOrderSchema.safeParse(data).success).toBe(true);
    });

    it('should reject invalid machineId', () => {
      const data = { ...validWorkOrder, machineId: 'invalid' };
      expect(createWorkOrderSchema.safeParse(data).success).toBe(false);
    });

    it('should reject empty description', () => {
      const data = { ...validWorkOrder, description: '' };
      expect(createWorkOrderSchema.safeParse(data).success).toBe(false);
    });

    it('should reject description longer than 2000 chars', () => {
      const data = { ...validWorkOrder, description: 'a'.repeat(2001) };
      expect(createWorkOrderSchema.safeParse(data).success).toBe(false);
    });
  });

  describe('finishWorkOrderSchema', () => {
    it('should accept empty object (all fields optional)', () => {
      expect(finishWorkOrderSchema.safeParse({}).success).toBe(true);
    });

    it('should accept time spent in minutes', () => {
      const data = { timeSpentMin: 120 };
      expect(finishWorkOrderSchema.safeParse(data).success).toBe(true);
    });

    it('should accept zero time spent', () => {
      const data = { timeSpentMin: 0 };
      expect(finishWorkOrderSchema.safeParse(data).success).toBe(true);
    });

    it('should reject negative time spent', () => {
      const data = { timeSpentMin: -10 };
      expect(finishWorkOrderSchema.safeParse(data).success).toBe(false);
    });

    it('should accept parts used', () => {
      const data = {
        partsUsed: [
          { name: 'Rolamento', qty: 2, unit: 'un' },
          { name: 'Óleo', qty: 1.5, unit: 'L' },
        ],
      };
      expect(finishWorkOrderSchema.safeParse(data).success).toBe(true);
    });

    it('should reject parts with invalid qty', () => {
      const data = {
        partsUsed: [{ name: 'Rolamento', qty: 0 }],
      };
      expect(finishWorkOrderSchema.safeParse(data).success).toBe(false);
    });
  });

  describe('createPreventivePlanSchema', () => {
    const validPlan = {
      machineId: '507f1f77bcf86cd799439011',
      name: 'Manutenção Mensal',
      periodicityDays: 30,
      checklistItems: [
        { label: 'Verificar óleo', required: true },
        { label: 'Limpar filtros', required: false },
      ],
      nextDueDate: '2025-03-01T00:00:00.000Z',
    };

    it('should accept valid preventive plan', () => {
      expect(createPreventivePlanSchema.safeParse(validPlan).success).toBe(true);
    });

    it('should require at least one checklist item', () => {
      const data = { ...validPlan, checklistItems: [] };
      expect(createPreventivePlanSchema.safeParse(data).success).toBe(false);
    });

    it('should reject more than 50 checklist items', () => {
      const items = Array.from({ length: 51 }, (_, i) => ({
        label: `Item ${i}`,
        required: false,
      }));
      const data = { ...validPlan, checklistItems: items };
      expect(createPreventivePlanSchema.safeParse(data).success).toBe(false);
    });

    it('should reject periodicity over 5 years', () => {
      const data = { ...validPlan, periodicityDays: 365 * 5 + 1 };
      expect(createPreventivePlanSchema.safeParse(data).success).toBe(false);
    });

    it('should reject zero periodicity', () => {
      const data = { ...validPlan, periodicityDays: 0 };
      expect(createPreventivePlanSchema.safeParse(data).success).toBe(false);
    });

    it('should default active to true', () => {
      const result = createPreventivePlanSchema.parse(validPlan);
      expect(result.active).toBe(true);
    });
  });

  describe('paginationSchema', () => {
    it('should default page to 1', () => {
      const result = paginationSchema.parse({});
      expect(result.page).toBe(1);
    });

    it('should default limit to 20', () => {
      const result = paginationSchema.parse({});
      expect(result.limit).toBe(20);
    });

    it('should coerce string values to numbers', () => {
      const result = paginationSchema.parse({ page: '5', limit: '50' });
      expect(result.page).toBe(5);
      expect(result.limit).toBe(50);
    });

    it('should reject limit over 100', () => {
      expect(paginationSchema.safeParse({ limit: 101 }).success).toBe(false);
    });

    it('should reject page 0', () => {
      expect(paginationSchema.safeParse({ page: 0 }).success).toBe(false);
    });

    it('should reject negative values', () => {
      expect(paginationSchema.safeParse({ page: -1 }).success).toBe(false);
      expect(paginationSchema.safeParse({ limit: -10 }).success).toBe(false);
    });
  });
});
