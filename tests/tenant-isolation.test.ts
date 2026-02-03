/**
 * Tenant Isolation Tests
 *
 * These tests verify that multi-tenant data isolation is working correctly.
 * Run with: npx vitest run tests/tenant-isolation.test.ts
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Use test database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/manuraj_test?authSource=admin';

// Models (simplified)
const tenantSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  plan: String,
  adsEnabled: Boolean,
  active: Boolean,
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  name: String,
  email: String,
  passwordHash: String,
  role: String,
  active: Boolean,
}, { timestamps: true });

const machineSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  name: String,
  code: String,
  status: String,
}, { timestamps: true });

const Tenant = mongoose.models.Tenant || mongoose.model('Tenant', tenantSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Machine = mongoose.models.Machine || mongoose.model('Machine', machineSchema);

// Test data
let tenantA: mongoose.Document;
let tenantB: mongoose.Document;
let userA: mongoose.Document;
let userB: mongoose.Document;
let machineA: mongoose.Document;
let machineB: mongoose.Document;

describe('Multi-Tenant Data Isolation', () => {
  beforeAll(async () => {
    await mongoose.connect(MONGODB_URI);

    // Clean up
    await Tenant.deleteMany({});
    await User.deleteMany({});
    await Machine.deleteMany({});

    // Create two tenants
    tenantA = await Tenant.create({
      name: 'Company A',
      slug: 'company-a',
      plan: 'free',
      adsEnabled: true,
      active: true,
    });

    tenantB = await Tenant.create({
      name: 'Company B',
      slug: 'company-b',
      plan: 'free',
      adsEnabled: true,
      active: true,
    });

    const passwordHash = await bcrypt.hash('test123', 12);

    // Create users in each tenant
    userA = await User.create({
      tenantId: tenantA._id,
      name: 'User A',
      email: 'user@companya.com',
      passwordHash,
      role: 'general_supervisor',
      active: true,
    });

    userB = await User.create({
      tenantId: tenantB._id,
      name: 'User B',
      email: 'user@companyb.com',
      passwordHash,
      role: 'general_supervisor',
      active: true,
    });

    // Create machines in each tenant
    machineA = await Machine.create({
      tenantId: tenantA._id,
      name: 'Machine A',
      code: 'MCH-A001',
      status: 'operational',
    });

    machineB = await Machine.create({
      tenantId: tenantB._id,
      name: 'Machine B',
      code: 'MCH-B001',
      status: 'operational',
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('User Isolation', () => {
    it('should only return users from the same tenant', async () => {
      // Query users for tenant A
      const usersInTenantA = await User.find({ tenantId: tenantA._id });

      expect(usersInTenantA).toHaveLength(1);
      expect(usersInTenantA[0].email).toBe('user@companya.com');
    });

    it('should not return users from other tenants', async () => {
      // Try to find tenant A user while querying tenant B
      const crossTenantUser = await User.findOne({
        tenantId: tenantB._id,
        email: 'user@companya.com',
      });

      expect(crossTenantUser).toBeNull();
    });

    it('should allow same email in different tenants', async () => {
      // Create user with same email in tenant B
      const duplicateEmailUser = await User.create({
        tenantId: tenantB._id,
        name: 'Duplicate Email User',
        email: 'user@companya.com', // Same email as user A
        passwordHash: await bcrypt.hash('test123', 12),
        role: 'operator',
        active: true,
      });

      expect(duplicateEmailUser).toBeTruthy();

      // Verify both exist in their respective tenants
      const userInA = await User.findOne({ tenantId: tenantA._id, email: 'user@companya.com' });
      const userInB = await User.findOne({ tenantId: tenantB._id, email: 'user@companya.com' });

      expect(userInA).toBeTruthy();
      expect(userInB).toBeTruthy();
      expect(userInA!._id.toString()).not.toBe(userInB!._id.toString());
    });
  });

  describe('Machine Isolation', () => {
    it('should only return machines from the same tenant', async () => {
      const machinesInTenantA = await Machine.find({ tenantId: tenantA._id });

      expect(machinesInTenantA).toHaveLength(1);
      expect(machinesInTenantA[0].code).toBe('MCH-A001');
    });

    it('should not allow accessing machines from other tenants by ID', async () => {
      // Try to access machine B while filtering by tenant A
      const crossTenantMachine = await Machine.findOne({
        _id: machineB._id,
        tenantId: tenantA._id,
      });

      expect(crossTenantMachine).toBeNull();
    });

    it('should not expose machine data across tenants', async () => {
      // Get all machines for tenant A
      const machinesA = await Machine.find({ tenantId: tenantA._id });
      const machineCodes = machinesA.map(m => m.code);

      // Should not include tenant B's machine
      expect(machineCodes).not.toContain('MCH-B001');
    });
  });

  describe('Tenant Slug Uniqueness', () => {
    it('should not allow duplicate tenant slugs', async () => {
      await expect(
        Tenant.create({
          name: 'Duplicate Company',
          slug: 'company-a', // Same as tenant A
          plan: 'free',
          adsEnabled: true,
          active: true,
        })
      ).rejects.toThrow();
    });
  });
});
