# manuRaj - Documentação do Projeto

> Lido automaticamente pelo Claude Code em toda sessão. Mantenha conciso.
> Última atualização: 11 de Fevereiro de 2026
>
> **Docs especializados** (ler sob demanda):
> - `PITKIT.md` — Catálogo completo do Design System (componentes, props, exemplos)
> - `STYLES.md` — Paletas de cores, layouts, tipografia, padrões visuais
> - `TORQUE.md` — Padrões mobile-first do app operacional (sidebar, páginas, PWA)
> - `UNIVERSE.md` — Narrativa de produto e nomenclatura (metáfora F1)

---

## 1. Visão Geral

**manuRaj** é um SaaS multi-tenant de gestão de manutenção industrial (CMMS).

| Projeto | Metáfora | Função |
|---------|----------|--------|
| **Torque** | O piloto | App operacional mobile-first (porta 3001) |
| **Pitlane** | O pit stop | Admin de gestão desktop (porta 3000) |
| **Showroom** | A vitrine | Landing page pública (porta 3002) |
| **PitKit** | O kit | Design System (Atomic Design) |

### Idiomas
- **Comunicação com desenvolvedor**: Português brasileiro (pt-BR)
- **Código-fonte**: Inglês (variáveis, funções, comentários técnicos)
- **Interface do usuário**: Português brasileiro

---

## 2. Stack

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| Monorepo | NX Workspaces | 22.x |
| Frontend | Next.js (App Router, Turbopack) | 16.x |
| Estilização | PandaCSS (css, cva, design tokens) | 1.8.x |
| Autenticação | NextAuth.js v5 (Credentials + JWT) | 5.0-beta |
| Validação | Zod | 4.x |
| Database | MongoDB Atlas + Mongoose | 9.x |
| Storage | AWS S3 (presigned URLs) | SDK v3 |
| Testes | Vitest | 4.x |

---

## 3. Estrutura do Monorepo

```
manuRaj/
├── apps/
│   ├── pitlane/                    # Admin (supervisores)
│   │   ├── app/
│   │   │   ├── api/                # 17 API routes (garage-pitlane)
│   │   │   ├── login/, signup/
│   │   │   └── t/[tenantSlug]/(dashboard)/   # 12 páginas
│   │   ├── middleware.ts, panda.config.ts
│   │   └── next.config.js
│   │
│   ├── torque/                     # App operacional (mobile-first)
│   │   ├── app/
│   │   │   ├── login/
│   │   │   └── t/[tenantSlug]/     # 9 páginas (ver TORQUE.md)
│   │   │       ├── layout.tsx + TorqueLayoutClient.tsx (sidebar)
│   │   │       ├── page.tsx + TorqueDashboardClient.tsx (dashboard)
│   │   │       ├── minhas-os/      # Lista + [id]/ (detalhe + actions)
│   │   │       ├── nova-solicitacao/ # Form + actions.ts
│   │   │       ├── maquinas/       # Lista + [id]/ (detalhe)
│   │   │       └── config/         # Perfil + senha + actions.ts
│   │   └── panda.config.ts
│   │
│   └── showroom/                   # Landing page pública
│       └── app/ (1 página estática)
│
├── libs/
│   ├── domain/         # Tipos, schemas Zod, constantes, RBAC
│   ├── data-access/    # Conexão MongoDB, models, repositories
│   ├── auth/           # NextAuth config (Edge + Node.js)
│   ├── pitkit/         # Design System (atoms → molecules → organisms)
│   ├── shared-utils/   # API client, formatadores
│   ├── ads/            # Google AdSense components
│   └── config/         # Variáveis de ambiente tipadas
│
├── tests/              # 175 testes unitários + 7 integração
└── scripts/            # seed.ts, check-db.ts
```

---

## 4. Regras Críticas

### PitKit Obrigatório
- **NUNCA** usar `<button>`, `<input>`, `<select>` HTML diretamente — usar PitKit
- **NUNCA** usar Bootstrap, MaterialUI, Tailwind, styled-components
- Se o componente não existir, criar no PitKit primeiro (`libs/pitkit/src/`)
- Catálogo completo em `PITKIT.md`

### Estilização
- **Toda** estilização via `css()` e `cva()` do PandaCSS
- **NUNCA** CSS modules, inline styles, Tailwind classes
- Todos os `css()` vão em `page.styles.ts` — **nunca inline no JSX**
- Import padrão: `import * as S from './page.styles'`
- Estilos dinâmicos: exportar como função `export const card = (status: string) => css({...})`
- Componentes PitKit com variants usam `cva()` em `libs/pitkit/src/`
- Detalhes em `STYLES.md`

### Multi-tenant
- **TODAS** as queries DEVEM filtrar por `tenantId` — violação = vazamento de dados
- Repositories já encapsulam isso: `machineRepository.findById(tenantId, id)`

### Server/Client Split (Torque)
- **Server components** (`page.tsx`): auth, `connectDB()`, queries via repository, redirect
- **Client components** (`*Client.tsx`): interatividade, forms, nav, tabs
- **Serialização**: ObjectId → `String(id)`, Date → `.toISOString()`
- **Mutations**: Server Actions (`actions.ts` com `'use server'`) — não API routes

### Zod v4
- Usar `.issues` (não `.errors`) em ZodError: `parsed.error.issues[0].message`

---

## 5. Convenções de Código

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
// 2. Libs internas (@manuraj/*, @pitkit)
// 3. Styled-system (apenas em page.styles.ts)
// 4. Estilos da página (import * as S from './page.styles')
// 5. Relativos locais
```

### Padrão de Arquivos por Página (Torque)
```
pagina/
├── page.tsx           # Server: auth + data fetch + serialize
├── PaginaClient.tsx   # Client: render + interação
├── page.styles.ts     # Todos os css() da página
└── actions.ts         # Server Actions (se tiver mutations)
```

---

## 6. Autenticação e RBAC

### Fluxo
Login → NextAuth Credentials → JWT com: `id, tenantId, tenantSlug, name, email, role`

### Edge Runtime
- `middleware.ts` → importar apenas `@manuraj/auth/auth.config` (Edge-safe)
- API routes / server components → importar `@manuraj/auth` (Node.js)

### Roles (5 níveis hierárquicos)
| Role | Acesso |
|------|--------|
| `operator` | Visualiza máquinas, abre solicitações |
| `maintainer` | + Executa OS, registra tempo/peças |
| `maintenance_supervisor` | + Gerencia OS, equipe, máquinas |
| `general_supervisor` | + Acesso total ao tenant, métricas |
| `super_admin` | + Acesso a TODOS os tenants |

```ts
import { hasPermission, PERMISSIONS } from '@manuraj/domain';
if (hasPermission(user.role, PERMISSIONS.WORK_ORDERS_START)) { /* ... */ }
```

---

## 7. Database e Repositories

### Models
| Model | Campos Principais |
|-------|-------------------|
| `Tenant` | name, slug, plan, adsEnabled, active |
| `User` | tenantId, email, passwordHash, role, active |
| `Machine` | tenantId, name, code, location, manufacturer, model, serial, status |
| `WorkOrder` | tenantId, machineId, type, status, priority, assignedTo, dueDate |
| `PreventivePlan` | tenantId, machineId, periodicityDays, nextDueDate |
| `MachineDocument` | tenantId, machineId, type, s3Key, title |

### Repositories (sempre requerem tenantId)
```ts
import { machineRepository, workOrderRepository } from '@manuraj/data-access';

machineRepository.findById(tenantId, id)
machineRepository.findByTenant(tenantId, { status?, page?, limit? })
workOrderRepository.findById(tenantId, id)          // popula machineId, assignedTo
workOrderRepository.findByTenant(tenantId, { machineId?, assignedTo?, status? })
workOrderRepository.findAssignedToUser(tenantId, userId, { limit? })
```

---

## 8. Utilitários Compartilhados

### Formatadores (`@manuraj/shared-utils`)
`formatDate`, `formatDateTime`, `formatMinutes`, `formatFileSize`, `formatRelativeTime`, `daysUntil`, `isOverdue`, `truncate`

### Display Names (`@manuraj/domain`)
`ROLE_DISPLAY_NAMES`, `MACHINE_STATUS_DISPLAY`, `WORK_ORDER_STATUS_DISPLAY`, `WORK_ORDER_TYPE_DISPLAY`, `WORK_ORDER_PRIORITY_DISPLAY`

### Badge Helpers (`@pitkit`)
`getStatusBadgeVariant(status)`, `getPriorityBadgeVariant(priority)`, `getMachineStatusBadgeVariant(status)`

### API Client (`@manuraj/shared-utils`) — usado pelo Pitlane
`api.get()`, `api.post()`, `api.put()`, `api.delete()` — type-safe, auto-error handling

---

## 9. Design Tokens (Brand por App)

| App | brand.600 | brand.700 |
|-----|-----------|-----------|
| **Pitlane** | `#2563eb` (azul) | `#1d4ed8` |
| **Torque** | `#059669` (verde) | `#047857` |

Tokens semânticos de spacing (ambos apps):
`page` (24px), `section` (32px), `card-padding` (24px), `card-gap` (20px), `field-gap` (16px)

Paletas completas em `STYLES.md`.

---

## 10. Scripts e Comandos

```bash
# Dev
npm run dev              # Pitlane (3000)
npm run dev:torque       # Torque (3001)
npm run dev:all          # Todos em paralelo

# Build
npm run build:torque     # node_modules/.bin/next build apps/torque (bypassa bug NX)
npm run build:pitlane    # Build pitlane
npm run build:all        # Build todos

# Testes
npx vitest run           # 175 testes unitários (~1s)
npm run test             # Watch mode

# PandaCSS
npm run panda:codegen    # OBRIGATÓRIO após mudar panda.config.ts

# Database
npm run db:seed          # Popular com dados demo
```

### Dados de Teste
```
Tenant: demo (slug: "demo") — Senha: demo1234
  admin@demo.com (Supervisor Geral) | supervisor@demo.com (Sup. Manutenção)
  joao@demo.com (Manutentor) | pedro@demo.com (Manutentor)
  maria@demo.com (Operador) | lucas@demo.com (Operador)
```

---

## 11. Troubleshooting

| Erro | Causa | Solução |
|------|-------|---------|
| Edge runtime `crypto` | MongoDB importado no middleware | Middleware importar apenas `@manuraj/auth/auth.config` |
| `/_global-error` prerendering | Bug NX plugin Next.js 16 | Usar `node_modules/.bin/next build apps/X` |
| Estilos não aplicam | PandaCSS desatualizado | `npm run panda:codegen` |
| "Credenciais inválidas" | Banco vazio ou senha errada | `npm run db:seed` (senha: `demo1234`) |

---

## 12. Testes Automatizados

- **175 testes unitários** passando (~1s): schemas Zod (65), RBAC (33), constants (16), formatadores (44), API client (17)
- **7 testes integração** (tenant isolation, precisa MongoDB)
- Estrutura: `tests/domain/`, `tests/shared-utils/`

---

## 13. Estado Atual (11 Fevereiro 2026)

### Status por App
| App | Páginas | Completude |
|-----|---------|------------|
| **Pitlane** (admin) | 12 páginas + 17 API endpoints | ~85% |
| **Torque** (campo) | 9 páginas (server actions, sem API routes) | ~95% |
| **Showroom** (landing) | 1 página estática | ~30% |

### Torque — Páginas Implementadas
| Rota | Descrição |
|------|-----------|
| `/login` | Login com tenant + email + senha |
| `/t/[slug]` | Dashboard: stats, OS recentes clicáveis, ações rápidas |
| `/t/[slug]/minhas-os` | Lista de OS com tabs + cards clicáveis |
| `/t/[slug]/minhas-os/[id]` | Detalhe OS: info completa + iniciar/finalizar |
| `/t/[slug]/nova-solicitacao` | Formulário para abrir solicitação |
| `/t/[slug]/maquinas` | Lista máquinas com tabs + cards clicáveis |
| `/t/[slug]/maquinas/[id]` | Detalhe máquina: info + OS recentes |
| `/t/[slug]/config` | Perfil, troca de senha, logout |

### Infraestrutura
- 3 builds passando — 0 erros TypeScript
- 175 testes unitários passando
- MongoDB Atlas conectado (seed: 6 users, 7 machines, 7 WOs, 5 plans)
- NextAuth + JWT funcionando
- PitKit Card com variants (default/elevated/outlined/filled + colorScheme + interactive + borderPosition)
- Torque: sidebar colapsável (64px/240px) + server actions para mutations

---

## 14. Roadmap

### Torque (~95% → polimento)
- [x] Todas as 9 páginas implementadas
- [ ] Melhorias de UX pontuais (loading states, feedback visual)

### Showroom (~30% → apresentável)
- [ ] Formulário de contato/lead capture
- [ ] Fluxo real de signup → criar tenant → redirect pro Pitlane

### Pitlane (melhorias)
- [ ] Dashboard com gráficos visuais
- [ ] Notificações (OS atribuída/alterada)
- [ ] Exportação de relatórios (PDF/Excel)

### Técnico
- [ ] Testes de auth guards (com mocks)
- [ ] Migrar middleware para proxy (Next.js 16 deprecou middleware)

---

## 15. Checklist para Novas Features

1. [ ] **Tipos** — `libs/domain/src/types.ts`
2. [ ] **Schema Zod** — `libs/domain/src/schemas.ts`
3. [ ] **Model Mongoose** — `libs/data-access/src/models/` (se nova collection)
4. [ ] **Repository** — `libs/data-access/src/repositories/`
5. [ ] **API Route** (Pitlane) ou **Server Action** (Torque)
6. [ ] **Componentes UI** — `libs/pitkit/src/` (se reutilizável)
7. [ ] **Página** — `apps/<app>/app/t/[tenantSlug]/`
8. [ ] **Permissões** — RBAC no backend E frontend
9. [ ] **Multi-tenant** — Filtrar por tenantId
10. [ ] **Testes** — `tests/`

---

## 16. Referências

- **Repositório**: `/Users/raj/reposRAJ/manuRaj`
- **GitHub**: https://github.com/rodrigojosebr/manuRaj.git
- **Desenvolvedor**: Raj
