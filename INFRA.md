# INFRA.md — Plano de Infraestrutura e Hardening

> Roadmap completo de melhorias de infraestrutura, segurança e resiliência.
> Organizado por fases. Cada item tem status, prioridade e arquivos afetados.
> Atualizado: 18 de Fevereiro de 2026

---

## Estado Atual

| Indicador | Valor |
|-----------|-------|
| Testes unitários | 265 passando (~1s) |
| Testes integração | 7 (script separado: `npm run test:integration`) |
| Builds | 3 apps passando (0 erros TS) |
| Auth guards | 100% testados (66 testes) |
| Sanitização | `sanitize()` + `stripTags()` em todos os schemas Zod (24 testes) |
| Proxy (Next.js 16) | Migrado |
| Logging | Pino estruturado (JSON) em auth, DB, cron, API errors |
| Audit log | Model + repository + integrado em 13 mutations (fire-and-forget) |
| Multi-tenant | Isolamento via `tenantId` em todos os repos |

---

## Fase 1 — Fundação ✅ COMPLETA

- [x] 1.1 Error boundaries no Pitlane
- [x] 1.2 Signup route → `withErrorHandler`
- [x] 1.3 `validateEnv()` no startup (`instrumentation.ts`)
- [x] 1.4 Senha mínima 8 chars (loginSchema)
- [x] 1.5 Health check `/api/health`
- [x] 1.6 Script `test:integration`

## Fase 2 — Segurança (parcial)

- [x] 2.2 Input sanitization (Zod transforms com `sanitize()` / `stripTags()`)
- [x] 4.1 Cron preventive plans (`/api/cron/generate-preventive-orders`)
- [x] 4.2 Transactions (signup com `session.withTransaction()`)

### Débito Técnico (implementar antes de produção com escala)

- [ ] **2.1 Rate limiting** — proteger `/api/auth` e `/api/signup` contra brute force. Requer escolha de stack (Upstash KV, in-memory, Redis).
- [ ] **2.3 CSRF** — risco baixo hoje (SameSite cookies + Server Actions). Reavaliar se adicionar API pública.

---

## Itens a Implementar — Plano Detalhado

### 3.1 Logging Estruturado (Pino) ✅

**Objetivo**: Substituir `console.log/error` por logs JSON estruturados com contexto.

**Pacote**: `pino` (2kb, mais rápido que existe, recomendado pelo Next.js)

**Passo 1 — Instalar pino**
```bash
npm install pino
```

**Passo 2 — Criar logger** (`libs/shared-utils/src/logger.ts`)
```ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV === 'development' && {
    transport: { target: 'pino/file', options: { destination: 1 } },
    // Em dev, logs legíveis. Em prod, JSON puro.
  }),
});

// Helpers com contexto
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}
```

**Passo 3 — Exportar** (`libs/shared-utils/src/index.ts`)
- Adicionar `export * from './logger'`

**Passo 4 — Substituir console.log/error nos arquivos**

| Arquivo | O que mudar |
|---------|-------------|
| `libs/auth/src/auth.ts:14` | `console.log('[Auth] Initializing...')` → `logger.info('NextAuth initialized')` |
| `libs/auth/src/auth.ts:82` | `console.error('[Auth] Authorization error:', error)` → `logger.error({ error }, 'Authorization failed')` |
| `libs/auth/src/guards.ts` | Sem console.log (guards usam throw) — sem mudança |
| `libs/data-access/src/connection.ts:50` | `console.log('[MongoDB] Connected')` → `logger.info('MongoDB connected')` |
| `libs/data-access/src/connection.ts:63` | `console.warn(...)` → `logger.warn(...)` |
| `libs/data-access/src/connection.ts:74` | `console.log('[MongoDB] Disconnected')` → `logger.info('MongoDB disconnected')` |
| `apps/pitlane/app/api/cron/.../route.ts` | `console.error(...)` → `logger.error(...)` |

**Passo 5 — Adicionar context nos API error handlers**
- No `withErrorHandler` (`libs/auth/src/guards.ts:200`): incluir `req.url` e `req.method` no log de erro

**Testes**: Não precisa de novos testes (logger é infraestrutura, não lógica).

---

### 3.2 Audit Log ✅

**Objetivo**: Registrar quem fez o quê e quando. Model + repository + helper para logar ações.

**Passo 1 — Tipo** (`libs/domain/src/types.ts`)
```ts
export type AuditAction = 'create' | 'update' | 'delete' | 'login' | 'start' | 'finish' | 'assign';
export type AuditEntity = 'machine' | 'work_order' | 'user' | 'tenant' | 'preventive_plan' | 'document';

export interface AuditLog {
  _id: string;
  tenantId: string;
  userId: string;
  userName: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  changes?: Record<string, { from: unknown; to: unknown }>;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}
```

**Passo 2 — Model** (`libs/data-access/src/models/audit-log.model.ts`)
- Schema Mongoose com indexes: `{ tenantId, createdAt }`, `{ tenantId, entity, entityId }`
- TTL index opcional: `createdAt` com expireAfterSeconds (ex: 1 ano) para auto-limpeza

**Passo 3 — Repository** (`libs/data-access/src/repositories/audit-log.repository.ts`)
```ts
class AuditLogRepository {
  async log(entry: Omit<AuditLog, '_id' | 'createdAt'>): Promise<void>
  async findByEntity(tenantId, entity, entityId, options?): Promise<AuditLog[]>
  async findByUser(tenantId, userId, options?): Promise<AuditLog[]>
  async findByTenant(tenantId, options?): Promise<{ logs: AuditLog[]; total: number }>
}
```

**Passo 4 — Integrar nas API routes**
- Adicionar `auditLogRepository.log(...)` após create/update/delete bem-sucedidos
- Usar fire-and-forget (não bloquear a response): `void auditLogRepository.log(...)`
- Prioridade: work orders (start/finish/assign), machines (create/update/delete), users (create/update)

**Passo 5 — Exportar**
- `libs/data-access/src/models/index.ts` — adicionar export
- `libs/data-access/src/repositories/index.ts` — adicionar export

**Testes**: Teste unitário do repository (mock do model).

---

### 4.3 PWA (Torque) ✅

**Status**: concluido

**Passo 1 — Ícones**
- Criar `apps/torque/public/icons/` com ícones do app:
  - `icon-192x192.png` (192x192)
  - `icon-512x512.png` (512x512)
- Usar o logo do Torque (verde `#059669`) ou gerar placeholder

**Passo 2 — Manifest** (`apps/torque/public/manifest.json`)
```json
{
  "name": "Torque - Gestão de Manutenção",
  "short_name": "Torque",
  "description": "App operacional de manutenção industrial",
  "start_url": "/login",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#059669",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Passo 3 — Meta tags no layout** (`apps/torque/app/layout.tsx`)
```tsx
<head>
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#059669" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="Torque" />
  <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
</head>
```

**Passo 4 — Service Worker básico** (`apps/torque/public/sw.js`)
- Cache-first para assets estáticos (`/_next/static/`, `/icons/`)
- Network-first para API calls e páginas
- Não fazer offline-first completo (complexidade alta, valor baixo no MVP)

**Passo 5 — Registrar SW** (`apps/torque/app/layout.tsx`)
```tsx
<script dangerouslySetInnerHTML={{ __html: `
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
`}} />
```

**Testes**: Teste manual no celular (Chrome DevTools → Application → Manifest).

---

### 4.4 API Docs (OpenAPI) ✅

**Objetivo**: Documentação interativa das 18 API routes do Pitlane auto-gerada dos Zod schemas.

**Pacotes**: `@asteasolutions/zod-to-openapi@^8` (compatível com Zod v4) + `swagger-ui-react` + `@types/swagger-ui-react`

> **Nota**: Projeto usa `import { z } from 'zod'` (não `zod/v4`), compatível com v8+.

---

**Passo 1 — Instalar dependências**
```bash
npm install @asteasolutions/zod-to-openapi swagger-ui-react
npm install -D @types/swagger-ui-react
```

---

**Passo 2 — Registrar schemas** (`libs/domain/src/openapi.ts`)

Registrar cada Zod schema existente com `registry.register()`:

```ts
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import {
  createMachineSchema, updateMachineSchema, machineStatusSchema,
  createWorkOrderSchema, updateWorkOrderSchema, assignWorkOrderSchema,
  finishWorkOrderSchema, workOrderQuerySchema,
  createUserSchema, updateUserSchema,
  createPreventivePlanSchema, updatePreventivePlanSchema,
  prepareUploadSchema, confirmUploadSchema,
  signupSchema, loginSchema, paginationSchema,
} from './schemas';

export const registry = new OpenAPIRegistry();

// Schemas de input
registry.register('CreateMachine', createMachineSchema);
registry.register('UpdateMachine', updateMachineSchema);
registry.register('CreateWorkOrder', createWorkOrderSchema);
registry.register('UpdateWorkOrder', updateWorkOrderSchema);
registry.register('AssignWorkOrder', assignWorkOrderSchema);
registry.register('FinishWorkOrder', finishWorkOrderSchema);
registry.register('CreateUser', createUserSchema);
registry.register('UpdateUser', updateUserSchema);
registry.register('CreatePreventivePlan', createPreventivePlanSchema);
registry.register('UpdatePreventivePlan', updatePreventivePlanSchema);
registry.register('PrepareUpload', prepareUploadSchema);
registry.register('ConfirmUpload', confirmUploadSchema);
registry.register('Signup', signupSchema);
```

---

**Passo 3 — Definir endpoints** (`libs/domain/src/openapi.ts`)

Registrar cada API path com method, request body, response:

| Grupo | Rotas a registrar |
|-------|-------------------|
| **Machines** | `GET /api/machines` (query: pagination+status), `POST /api/machines` (body: CreateMachine) |
| | `GET /api/machines/{id}`, `PUT /api/machines/{id}` (body: UpdateMachine), `DELETE /api/machines/{id}` |
| | `GET /api/machines/{id}/documents` (query: pagination) |
| | `POST /api/machines/{id}/documents/prepare-upload` (body: PrepareUpload) |
| | `POST /api/machines/{id}/documents/confirm-upload` (body: ConfirmUpload) |
| **Work Orders** | `GET /api/work-orders` (query: workOrderQuery), `POST /api/work-orders` (body: CreateWorkOrder) |
| | `GET /api/work-orders/{id}`, `PUT /api/work-orders/{id}` (body: UpdateWorkOrder), `DELETE /api/work-orders/{id}` |
| | `POST /api/work-orders/{id}/start` (no body) |
| | `POST /api/work-orders/{id}/finish` (body: FinishWorkOrder) |
| | `POST /api/work-orders/{id}/assign` (body: AssignWorkOrder) |
| **Users** | `GET /api/users` (query: pagination+role+active), `POST /api/users` (body: CreateUser) |
| | `GET /api/users/{id}`, `PUT /api/users/{id}` (body: UpdateUser), `DELETE /api/users/{id}` |
| **Preventive Plans** | `GET /api/preventive-plans` (query: pagination+machineId+active), `POST /api/preventive-plans` (body: CreatePreventivePlan) |
| | `GET /api/preventive-plans/{id}`, `PUT /api/preventive-plans/{id}` (body: UpdatePreventivePlan), `DELETE /api/preventive-plans/{id}` |
| **Metrics** | `GET /api/metrics` (sem body) |
| **Health** | `GET /api/health` (público, sem auth) |
| **Signup** | `POST /api/signup` (público, body: Signup) |

Para cada endpoint usar `registry.registerPath()`:
```ts
registry.registerPath({
  method: 'post',
  path: '/api/machines',
  summary: 'Create a machine',
  request: { body: { content: { 'application/json': { schema: createMachineSchema } } } },
  responses: {
    201: { description: 'Machine created', content: { 'application/json': { schema: z.object({ data: z.any() }) } } },
    400: { description: 'Validation error' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden' },
  },
});
```

---

**Passo 4 — Gerar spec JSON** (`libs/domain/src/openapi.ts`)

```ts
import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';

export function generateOpenAPISpec() {
  const generator = new OpenApiGeneratorV31(registry.definitions);
  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'manuRaj Pitlane API',
      version: '1.0.0',
      description: 'API do painel administrativo de gestão de manutenção industrial',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Development' }],
    security: [{ bearerAuth: [] }],
  });
}
```

---

**Passo 5 — API route que serve o spec** (`apps/pitlane/app/api/docs/spec/route.ts`)

```ts
import { NextResponse } from 'next/server';
import { generateOpenAPISpec } from '@manuraj/domain';

export async function GET() {
  const spec = generateOpenAPISpec();
  return NextResponse.json(spec);
}
```

> Rota pública (sem auth) — é apenas documentação.

---

**Passo 6 — Página Swagger UI** (`apps/pitlane/app/docs/page.tsx`)

```tsx
'use client';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function DocsPage() {
  return <SwaggerUI url="/api/docs/spec" />;
}
```

> Página client-side que consome o endpoint `/api/docs/spec`.
> Acessível em `http://localhost:3000/docs`.

---

**Passo 7 — Exportar** (`libs/domain/src/index.ts`)
- Adicionar `export * from './openapi'`

---

**Arquivos a criar/editar:**

| Ação | Arquivo |
|------|---------|
| **Criar** | `libs/domain/src/openapi.ts` (registry + paths + generator) |
| **Criar** | `apps/pitlane/app/api/docs/spec/route.ts` (JSON spec endpoint) |
| **Criar** | `apps/pitlane/app/docs/page.tsx` (Swagger UI page) |
| **Editar** | `libs/domain/src/index.ts` (adicionar export) |

**Verificação:**
1. `npx vitest run` — 265 testes passando
2. `npm run build:pitlane` — build limpo
3. Acessar `http://localhost:3000/docs` — Swagger UI carregando spec
4. Testar "Try it out" em um endpoint público (`GET /api/health`)

---

## Ordem de Implementação

| # | Item | Esforço | Deps externas |
|---|------|---------|---------------|
| 1 | **4.3 PWA** | ~30 min | Nenhuma (só arquivos estáticos) |
| 2 | **3.1 Logging (Pino)** | ~40 min | `npm install pino` |
| 3 | **3.2 Audit Log** | ~1h | Nenhuma (model + repository) |
| 4 | **4.4 API Docs** | ~2h | `npm install zod-to-openapi swagger-ui-react` |

---

## Checklist Final

### Concluídos ✅
- [x] 1.1 Error boundaries no Pitlane
- [x] 1.2 Signup route → `withErrorHandler`
- [x] 1.3 `validateEnv()` no startup
- [x] 1.4 Senha mínima 8 chars
- [x] 1.5 Health check `/api/health`
- [x] 1.6 Script `test:integration`
- [x] 2.2 Input sanitization
- [x] 4.1 Cron preventive plans
- [x] 4.2 Transactions (signup)

### A implementar (nesta ordem)
- [x] 4.3 PWA (Torque)
- [x] 3.1 Logging estruturado (Pino)
- [x] 3.2 Audit log
- [x] 4.4 API docs (OpenAPI)

### Débito técnico (futuro)
- [ ] 2.1 Rate limiting
- [ ] 2.3 CSRF

---

## Forças do Projeto (manter)

1. Multi-tenant isolado — `tenantId` em todos os repositories
2. RBAC completo — 5 roles, permissions granulares, guards testados
3. Server Actions (Torque) — sem API routes expostas
4. Type safety — Zod + TypeScript + Mongoose
5. Repository pattern — camada de dados limpa e testável
6. S3 tenant isolation — `validateS3KeyForTenant()` previne acesso cruzado
7. Proxy migrado — Next.js 16 compliant
8. Input sanitization — `sanitize()` / `stripTags()` via Zod transforms
9. 265 testes passando — domínio, formatadores, RBAC, auth guards, sanitize
10. Cron automatizado — planos preventivos geram OS automaticamente
11. Signup atômico — transaction garante tenant + user criados juntos
12. Logging estruturado — Pino JSON em auth, DB, cron, API errors
13. Audit log — registra quem fez o quê, TTL 1 ano, fire-and-forget
14. API Docs — OpenAPI 3.1 auto-gerada dos Zod schemas, Swagger UI em `/docs`
