import { z } from 'zod';
import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from '@asteasolutions/zod-to-openapi';

import {
  createMachineSchema,
  updateMachineSchema,
  createWorkOrderSchema,
  updateWorkOrderSchema,
  assignWorkOrderSchema,
  finishWorkOrderSchema,
  createUserSchema,
  updateUserSchema,
  createPreventivePlanSchema,
  updatePreventivePlanSchema,
  prepareUploadSchema,
  confirmUploadSchema,
  signupSchema,
} from './schemas';

export const registry = new OpenAPIRegistry();

// --- Response helpers ---
const errorResponse = (description: string) => ({
  description,
  content: {
    'application/json': {
      schema: z.object({
        error: z.string(),
        message: z.string(),
        statusCode: z.number(),
      }),
    },
  },
});

const jsonBody = (schema: z.ZodType) => ({
  body: {
    content: { 'application/json': { schema } },
  },
});

const successResponse = (description: string) => ({
  description,
  content: {
    'application/json': {
      schema: z.object({ data: z.any() }),
    },
  },
});

const paginatedResponse = (description: string) => ({
  description,
  content: {
    'application/json': {
      schema: z.object({
        data: z.array(z.any()),
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
      }),
    },
  },
});

const authResponses = {
  401: errorResponse('Unauthorized'),
  403: errorResponse('Forbidden'),
};

// --- Security scheme ---
registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

// ============================================================
// MACHINES
// ============================================================

registry.registerPath({
  method: 'get',
  path: '/api/machines',
  summary: 'List machines',
  description: 'List all machines for the tenant with pagination and optional status filter.',
  tags: ['Machines'],
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      status: z.string().optional(),
    }),
  },
  responses: {
    200: paginatedResponse('Machines list'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/machines',
  summary: 'Create a machine',
  tags: ['Machines'],
  security: [{ bearerAuth: [] }],
  request: jsonBody(createMachineSchema),
  responses: {
    201: successResponse('Machine created'),
    400: errorResponse('Validation error or duplicate code'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/machines/{id}',
  summary: 'Get a machine',
  tags: ['Machines'],
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: successResponse('Machine details'),
    404: errorResponse('Machine not found'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/machines/{id}',
  summary: 'Update a machine',
  tags: ['Machines'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    ...jsonBody(updateMachineSchema),
  },
  responses: {
    200: successResponse('Machine updated'),
    400: errorResponse('Validation error'),
    404: errorResponse('Machine not found'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/machines/{id}',
  summary: 'Delete a machine',
  tags: ['Machines'],
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: successResponse('Machine deleted'),
    404: errorResponse('Machine not found'),
    ...authResponses,
  },
});

// --- Machine Documents ---

registry.registerPath({
  method: 'get',
  path: '/api/machines/{id}/documents',
  summary: 'List machine documents',
  tags: ['Machine Documents'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    query: z.object({ page: z.coerce.number().optional(), limit: z.coerce.number().optional() }),
  },
  responses: {
    200: paginatedResponse('Documents list'),
    404: errorResponse('Machine not found'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/machines/{id}/documents/prepare-upload',
  summary: 'Prepare S3 upload URL',
  description: 'Step 1: Get a presigned S3 URL for direct upload.',
  tags: ['Machine Documents'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    ...jsonBody(prepareUploadSchema),
  },
  responses: {
    200: successResponse('Presigned URL'),
    400: errorResponse('Validation error'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/machines/{id}/documents/confirm-upload',
  summary: 'Confirm S3 upload',
  description: 'Step 2: Confirm upload and save document metadata.',
  tags: ['Machine Documents'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    ...jsonBody(confirmUploadSchema),
  },
  responses: {
    201: successResponse('Document created'),
    400: errorResponse('Validation error or S3 key mismatch'),
    ...authResponses,
  },
});

// ============================================================
// WORK ORDERS
// ============================================================

registry.registerPath({
  method: 'get',
  path: '/api/work-orders',
  summary: 'List work orders',
  description: 'Role-scoped: operators see requests, maintainers see assigned, supervisors see all.',
  tags: ['Work Orders'],
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      status: z.string().optional(),
      type: z.string().optional(),
      machineId: z.string().optional(),
      assignedTo: z.string().optional(),
    }),
  },
  responses: {
    200: paginatedResponse('Work orders list'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/work-orders',
  summary: 'Create a work order',
  description: 'Operators can only create type "request".',
  tags: ['Work Orders'],
  security: [{ bearerAuth: [] }],
  request: jsonBody(createWorkOrderSchema),
  responses: {
    201: successResponse('Work order created'),
    400: errorResponse('Validation error'),
    404: errorResponse('Machine not found'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/work-orders/{id}',
  summary: 'Get a work order',
  tags: ['Work Orders'],
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: successResponse('Work order details'),
    404: errorResponse('Work order not found'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/work-orders/{id}',
  summary: 'Update a work order',
  tags: ['Work Orders'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    ...jsonBody(updateWorkOrderSchema),
  },
  responses: {
    200: successResponse('Work order updated'),
    400: errorResponse('Validation error'),
    404: errorResponse('Work order not found'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/work-orders/{id}',
  summary: 'Delete a work order',
  tags: ['Work Orders'],
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: successResponse('Work order deleted'),
    404: errorResponse('Work order not found'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/work-orders/{id}/start',
  summary: 'Start a work order',
  description: 'Transition status to in_progress. Only the assignee can start.',
  tags: ['Work Orders'],
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: successResponse('Work order started'),
    404: errorResponse('Not found or cannot be started'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/work-orders/{id}/finish',
  summary: 'Finish a work order',
  description: 'Transition status to completed. Accepts time spent and parts used.',
  tags: ['Work Orders'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    ...jsonBody(finishWorkOrderSchema),
  },
  responses: {
    200: successResponse('Work order finished'),
    400: errorResponse('Validation error'),
    404: errorResponse('Not found or cannot be finished'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/work-orders/{id}/assign',
  summary: 'Assign a work order',
  description: 'Assign to a maintainer or supervisor in the same tenant.',
  tags: ['Work Orders'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    ...jsonBody(assignWorkOrderSchema),
  },
  responses: {
    200: successResponse('Work order assigned'),
    400: errorResponse('Invalid assignee'),
    404: errorResponse('Not found or user not found'),
    ...authResponses,
  },
});

// ============================================================
// USERS
// ============================================================

registry.registerPath({
  method: 'get',
  path: '/api/users',
  summary: 'List users',
  tags: ['Users'],
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      role: z.string().optional(),
      active: z.string().optional(),
    }),
  },
  responses: {
    200: paginatedResponse('Users list'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/users',
  summary: 'Create a user',
  tags: ['Users'],
  security: [{ bearerAuth: [] }],
  request: jsonBody(createUserSchema),
  responses: {
    201: successResponse('User created'),
    400: errorResponse('Validation error or duplicate email'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/users/{id}',
  summary: 'Get a user',
  tags: ['Users'],
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: successResponse('User details (no password hash)'),
    404: errorResponse('User not found'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/users/{id}',
  summary: 'Update a user',
  tags: ['Users'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    ...jsonBody(updateUserSchema),
  },
  responses: {
    200: successResponse('User updated'),
    400: errorResponse('Validation error'),
    404: errorResponse('User not found'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/users/{id}',
  summary: 'Deactivate a user',
  description: 'Soft-deactivate. Users cannot deactivate themselves.',
  tags: ['Users'],
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: successResponse('User deactivated'),
    400: errorResponse('Cannot deactivate yourself'),
    404: errorResponse('User not found'),
    ...authResponses,
  },
});

// ============================================================
// PREVENTIVE PLANS
// ============================================================

registry.registerPath({
  method: 'get',
  path: '/api/preventive-plans',
  summary: 'List preventive plans',
  tags: ['Preventive Plans'],
  security: [{ bearerAuth: [] }],
  request: {
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      machineId: z.string().optional(),
      active: z.string().optional(),
    }),
  },
  responses: {
    200: paginatedResponse('Preventive plans list'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/preventive-plans',
  summary: 'Create a preventive plan',
  tags: ['Preventive Plans'],
  security: [{ bearerAuth: [] }],
  request: jsonBody(createPreventivePlanSchema),
  responses: {
    201: successResponse('Plan created'),
    400: errorResponse('Validation error'),
    404: errorResponse('Machine not found'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/preventive-plans/{id}',
  summary: 'Get a preventive plan',
  tags: ['Preventive Plans'],
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: successResponse('Plan details'),
    404: errorResponse('Plan not found'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/preventive-plans/{id}',
  summary: 'Update a preventive plan',
  tags: ['Preventive Plans'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    ...jsonBody(updatePreventivePlanSchema),
  },
  responses: {
    200: successResponse('Plan updated'),
    400: errorResponse('Validation error'),
    404: errorResponse('Plan not found'),
    ...authResponses,
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/preventive-plans/{id}',
  summary: 'Delete a preventive plan',
  tags: ['Preventive Plans'],
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: successResponse('Plan deleted'),
    404: errorResponse('Plan not found'),
    ...authResponses,
  },
});

// ============================================================
// METRICS, HEALTH, SIGNUP
// ============================================================

registry.registerPath({
  method: 'get',
  path: '/api/metrics',
  summary: 'Dashboard metrics',
  description: 'Returns aggregate metrics: total machines, open/overdue WOs, completed this month, avg completion time.',
  tags: ['Metrics'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Metrics',
      content: {
        'application/json': {
          schema: z.object({
            data: z.object({
              totalMachines: z.number(),
              openWorkOrders: z.number(),
              overdueWorkOrders: z.number(),
              completedThisMonth: z.number(),
              avgCompletionTimeMin: z.number(),
              preventivePlansDue: z.number(),
            }),
          }),
        },
      },
    },
    ...authResponses,
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/health',
  summary: 'Health check',
  description: 'Public endpoint. Returns DB connection status and latency.',
  tags: ['System'],
  responses: {
    200: {
      description: 'Healthy',
      content: {
        'application/json': {
          schema: z.object({
            status: z.string(),
            db: z.string(),
            latency: z.string(),
            timestamp: z.string(),
          }),
        },
      },
    },
    503: errorResponse('Database unreachable'),
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/signup',
  summary: 'Register tenant and admin user',
  description: 'Public endpoint. Creates tenant + first user atomically.',
  tags: ['Auth'],
  request: jsonBody(signupSchema),
  responses: {
    201: successResponse('Tenant and user created'),
    400: errorResponse('Validation error or slug taken'),
  },
});

// ============================================================
// GENERATOR
// ============================================================

export function generateOpenAPISpec() {
  const generator = new OpenApiGeneratorV31(registry.definitions);
  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'manuRaj Pitlane API',
      version: '1.0.0',
      description: 'API do painel administrativo de gestão de manutenção industrial (CMMS SaaS multi-tenant).',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Development' }],
  });
}
