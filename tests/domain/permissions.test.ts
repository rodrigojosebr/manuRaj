/**
 * RBAC Permissions Tests
 *
 * Tests for the role-based access control system.
 * Run with: npx vitest run tests/domain/permissions.test.ts
 */

import { describe, it, expect } from 'vitest';
import {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  ROLE_DISPLAY_NAMES,
} from '@manuraj/domain';
import type { UserRole } from '@manuraj/domain';

describe('RBAC Permissions', () => {
  describe('PERMISSIONS constant', () => {
    it('should have all expected permission keys', () => {
      expect(PERMISSIONS.MACHINES_READ).toBe('machines:read');
      expect(PERMISSIONS.MACHINES_CREATE).toBe('machines:create');
      expect(PERMISSIONS.WORK_ORDERS_READ).toBe('work_orders:read');
      expect(PERMISSIONS.USERS_CREATE).toBe('users:create');
      expect(PERMISSIONS.METRICS_READ).toBe('metrics:read');
    });

    it('should have unique permission values', () => {
      const values = Object.values(PERMISSIONS);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });
  });

  describe('hasPermission', () => {
    describe('operator role', () => {
      const role: UserRole = 'operator';

      it('should have read permissions for machines', () => {
        expect(hasPermission(role, PERMISSIONS.MACHINES_READ)).toBe(true);
      });

      it('should NOT have create permissions for machines', () => {
        expect(hasPermission(role, PERMISSIONS.MACHINES_CREATE)).toBe(false);
      });

      it('should be able to create work order requests', () => {
        expect(hasPermission(role, PERMISSIONS.WORK_ORDERS_CREATE_REQUEST)).toBe(true);
      });

      it('should NOT be able to create full work orders', () => {
        expect(hasPermission(role, PERMISSIONS.WORK_ORDERS_CREATE)).toBe(false);
      });

      it('should NOT have user management permissions', () => {
        expect(hasPermission(role, PERMISSIONS.USERS_READ)).toBe(false);
        expect(hasPermission(role, PERMISSIONS.USERS_CREATE)).toBe(false);
      });
    });

    describe('maintainer role', () => {
      const role: UserRole = 'maintainer';

      it('should have read permissions', () => {
        expect(hasPermission(role, PERMISSIONS.MACHINES_READ)).toBe(true);
        expect(hasPermission(role, PERMISSIONS.DOCUMENTS_READ)).toBe(true);
        expect(hasPermission(role, PERMISSIONS.WORK_ORDERS_READ)).toBe(true);
      });

      it('should be able to upload documents', () => {
        expect(hasPermission(role, PERMISSIONS.DOCUMENTS_UPLOAD)).toBe(true);
      });

      it('should be able to start and finish work orders', () => {
        expect(hasPermission(role, PERMISSIONS.WORK_ORDERS_START)).toBe(true);
        expect(hasPermission(role, PERMISSIONS.WORK_ORDERS_FINISH)).toBe(true);
      });

      it('should NOT be able to assign work orders', () => {
        expect(hasPermission(role, PERMISSIONS.WORK_ORDERS_ASSIGN)).toBe(false);
      });

      it('should NOT be able to delete documents', () => {
        expect(hasPermission(role, PERMISSIONS.DOCUMENTS_DELETE)).toBe(false);
      });
    });

    describe('maintenance_supervisor role', () => {
      const role: UserRole = 'maintenance_supervisor';

      it('should have full machine management', () => {
        expect(hasPermission(role, PERMISSIONS.MACHINES_READ)).toBe(true);
        expect(hasPermission(role, PERMISSIONS.MACHINES_CREATE)).toBe(true);
        expect(hasPermission(role, PERMISSIONS.MACHINES_UPDATE)).toBe(true);
        expect(hasPermission(role, PERMISSIONS.MACHINES_DELETE)).toBe(true);
      });

      it('should have full work order management', () => {
        expect(hasPermission(role, PERMISSIONS.WORK_ORDERS_READ)).toBe(true);
        expect(hasPermission(role, PERMISSIONS.WORK_ORDERS_READ_ALL)).toBe(true);
        expect(hasPermission(role, PERMISSIONS.WORK_ORDERS_CREATE)).toBe(true);
        expect(hasPermission(role, PERMISSIONS.WORK_ORDERS_UPDATE)).toBe(true);
        expect(hasPermission(role, PERMISSIONS.WORK_ORDERS_DELETE)).toBe(true);
        expect(hasPermission(role, PERMISSIONS.WORK_ORDERS_ASSIGN)).toBe(true);
      });

      it('should be able to manage users but NOT delete them', () => {
        expect(hasPermission(role, PERMISSIONS.USERS_READ)).toBe(true);
        expect(hasPermission(role, PERMISSIONS.USERS_CREATE)).toBe(true);
        expect(hasPermission(role, PERMISSIONS.USERS_UPDATE)).toBe(true);
        expect(hasPermission(role, PERMISSIONS.USERS_DELETE)).toBe(false);
      });

      it('should NOT have metrics access', () => {
        expect(hasPermission(role, PERMISSIONS.METRICS_READ)).toBe(false);
      });
    });

    describe('general_supervisor role', () => {
      const role: UserRole = 'general_supervisor';

      it('should have full user management including delete', () => {
        expect(hasPermission(role, PERMISSIONS.USERS_READ)).toBe(true);
        expect(hasPermission(role, PERMISSIONS.USERS_CREATE)).toBe(true);
        expect(hasPermission(role, PERMISSIONS.USERS_UPDATE)).toBe(true);
        expect(hasPermission(role, PERMISSIONS.USERS_DELETE)).toBe(true);
      });

      it('should have metrics access', () => {
        expect(hasPermission(role, PERMISSIONS.METRICS_READ)).toBe(true);
      });

      it('should NOT have tenant management permissions', () => {
        expect(hasPermission(role, PERMISSIONS.TENANTS_READ)).toBe(false);
        expect(hasPermission(role, PERMISSIONS.TENANTS_CREATE)).toBe(false);
      });
    });

    describe('super_admin role', () => {
      const role: UserRole = 'super_admin';

      it('should have ALL permissions', () => {
        const allPermissions = Object.values(PERMISSIONS);
        allPermissions.forEach((permission) => {
          expect(hasPermission(role, permission)).toBe(true);
        });
      });

      it('should have tenant management permissions', () => {
        expect(hasPermission(role, PERMISSIONS.TENANTS_READ)).toBe(true);
        expect(hasPermission(role, PERMISSIONS.TENANTS_CREATE)).toBe(true);
        expect(hasPermission(role, PERMISSIONS.TENANTS_UPDATE)).toBe(true);
        expect(hasPermission(role, PERMISSIONS.TENANTS_DELETE)).toBe(true);
      });
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true if role has at least one permission', () => {
      expect(
        hasAnyPermission('operator', [PERMISSIONS.MACHINES_READ, PERMISSIONS.MACHINES_CREATE])
      ).toBe(true);
    });

    it('should return false if role has none of the permissions', () => {
      expect(
        hasAnyPermission('operator', [PERMISSIONS.MACHINES_CREATE, PERMISSIONS.USERS_DELETE])
      ).toBe(false);
    });

    it('should return true for super_admin with any permissions', () => {
      expect(
        hasAnyPermission('super_admin', [PERMISSIONS.TENANTS_DELETE, PERMISSIONS.USERS_DELETE])
      ).toBe(true);
    });
  });

  describe('hasAllPermissions', () => {
    it('should return true if role has all permissions', () => {
      expect(
        hasAllPermissions('general_supervisor', [
          PERMISSIONS.USERS_READ,
          PERMISSIONS.USERS_CREATE,
          PERMISSIONS.USERS_DELETE,
        ])
      ).toBe(true);
    });

    it('should return false if role is missing any permission', () => {
      expect(
        hasAllPermissions('maintenance_supervisor', [
          PERMISSIONS.USERS_READ,
          PERMISSIONS.USERS_CREATE,
          PERMISSIONS.USERS_DELETE, // maintenance_supervisor doesn't have this
        ])
      ).toBe(false);
    });

    it('should return true for super_admin with any combination', () => {
      expect(hasAllPermissions('super_admin', Object.values(PERMISSIONS))).toBe(true);
    });
  });

  describe('ROLE_DISPLAY_NAMES', () => {
    it('should have Portuguese names for all roles', () => {
      expect(ROLE_DISPLAY_NAMES.operator).toBe('Operador');
      expect(ROLE_DISPLAY_NAMES.maintainer).toBe('Manutentor');
      expect(ROLE_DISPLAY_NAMES.maintenance_supervisor).toBe('Supervisor de Manutenção');
      expect(ROLE_DISPLAY_NAMES.general_supervisor).toBe('Supervisor Geral');
      expect(ROLE_DISPLAY_NAMES.super_admin).toBe('Super Administrador');
    });

    it('should cover all defined roles', () => {
      const roles: UserRole[] = [
        'operator',
        'maintainer',
        'maintenance_supervisor',
        'general_supervisor',
        'super_admin',
      ];
      roles.forEach((role) => {
        expect(ROLE_DISPLAY_NAMES[role]).toBeDefined();
        expect(ROLE_DISPLAY_NAMES[role].length).toBeGreaterThan(0);
      });
    });
  });

  describe('Role hierarchy logic', () => {
    it('operator should have fewer permissions than maintainer', () => {
      const operatorPerms = ROLE_PERMISSIONS.operator.length;
      const maintainerPerms = ROLE_PERMISSIONS.maintainer.length;
      expect(operatorPerms).toBeLessThan(maintainerPerms);
    });

    it('maintainer should have fewer permissions than maintenance_supervisor', () => {
      const maintainerPerms = ROLE_PERMISSIONS.maintainer.length;
      const maintSupervisorPerms = ROLE_PERMISSIONS.maintenance_supervisor.length;
      expect(maintainerPerms).toBeLessThan(maintSupervisorPerms);
    });

    it('maintenance_supervisor should have fewer permissions than general_supervisor', () => {
      const maintSupervisorPerms = ROLE_PERMISSIONS.maintenance_supervisor.length;
      const generalSupervisorPerms = ROLE_PERMISSIONS.general_supervisor.length;
      expect(maintSupervisorPerms).toBeLessThan(generalSupervisorPerms);
    });

    it('super_admin should have all possible permissions', () => {
      const superAdminPerms = ROLE_PERMISSIONS.super_admin.length;
      const allPermsCount = Object.values(PERMISSIONS).length;
      expect(superAdminPerms).toBe(allPermsCount);
    });
  });
});
