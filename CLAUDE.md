# manuRaj - Documentação Completa do Projeto

> Este arquivo é lido automaticamente pelo Claude Code para manter contexto entre sessões.
> Última atualização: 04 de Fevereiro de 2026
>
> 📎 **Guia de estilos**: Veja `STYLES.md` para paletas de cores, layouts e padrões visuais.

---

## 1. Visão Geral

**manuRaj** é um SaaS multi-tenant de gestão de manutenção industrial (CMMS - Computerized Maintenance Management System).

> 📖 **Storytelling completo**: Veja `UNIVERSE.md` para a narrativa de produto e nomenclatura.

### O Universo (Metáfora F1)

| Projeto | Metáfora | Função |
|---------|----------|--------|
| **Torque** | O piloto | App operacional (mobile-first) |
| **Pitlane** | O pit stop | Admin de gestão (desktop) |
| **Showroom** | A vitrine | Landing page pública |
| **PitKit** | O kit de ferramentas | Design System |
| **garage-*** | A garagem | Backend/APIs |

> *"Torque resolve. Pitlane decide. Showroom conquista. A Garage sustenta. E o PitKit garante padrão."*

### Propósito
Permite que empresas gerenciem:
- Máquinas e equipamentos
- Ordens de serviço (corretivas, preventivas, solicitações)
- Planos de manutenção preventiva
- Equipes de manutenção
- Documentos técnicos (manuais, desenhos, certificados)

### Idiomas
- **Comunicação com desenvolvedor**: Português brasileiro (pt-BR)
- **Código-fonte**: Inglês (variáveis, funções, comentários técnicos)
- **Interface do usuário**: Português brasileiro

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| **Monorepo** | NX Workspaces | 22.x |
| **Frontend** | Next.js (App Router, Turbopack) | 16.x |
| **Estilização** | PandaCSS (CSS-in-JS, design tokens, CVA) | 1.8.x |
| **Autenticação** | NextAuth.js v5 (Credentials + JWT) | 5.0-beta |
| **Validação** | Zod | 4.x |
| **Database** | MongoDB Atlas + Mongoose | 9.x |
| **Storage** | AWS S3 (presigned URLs) | SDK v3 |
| **Runtime** | Node.js (APIs) / Edge (middleware) | - |
| **Testes** | Vitest | 4.x |

---

## 3. Estrutura do Monorepo (Multi-App)

O projeto possui **3 aplicações** separadas:

| App | Porta | Público | Descrição |
|-----|-------|---------|-----------|
| `pitlane` | 3000 | Supervisores | Gestão completa (máquinas, OS, planos, usuários) |
| `torque` | 3001 | Operadores/Manutentores | App mobile-first para execução de OS |
| `showroom` | 3002 | Público | Site institucional, signup, pricing |

```
manuRaj/
├── apps/
│   ├── pitlane/                       # 🏁 Painel administrativo (supervisores)
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── global.css
│   │   │   ├── page.tsx               # Redirect para login
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── api/                   # API Routes (garage-pitlane)
│   │   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   │   ├── signup/route.ts
│   │   │   │   ├── metrics/route.ts
│   │   │   │   ├── users/
│   │   │   │   ├── machines/
│   │   │   │   ├── work-orders/
│   │   │   │   └── preventive-plans/
│   │   │   └── t/[tenantSlug]/        # Rotas do tenant
│   │   │       └── (dashboard)/
│   │   │           ├── page.tsx       # Dashboard
│   │   │           ├── machines/
│   │   │           ├── work-orders/
│   │   │           ├── preventive-plans/
│   │   │           └── admin/users/
│   │   ├── middleware.ts
│   │   ├── panda.config.ts
│   │   ├── postcss.config.cjs
│   │   └── next.config.js
│   │
│   ├── torque/                        # 🏎️ App operacional (mobile-first)
│   │   ├── app/
│   │   │   ├── layout.tsx             # PWA-ready layout
│   │   │   ├── global.css             # Mobile-optimized styles
│   │   │   ├── page.tsx               # Redirect para login
│   │   │   ├── login/page.tsx
│   │   │   └── t/[tenantSlug]/        # Rotas do tenant
│   │   │       ├── layout.tsx         # Bottom tab navigation
│   │   │       └── page.tsx           # Home com stats (HARDCODED - TODO)
│   │   │       # ⚠️ FALTAM (planejado mas não implementado):
│   │   │       # ├── minhas-os/       # Lista de OS do usuário
│   │   │       # ├── nova-solicitacao/ # Abrir nova solicitação
│   │   │       # ├── maquinas/        # Consultar máquinas
│   │   │       # └── config/          # Configurações
│   │   ├── panda.config.ts
│   │   ├── postcss.config.cjs
│   │   └── next.config.js
│   │
│   └── showroom/                      # 🏪 Site público (landing)
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── global.css
│       │   └── page.tsx               # Homepage com hero, features, pricing
│       ├── panda.config.ts
│       ├── postcss.config.cjs
│       └── next.config.js
│
├── libs/
│   ├── domain/                        # Tipos, schemas, constantes
│   │   └── src/
│   │       ├── types.ts               # Interfaces TypeScript
│   │       ├── schemas.ts             # Schemas Zod para validação
│   │       ├── constants.ts           # Permissões RBAC, display names
│   │       └── index.ts
│   │
│   ├── data-access/                   # Camada de dados
│   │   └── src/
│   │       ├── connection.ts          # Conexão MongoDB
│   │       ├── models/                # Mongoose models
│   │       │   ├── tenant.model.ts
│   │       │   ├── user.model.ts
│   │       │   ├── machine.model.ts
│   │       │   ├── machine-document.model.ts
│   │       │   ├── work-order.model.ts
│   │       │   └── preventive-plan.model.ts
│   │       └── repositories/          # Repository pattern
│   │           ├── tenant.repository.ts
│   │           ├── user.repository.ts
│   │           ├── machine.repository.ts
│   │           ├── machine-document.repository.ts
│   │           ├── work-order.repository.ts
│   │           └── preventive-plan.repository.ts
│   │
│   ├── auth/                          # Autenticação NextAuth
│   │   └── src/
│   │       ├── auth.config.ts         # Config Edge-safe (sem MongoDB)
│   │       ├── auth.ts                # Config completa (Node.js)
│   │       └── index.ts
│   │
│   ├── pitkit/                        # 🧰 PitKit - Design System próprio
│   │   └── src/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       ├── Table.tsx
│   │       ├── Modal.tsx
│   │       ├── Skeleton.tsx
│   │       └── index.ts
│   │
│   ├── shared-utils/                  # Utilitários compartilhados
│   │   └── src/
│   │       ├── api.ts                 # API client type-safe
│   │       ├── format.ts              # Formatadores (data, tempo, etc.)
│   │       └── index.ts
│   │
│   ├── ads/                           # Integração Google AdSense
│   │   └── src/
│   │       ├── AdProvider.tsx         # Context provider
│   │       ├── AdBanner.tsx
│   │       ├── AdRail.tsx
│   │       ├── AdInFeed.tsx
│   │       ├── AdPlaceholder.tsx
│   │       └── index.ts
│   │
│   └── config/                        # Variáveis de ambiente tipadas
│       └── src/
│           └── index.ts
│
├── styled-system/                     # Gerado pelo PandaCSS (NÃO EDITAR)
├── scripts/
│   ├── seed.ts                        # Popula banco com dados demo
│   └── check-db.ts                    # Diagnóstico do banco
│
├── package.json
├── panda.config.ts                    # Config raiz (referência)
├── tsconfig.base.json                 # Paths aliases
├── docker-compose.yml                 # MongoDB local (opcional)
├── .env.local                         # Variáveis de ambiente
├── .env.example                       # Template de variáveis
└── CLAUDE.md                          # Este arquivo
```

---

## 4. Design System - PitKit (@manuraj/pitkit)

### Filosofia
- **Componentes 100% próprios** - SEM Bootstrap, MaterialUI ou similares
- **PandaCSS + CVA** - Variants tipadas com Class Variance Authority
- **Design Tokens** - Cores, fontes e espaçamentos centralizados
- **PitKit obrigatório em TODOS os apps** - Pitlane, Torque e Showroom DEVEM usar componentes PitKit (`<Button>`, `<Input>`, `<Select>`, etc.) em vez de elementos HTML nativos (`<button>`, `<input>`, `<select>`). Se o componente necessário não existir no PitKit, **crie-o primeiro** em `libs/pitkit/src/` antes de usar na página. Isso garante consistência visual e facilita evolução do design system.

### Componentes Disponíveis

| Componente | Props/Variants | Descrição |
|------------|----------------|-----------|
| `Button` | `variant`: primary, secondary, danger, ghost, link<br>`size`: sm, md, lg<br>`fullWidth`, `isLoading` | Botão com loading spinner |
| `Input` | `label`, `error`, `helperText`, `type` | Campo de entrada |
| `Select` | `label`, `options`, `error` | Dropdown nativo estilizado |
| `Card` | `padding`: none, sm, md, lg | Container com sombra |
| `CardHeader`, `CardContent`, `CardFooter` | - | Composição do Card |
| `Badge` | `variant`: default, success, warning, danger, info | Tag de status |
| `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` | - | Tabela completa |
| `TableEmpty` | `colSpan`, `message` | Estado vazio da tabela |
| `Modal` | `isOpen`, `onClose`, `title`, `size`: sm, md, lg, xl | Dialog modal |
| `Skeleton`, `SkeletonText`, `SkeletonTable` | - | Loading placeholders |

### Padrão para Criar Novos Componentes

```tsx
// libs/pitkit/src/NovoComponente.tsx
'use client';

import { forwardRef } from 'react';
import { css, cva } from '../../../styled-system/css';

// 1. Definir estilos com CVA
const componentStyles = cva({
  base: {
    // Estilos base que sempre aplicam
    display: 'flex',
    borderRadius: 'md',
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: 'brand.600',
        color: 'white',
        _hover: { backgroundColor: 'brand.700' },
      },
      secondary: {
        backgroundColor: 'gray.100',
        color: 'gray.900',
      },
    },
    size: {
      sm: { padding: '2', fontSize: 'sm' },
      md: { padding: '4', fontSize: 'md' },
      lg: { padding: '6', fontSize: 'lg' },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

// 2. Definir interface de props
interface NovoComponenteProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

// 3. Criar componente com forwardRef
export const NovoComponente = forwardRef<HTMLDivElement, NovoComponenteProps>(
  ({ variant, size, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${componentStyles({ variant, size })} ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NovoComponente.displayName = 'NovoComponente';
```

**Depois exportar em `libs/pitkit/src/index.ts`:**
```tsx
export * from './NovoComponente';
```

### Design Tokens (panda.config.ts)

Cada app tem seu próprio `panda.config.ts` com paleta `brand` diferente:
- **Pitlane**: Azul (`#2563eb` = brand.600)
- **Torque**: Verde esmeralda (`#059669` = brand.600)

Detalhes completos das paletas em `STYLES.md`.

```ts
// Cores por app (brand varia, o resto é igual)
colors: {
  brand: { 50-900 },     // Azul (Pitlane) ou Verde (Torque)
  success: { 500, 600 }, // Verde (#22c55e)
  warning: { 500, 600 }, // Amarelo (#f59e0b)
  danger: { 500, 600 },  // Vermelho (#ef4444)
}

// Tokens semânticos (suportam dark mode)
semanticTokens: {
  colors: {
    bg: { canvas, surface, subtle },
    text: { primary, secondary, muted },
    border: { default },
  },
}
```

---

## 5. Sistema de Autenticação

### Fluxo de Login
1. Usuário acessa `/login`
2. Informa: **tenant** (slug), **email**, **senha**
3. NextAuth valida via Credentials provider
4. Busca usuário no MongoDB pelo email + tenantSlug
5. Compara senha com bcrypt
6. Gera JWT com dados do usuário
7. Redireciona para `/t/{tenantSlug}/dashboard`

### Estrutura do JWT/Session
```ts
interface SessionUser {
  id: string;          // MongoDB _id do usuário
  tenantId: string;    // MongoDB _id do tenant
  tenantSlug: string;  // Slug do tenant (usado na URL)
  name: string;
  email: string;
  role: UserRole;
}
```

### Edge Runtime vs Node.js

O middleware roda em **Edge Runtime**, que não suporta módulos Node.js como `crypto` (usado pelo MongoDB).

**Solução implementada:**
- `libs/auth/src/auth.config.ts` → Configuração Edge-safe (callbacks, pages)
- `libs/auth/src/auth.ts` → Configuração completa com Credentials provider
- `apps/pitlane/middleware.ts` → Importa apenas `auth.config.ts`

```ts
// middleware.ts - CORRETO
import { authConfig } from '@manuraj/auth/auth.config';

// API routes - CORRETO
import { auth } from '@manuraj/auth';
```

---

## 6. Sistema de Permissões (RBAC)

### Roles Disponíveis

| Role | Descrição | Acesso |
|------|-----------|--------|
| `operator` | Operador de máquinas | Visualiza máquinas, abre solicitações |
| `maintainer` | Manutentor | Executa OS, registra tempo/peças |
| `maintenance_supervisor` | Supervisor de Manutenção | Gerencia OS, equipe, máquinas |
| `general_supervisor` | Supervisor Geral | Acesso total ao tenant + métricas |
| `super_admin` | Super Admin | Acesso a TODOS os tenants |

### Permissões Definidas

```ts
// libs/domain/src/constants.ts
export const PERMISSIONS = {
  // Máquinas
  MACHINES_READ: 'machines:read',
  MACHINES_CREATE: 'machines:create',
  MACHINES_UPDATE: 'machines:update',
  MACHINES_DELETE: 'machines:delete',

  // Documentos
  DOCUMENTS_READ: 'documents:read',
  DOCUMENTS_UPLOAD: 'documents:upload',
  DOCUMENTS_DELETE: 'documents:delete',

  // Ordens de Serviço
  WORK_ORDERS_READ: 'work_orders:read',
  WORK_ORDERS_READ_ALL: 'work_orders:read_all',
  WORK_ORDERS_CREATE: 'work_orders:create',
  WORK_ORDERS_CREATE_REQUEST: 'work_orders:create_request',
  WORK_ORDERS_UPDATE: 'work_orders:update',
  WORK_ORDERS_DELETE: 'work_orders:delete',
  WORK_ORDERS_ASSIGN: 'work_orders:assign',
  WORK_ORDERS_START: 'work_orders:start',
  WORK_ORDERS_FINISH: 'work_orders:finish',

  // Planos Preventivos
  PREVENTIVE_PLANS_READ: 'preventive_plans:read',
  PREVENTIVE_PLANS_CREATE: 'preventive_plans:create',
  PREVENTIVE_PLANS_UPDATE: 'preventive_plans:update',
  PREVENTIVE_PLANS_DELETE: 'preventive_plans:delete',

  // Usuários
  USERS_READ: 'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',

  // Métricas
  METRICS_READ: 'metrics:read',
};
```

### Helpers para Verificar Permissão

```ts
import { hasPermission, hasAnyPermission, PERMISSIONS } from '@manuraj/domain';

// Verificar uma permissão
if (hasPermission(user.role, PERMISSIONS.MACHINES_CREATE)) {
  // Pode criar máquinas
}

// Verificar qualquer uma de várias
if (hasAnyPermission(user.role, [PERMISSIONS.WORK_ORDERS_START, PERMISSIONS.WORK_ORDERS_FINISH])) {
  // Pode iniciar OU finalizar OS
}
```

---

## 7. Database (MongoDB)

### Conexão
- **Produção/Dev**: MongoDB Atlas (cloud)
- **Local opcional**: Docker via `docker-compose.yml`

### Models

| Model | Collection | Campos Principais |
|-------|------------|-------------------|
| `Tenant` | tenants | name, slug, plan, adsEnabled, active |
| `User` | users | tenantId, email, passwordHash, role, active |
| `Machine` | machines | tenantId, name, code, location, status |
| `MachineDocument` | machinedocuments | tenantId, machineId, type, s3Key, title |
| `WorkOrder` | workorders | tenantId, machineId, type, status, priority, assignedTo |
| `PreventivePlan` | preventiveplans | tenantId, machineId, periodicityDays, nextDueDate |

### Isolamento Multi-tenant

**IMPORTANTE**: Todas as queries DEVEM filtrar por `tenantId`:

```ts
// CORRETO - sempre incluir tenantId
const machines = await Machine.find({
  tenantId: session.user.tenantId
});

// ERRADO - vazamento de dados entre tenants!
const machines = await Machine.find({});
```

### Repository Pattern

Usamos repositories para encapsular a lógica de acesso a dados:

```ts
// Exemplo de uso
import { machineRepository } from '@manuraj/data-access';

// Buscar máquina por ID (já valida tenantId)
const machine = await machineRepository.findById(tenantId, machineId);

// Listar máquinas do tenant
const { machines, total } = await machineRepository.findByTenant(tenantId, {
  status: 'operational',
  page: 1,
  limit: 20,
});
```

---

## 8. Validação com Zod

Todos os inputs são validados com Zod antes de processar:

```ts
// libs/domain/src/schemas.ts
import { z } from 'zod';

// Schemas disponíveis
export const loginSchema = z.object({...});
export const signupSchema = z.object({...});
export const createMachineSchema = z.object({...});
export const updateMachineSchema = createMachineSchema.partial();
export const createWorkOrderSchema = z.object({...});
export const createPreventivePlanSchema = z.object({...});
// ... e muitos outros

// Tipos inferidos automaticamente
export type CreateMachineInput = z.infer<typeof createMachineSchema>;
```

### Uso nas API Routes

```ts
import { createMachineSchema } from '@manuraj/domain';

export async function POST(request: Request) {
  const body = await request.json();

  // Validar input
  const result = createMachineSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 }
    );
  }

  // result.data é tipado corretamente
  const machine = await machineRepository.create(tenantId, result.data);
}
```

---

## 9. API Routes

### Estrutura Padrão

```
apps/pitlane/app/api/
├── auth/[...nextauth]/route.ts    # NextAuth handler
├── signup/route.ts                 # Cadastro de empresa
├── metrics/route.ts                # Dashboard metrics
├── users/
│   ├── route.ts                    # GET (list), POST (create)
│   └── [id]/route.ts               # GET, PUT, DELETE
├── machines/
│   ├── route.ts
│   └── [id]/
│       ├── route.ts
│       └── documents/
│           ├── route.ts            # GET, DELETE documentos
│           ├── prepare-upload/route.ts   # Gera presigned URL
│           └── confirm-upload/route.ts   # Confirma upload
├── work-orders/
│   ├── route.ts
│   └── [id]/
│       ├── route.ts
│       ├── assign/route.ts         # POST - atribuir manutentor
│       ├── start/route.ts          # POST - iniciar OS
│       └── finish/route.ts         # POST - finalizar OS
└── preventive-plans/
    ├── route.ts
    └── [id]/route.ts
```

### Padrão de Response

```ts
// Sucesso - item único
return NextResponse.json({ data: result });

// Sucesso - lista
return NextResponse.json({ data: items, total: count });

// Erro de validação
return NextResponse.json(
  { error: 'Validation failed', details: errors },
  { status: 400 }
);

// Erro de permissão
return NextResponse.json(
  { error: 'Forbidden' },
  { status: 403 }
);

// Não encontrado
return NextResponse.json(
  { error: 'Not found' },
  { status: 404 }
);
```

---

## 10. Upload de Documentos (S3)

### Fluxo de Upload com Presigned URL

```
┌─────────┐     1. Solicita upload      ┌─────────┐
│ Cliente │ ───────────────────────────▶│   API   │
└─────────┘                             └────┬────┘
     │                                       │
     │    2. Retorna presigned URL           │ Gera URL
     │◀──────────────────────────────────────┘ assinada
     │
     │    3. Upload direto para S3
     │─────────────────────────────────▶┌─────────┐
     │                                  │   S3    │
     │    4. Confirma upload            └─────────┘
     │──────────────────────────────────▶┌─────────┐
     │                                   │   API   │
     │◀──────────────────────────────────┘ Salva metadata
```

### Endpoints

```ts
// 1. Preparar upload - retorna presigned URL
POST /api/machines/{id}/documents/prepare-upload
Body: { filename, contentType, size, type, title }
Response: { uploadUrl, s3Key }

// 2. Cliente faz upload direto para S3 usando uploadUrl

// 3. Confirmar upload - salva metadata no banco
POST /api/machines/{id}/documents/confirm-upload
Body: { s3Key, filename, contentType, size, type, title }
```

---

## 11. Utilitários (@manuraj/shared-utils)

### API Client

```ts
import { api } from '@manuraj/shared-utils';

// GET
const machines = await api.get<Machine[]>('/api/machines');

// POST
const newMachine = await api.post<Machine>('/api/machines', {
  name: 'Torno CNC',
  code: 'TRN-001',
});

// PUT
await api.put(`/api/machines/${id}`, { status: 'maintenance' });

// DELETE
await api.delete(`/api/machines/${id}`);
```

### Formatadores

```ts
import {
  formatDate,        // "03/02/2025"
  formatDateTime,    // "03/02/2025, 14:30"
  formatMinutes,     // "2h 30min"
  formatFileSize,    // "1.5 MB"
  formatRelativeTime,// "2 dias atrás"
  daysUntil,         // número de dias até data
  isOverdue,         // boolean se data passou
  truncate,          // "texto lon..."
} from '@manuraj/shared-utils';
```

### Display Names (Português)

```ts
import {
  ROLE_DISPLAY_NAMES,           // operator → "Operador"
  MACHINE_STATUS_DISPLAY,       // operational → "Operacional"
  WORK_ORDER_STATUS_DISPLAY,    // in_progress → "Em Andamento"
  WORK_ORDER_TYPE_DISPLAY,      // corrective → "Corretiva"
  WORK_ORDER_PRIORITY_DISPLAY,  // critical → "Crítica"
  DOCUMENT_TYPE_DISPLAY,        // manual → "Manual"
} from '@manuraj/domain';
```

---

## 12. Google AdSense (@manuraj/ads)

### Componentes

```tsx
import { AdProvider, AdBanner, AdRail, AdInFeed, AdPlaceholder } from '@manuraj/ads';

// Wrapper no layout
<AdProvider publisherId={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}>
  {children}
</AdProvider>

// Banner horizontal (header/footer)
<AdBanner slot="1234567890" />

// Rail lateral (sidebar)
<AdRail slot="1234567890" />

// Entre itens de lista
<AdInFeed slot="1234567890" />

// Placeholder para desenvolvimento
<AdPlaceholder width={300} height={250} label="Ad 300x250" />
```

### Comportamento
- Se `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` estiver vazio, mostra placeholders
- Lazy loading com IntersectionObserver
- Respeita `tenant.adsEnabled` para mostrar/ocultar

---

## 13. Scripts NPM

```bash
# Desenvolvimento (separados)
npm run dev              # Pitlane - Admin (porta 3000)
npm run dev:pitlane      # Pitlane - Admin (porta 3000)
npm run dev:torque       # Torque - App operacional (porta 3001)
npm run dev:showroom     # Showroom - Landing page (porta 3002)

# Desenvolvimento (juntos)
npm run dev:all          # 3 apps em paralelo (3000, 3001, 3002)
npm run dev:apps         # Pitlane + Torque (sem Showroom)

# Build
npm run build            # Build pitlane
npm run build:pitlane    # Build pitlane
npm run build:torque     # Build torque
npm run build:showroom   # Build showroom
npm run build:all        # Build todos os apps

# Start (produção)
npm run start            # Start pitlane
npm run start:torque     # Start torque
npm run start:showroom   # Start showroom

# Database
npm run db:seed          # Popula banco com dados demo
npm run db:check         # Diagnóstico do banco
npm run db:up            # Sobe MongoDB local (Docker)
npm run db:down          # Para MongoDB local

# PandaCSS
npm run panda:codegen    # Regenera styled-system

# Testes
npm run test             # Roda Vitest em watch mode
npm run test:run         # Roda testes uma vez
npm run test:coverage    # Com relatório de cobertura

# Lint
npm run lint             # ESLint
npm run lint:all         # Lint em todos os projetos
```

### Dados de Teste (após seed)

```
Tenant: demo
Usuários (senha: demo1234):
  - admin@demo.com     (Supervisor Geral)
  - supervisor@demo.com (Supervisor Manutenção)
  - joao@demo.com      (Manutentor)
  - pedro@demo.com     (Manutentor)
  - maria@demo.com     (Operador)
  - lucas@demo.com     (Operador)
```

---

## 14. Convenções de Código

### Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Arquivos | kebab-case | `work-orders.ts` |
| Componentes | PascalCase | `WorkOrderCard.tsx` |
| Funções/variáveis | camelCase | `fetchWorkOrders` |
| Constantes | SCREAMING_SNAKE | `MAX_FILE_SIZE` |
| Types/Interfaces | PascalCase | `WorkOrder`, `CreateMachineInput` |

### Ordem de Imports

```ts
// 1. React/Next
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Libs internas (@manuraj/*)
import { Button, Card } from '@manuraj/pitkit';
import { WorkOrder, hasPermission, PERMISSIONS } from '@manuraj/domain';
import { api, formatDate } from '@manuraj/shared-utils';

// 3. Styled-system
import { css } from '../../../styled-system/css';

// 4. Relativos locais
import { MyLocalComponent } from './MyLocalComponent';
```

### Estilização

```tsx
// Estilos pontuais - usar css()
<div className={css({ display: 'flex', gap: '4', padding: '6' })}>

// Componentes com variants - criar na @manuraj/pitkit com cva()

// NUNCA usar:
// - CSS modules
// - Tailwind classes
// - styled-components
// - Inline styles (style={})
// - Elementos HTML nativos (button, input, select) quando existir equivalente PitKit
```

---

## 15. Checklist para Novas Features

1. [ ] **Tipos** - Adicionar em `libs/domain/src/types.ts`
2. [ ] **Schema Zod** - Validação em `libs/domain/src/schemas.ts`
3. [ ] **Model Mongoose** - Se nova collection, em `libs/data-access/src/models/`
4. [ ] **Repository** - Em `libs/data-access/src/repositories/`
5. [ ] **API Route** - Em `apps/pitlane/app/api/`
6. [ ] **Componentes UI** - Se reutilizável, em `libs/pitkit/src/`
7. [ ] **Página** - Em `apps/pitlane/app/t/[tenantSlug]/(dashboard)/`
8. [ ] **Permissões** - Verificar RBAC no backend E frontend
9. [ ] **Multi-tenant** - SEMPRE filtrar por tenantId
10. [ ] **Testes** - Adicionar em `tests/`

---

## 16. Variáveis de Ambiente

```env
# === OBRIGATÓRIAS ===
MONGODB_URI=mongodb+srv://...          # MongoDB Atlas connection string
AUTH_SECRET=...                         # openssl rand -base64 32

# === OPCIONAIS ===
NEXTAUTH_URL=http://localhost:3000     # URL base (default: localhost:3000)
AUTH_TRUST_HOST=true                    # Necessário para Vercel

# AWS S3 (para upload de documentos)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=manuraj-documents

# Google AdSense
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-...

# Feature flags
ENABLE_SIGNUP=true
ENABLE_ADS=true

# Cron jobs
CRON_SECRET=...
```

---

## 17. Troubleshooting

### Erro: "The edge runtime does not support Node.js 'crypto' module"
**Causa**: Importando arquivo com MongoDB no middleware
**Solução**: Middleware deve importar apenas `@manuraj/auth/auth.config`

### Erro: "Cannot find configuration for task @manu-raj/web:serve"
**Causa**: NX não tem task "serve" para Next.js
**Solução**: Usar `npm run dev` (que executa `nx dev web`)

### Build falha com erro `/_global-error` prerendering
**Causa**: Bug conhecido do NX plugin com Next.js 16
**Solução**: Usar `node_modules/.bin/next build apps/X` em vez de `nx build X`

### Estilos não aplicam
**Causa**: PandaCSS não está gerando CSS
**Solução**:
1. Verificar se `apps/<app>/panda.config.ts` existe
2. Verificar se `apps/<app>/postcss.config.cjs` existe
3. Rodar `npm run panda:codegen`
4. Consultar `STYLES.md` para paletas e padrões visuais

### Login retorna "Credenciais inválidas"
**Causas possíveis**:
1. MongoDB não conectado - verificar `MONGODB_URI`
2. Usuário não existe - rodar `npm run db:seed`
3. Senha incorreta - senha padrão é `demo1234`

---

## 18. Testes Automatizados

### Estado Atual
- **Framework**: Vitest 4.x (`vitest.config.ts` na raiz com path aliases)
- **Total**: 175 testes unitários passando + 7 testes de integração (tenant isolation, excluído do run padrão)
- **Tempo**: ~1s para rodar testes unitários

### Estrutura de Testes

```
tests/
├── domain/
│   ├── schemas.test.ts          # ✅ 65 testes - Validação Zod (todos os schemas)
│   ├── permissions.test.ts      # ✅ 33 testes - RBAC (5 roles, hasPermission, hierarchy)
│   └── constants.test.ts        # ✅ 16 testes - Display names (pt-BR) + badge variant helpers
├── shared-utils/
│   ├── format.test.ts           # ✅ 44 testes - Formatadores (date, time, filesize, etc)
│   └── api.test.ts              # ✅ 17 testes - buildQueryString, ApiRequestError, api methods
└── tenant-isolation.test.ts     # ⏳ 7 testes - Isolamento multi-tenant (precisa MongoDB)
```

### Comandos

```bash
npx vitest run                                     # Unitários (exclui integração)
npx vitest run tests/tenant-isolation.test.ts      # Integração (precisa MongoDB)
npm run test                                       # Watch mode
```

### Cobertura Pendente (próximos testes a implementar)

| Camada | O que falta | Tipo | Dificuldade |
|--------|-------------|------|-------------|
| **Auth guards** | requireAuth, requirePermission, etc (12 funções) | Unit (mock) | Médio |
| **Repositories** | 6 classes, ~47 métodos (CRUD + queries) | Integration | Médio |
| **UI Components** | 8 componentes PitKit (precisa @testing-library/react) | Component | Baixo |

---

## 19. Pendências Conhecidas

### Torque (Prioridade Alta - app 70% incompleto)
- [ ] `/minhas-os` - Lista de ordens do técnico (não existe)
- [ ] `/nova-solicitacao` - Criar solicitação (não existe)
- [ ] `/maquinas` - Consultar máquinas (não existe)
- [ ] Dashboard com dados reais (hoje hardcoded com TODO no código)
- [ ] Pode consumir as mesmas APIs do Pitlane (`/api/*` já prontas)

### Showroom (Prioridade Média - landing page básica)
- [ ] Formulário de contato/lead capture (rota `/contact` referenciada mas não existe)
- [ ] Fluxo real de signup → criar tenant → redirect pro Pitlane
- [ ] FAQ e depoimentos

### Pitlane (Funcionalidades adicionais)
- [ ] Dashboard com gráficos/métricas visuais (hoje só números)
- [ ] Notificações real-time (quando OS é atribuída/alterada)
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Histórico de alterações (audit log)
- [ ] Ajustes de padding/spacing em algumas telas

### Técnico
- [ ] Expandir cobertura de testes (auth guards, repositories)
- [ ] Migrar middleware para proxy (Next.js 16 deprecou middleware)
- [ ] Email transacional (confirmação de signup, notificações)
- [ ] Rate limiting nos endpoints públicos
- [ ] Internacionalização (i18n) - futuro

---

## 20. Estado da Sessão (Última Atualização: 04 Fevereiro 2026)

### O que está funcionando
1. ✅ Estrutura multi-app criada (Pitlane, Torque, Showroom)
2. ✅ Renaming completo do universo F1 (libs/ui → libs/pitkit, apps/web → apps/pitlane)
3. ✅ PandaCSS configurado e funcionando em todos os apps
4. ✅ MongoDB Atlas configurado e conectado
5. ✅ Seed executado com dados demo (6 users, 7 machines, 7 WOs, 5 plans)
6. ✅ Login funcionando contra Atlas (NextAuth + Credentials)
7. ✅ 175 testes unitários escritos e passando (~1s)
8. ✅ Todos os erros TypeScript corrigidos (0 erros nos 3 apps)
9. ✅ Documentação completa (CLAUDE.md + UNIVERSE.md + STYLES.md)
10. ✅ nx.json configurado com sync.applyChanges: true
11. ✅ vitest.config.ts com path aliases para todos os @manuraj/* packages
12. ✅ Testes de integração separados do run padrão
13. ✅ Paletas de cores diferenciadas (Pitlane=azul, Torque=verde esmeralda)
14. ✅ Títulos das abas identificando cada app
15. ✅ Login pages com layout split-screen padronizado (ambos os apps)
16. ✅ Correções de segurança aplicadas (open redirect, passwordHash, query params, tenant isolation)
17. ✅ Next.js atualizado para 16.1.6
18. ✅ Build scripts corrigidos (bypass de bug NX com `next build` direto)
19. ✅ global-error.tsx criado para os 3 apps
20. ✅ 3 builds passando sem erros (Pitlane, Torque, Showroom)

### Status por app
| App | Páginas | API Routes | Completude |
|-----|---------|------------|------------|
| **Pitlane** (admin) | 12 páginas | 17 endpoints | ~85% funcional |
| **Torque** (campo) | 3 páginas (login + redirect + dashboard hardcoded) | 0 (usa Pitlane) | ~20% stub |
| **Showroom** (landing) | 1 página (landing estática) | 0 | ~30% |

### Correções de segurança aplicadas
- Open redirect no callbackUrl (validação `startsWith('/') && !startsWith('//')`)
- Stripping de passwordHash na resposta do PUT /users/:id
- Validação de query params (role, status) com Zod schemas
- Tenant isolation no `advanceNextDueDate` (findOneAndUpdate com tenantId)
- Remoção de fallback localhost na conexão MongoDB
- Remoção de logging de hash parcial no check-db.ts

### Correções TypeScript aplicadas
- `React.FormEvent` → `React.FormEvent<HTMLFormElement>` (10 arquivos)
- `tsconfig.json` do pitlane: adicionado `../../libs/**/*.ts` no include
- `machine.model.ts`: conflito `model` (string vs método Mongoose) resolvido via Omit
- `auth.config.ts`: `user.id!` assertion + `emailVerified: null`
- `api.post` sem body → adicionado `{}`
- Imports não usados removidos (Link, useParams)
- Badge `size="sm"` removido (prop inexistente)

### Próximos passos sugeridos (por prioridade)
1. **Completar o Torque** (prioridade alta) - minhas-os, nova-solicitacao, maquinas, dados reais no dashboard
2. Implementar testes de auth guards (requireAuth, requirePermission - com mocks)
3. Expandir funcionalidades do Showroom (contato, signup flow)
4. Dashboard Pitlane com gráficos visuais
5. Implementar testes de repositories (com MongoDB Atlas)
6. Testes de componentes PitKit (precisa @testing-library/react)

### Dados de teste no MongoDB Atlas

```
Cluster: manuraj.d1mhwdn.mongodb.net
Database: manuraj

Tenant: demo (slug: "demo")
Usuários (senha: demo1234):
  - admin@demo.com       → Supervisor Geral
  - supervisor@demo.com  → Supervisor Manutenção
  - joao@demo.com        → Manutentor
  - pedro@demo.com       → Manutentor
  - maria@demo.com       → Operador
  - lucas@demo.com       → Operador
```

### APIs disponíveis para o Torque consumir
O Torque pode consumir todas as APIs já prontas no Pitlane:
- `GET /api/work-orders` (com filtro por assignedTo para "minhas OS")
- `POST /api/work-orders` (criar solicitação)
- `POST /api/work-orders/[id]/start` (iniciar OS)
- `POST /api/work-orders/[id]/finish` (finalizar OS)
- `GET /api/machines` (listar máquinas)
- `GET /api/metrics` (dashboard stats)

---

## 21. Contato e Referências

- **Repositório**: Local em `/Users/raj/reposRAJ/manuRaj`
- **GitHub**: https://github.com/rodrigojosebr/manuRaj.git
- **Desenvolvedor**: Raj
- **Comunicação**: Português brasileiro (pt-BR)
