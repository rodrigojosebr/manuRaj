import type { UserRole } from './types';

// Permission definitions for RBAC
export const PERMISSIONS = {
  // Machine permissions
  MACHINES_READ: 'machines:read',
  MACHINES_CREATE: 'machines:create',
  MACHINES_UPDATE: 'machines:update',
  MACHINES_DELETE: 'machines:delete',

  // Document permissions
  DOCUMENTS_READ: 'documents:read',
  DOCUMENTS_UPLOAD: 'documents:upload',
  DOCUMENTS_DELETE: 'documents:delete',

  // Work Order permissions
  WORK_ORDERS_READ: 'work_orders:read',
  WORK_ORDERS_READ_ALL: 'work_orders:read_all',
  WORK_ORDERS_CREATE: 'work_orders:create',
  WORK_ORDERS_CREATE_REQUEST: 'work_orders:create_request',
  WORK_ORDERS_UPDATE: 'work_orders:update',
  WORK_ORDERS_DELETE: 'work_orders:delete',
  WORK_ORDERS_ASSIGN: 'work_orders:assign',
  WORK_ORDERS_START: 'work_orders:start',
  WORK_ORDERS_FINISH: 'work_orders:finish',

  // Preventive Plan permissions
  PREVENTIVE_PLANS_READ: 'preventive_plans:read',
  PREVENTIVE_PLANS_CREATE: 'preventive_plans:create',
  PREVENTIVE_PLANS_UPDATE: 'preventive_plans:update',
  PREVENTIVE_PLANS_DELETE: 'preventive_plans:delete',

  // User management
  USERS_READ: 'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',

  // Tenant management (super_admin only)
  TENANTS_READ: 'tenants:read',
  TENANTS_CREATE: 'tenants:create',
  TENANTS_UPDATE: 'tenants:update',
  TENANTS_DELETE: 'tenants:delete',

  // Metrics / Dashboard
  METRICS_READ: 'metrics:read',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Role to permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  operator: [
    PERMISSIONS.MACHINES_READ,
    PERMISSIONS.DOCUMENTS_READ,
    PERMISSIONS.WORK_ORDERS_READ,
    PERMISSIONS.WORK_ORDERS_CREATE_REQUEST,
  ],

  maintainer: [
    PERMISSIONS.MACHINES_READ,
    PERMISSIONS.DOCUMENTS_READ,
    PERMISSIONS.DOCUMENTS_UPLOAD,
    PERMISSIONS.WORK_ORDERS_READ,
    PERMISSIONS.WORK_ORDERS_START,
    PERMISSIONS.WORK_ORDERS_FINISH,
    PERMISSIONS.PREVENTIVE_PLANS_READ,
  ],

  maintenance_supervisor: [
    PERMISSIONS.MACHINES_READ,
    PERMISSIONS.MACHINES_CREATE,
    PERMISSIONS.MACHINES_UPDATE,
    PERMISSIONS.MACHINES_DELETE,
    PERMISSIONS.DOCUMENTS_READ,
    PERMISSIONS.DOCUMENTS_UPLOAD,
    PERMISSIONS.DOCUMENTS_DELETE,
    PERMISSIONS.WORK_ORDERS_READ,
    PERMISSIONS.WORK_ORDERS_READ_ALL,
    PERMISSIONS.WORK_ORDERS_CREATE,
    PERMISSIONS.WORK_ORDERS_UPDATE,
    PERMISSIONS.WORK_ORDERS_DELETE,
    PERMISSIONS.WORK_ORDERS_ASSIGN,
    PERMISSIONS.WORK_ORDERS_START,
    PERMISSIONS.WORK_ORDERS_FINISH,
    PERMISSIONS.PREVENTIVE_PLANS_READ,
    PERMISSIONS.PREVENTIVE_PLANS_CREATE,
    PERMISSIONS.PREVENTIVE_PLANS_UPDATE,
    PERMISSIONS.PREVENTIVE_PLANS_DELETE,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
  ],

  general_supervisor: [
    PERMISSIONS.MACHINES_READ,
    PERMISSIONS.MACHINES_CREATE,
    PERMISSIONS.MACHINES_UPDATE,
    PERMISSIONS.MACHINES_DELETE,
    PERMISSIONS.DOCUMENTS_READ,
    PERMISSIONS.DOCUMENTS_UPLOAD,
    PERMISSIONS.DOCUMENTS_DELETE,
    PERMISSIONS.WORK_ORDERS_READ,
    PERMISSIONS.WORK_ORDERS_READ_ALL,
    PERMISSIONS.WORK_ORDERS_CREATE,
    PERMISSIONS.WORK_ORDERS_UPDATE,
    PERMISSIONS.WORK_ORDERS_DELETE,
    PERMISSIONS.WORK_ORDERS_ASSIGN,
    PERMISSIONS.WORK_ORDERS_START,
    PERMISSIONS.WORK_ORDERS_FINISH,
    PERMISSIONS.PREVENTIVE_PLANS_READ,
    PERMISSIONS.PREVENTIVE_PLANS_CREATE,
    PERMISSIONS.PREVENTIVE_PLANS_UPDATE,
    PERMISSIONS.PREVENTIVE_PLANS_DELETE,
    PERMISSIONS.USERS_READ,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_UPDATE,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.METRICS_READ,
  ],

  super_admin: [
    // Super admin has all permissions
    ...Object.values(PERMISSIONS),
  ],
};

// Helper to check if a role has a specific permission
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

// Helper to check if a role has any of the specified permissions
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

// Helper to check if a role has all of the specified permissions
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

// Role display names
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  operator: 'Operador',
  maintainer: 'Manutentor',
  maintenance_supervisor: 'Supervisor de Manutenção',
  general_supervisor: 'Supervisor Geral',
  super_admin: 'Super Administrador',
};

// Machine status display names
export const MACHINE_STATUS_DISPLAY: Record<string, string> = {
  operational: 'Operacional',
  maintenance: 'Em Manutenção',
  stopped: 'Parada',
  decommissioned: 'Desativada',
};

// Work order status display names
export const WORK_ORDER_STATUS_DISPLAY: Record<string, string> = {
  open: 'Aberta',
  assigned: 'Atribuída',
  in_progress: 'Em Andamento',
  completed: 'Concluída',
  cancelled: 'Cancelada',
};

// Work order type display names
export const WORK_ORDER_TYPE_DISPLAY: Record<string, string> = {
  corrective: 'Corretiva',
  preventive: 'Preventiva',
  request: 'Solicitação',
};

// Work order priority display names
export const WORK_ORDER_PRIORITY_DISPLAY: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
};

// Document type display names
export const DOCUMENT_TYPE_DISPLAY: Record<string, string> = {
  manual: 'Manual',
  drawing: 'Desenho',
  certificate: 'Certificado',
  photo: 'Foto',
  other: 'Outro',
};
