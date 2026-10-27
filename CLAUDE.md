# manuRaj - Documentação do Projeto

> Lido automaticamente pelo Claude Code em toda sessão. Mantenha conciso.
> Última atualização: 28 de Agosto de 2026
>
> **Docs especializados** (ler sob demanda):
> - `PLANO.md` — **Roadmap, escada kaizen, decisões pendentes e falsos positivos já investigados**
> - `PITKIT.md` — Catálogo completo do Design System (componentes, props, exemplos)
> - `STYLES.md` — Paletas de cores, layouts, tipografia, padrões visuais
> - `TORQUE.md` — Padrões mobile-first do app operacional (sidebar, páginas, PWA)
> - `UNIVERSE.md` — Narrativa de produto e nomenclatura (metáfora F1)
> - `INFRA.md` — Plano de hardening, segurança, observabilidade e automação

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
| Monorepo | **npm workspaces** (`apps/*`, `libs/*`) + `paths` do `tsconfig.base.json` | — |
| Frontend | Next.js (App Router, Turbopack) | 16.x |
| Estilização | PandaCSS (styled, cva, design tokens) | 1.8.x |
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
│   │   │   ├── api/                # 21 API routes (ver §13)
│   │   │   ├── docs/               # Swagger UI (OpenAPI 3.1)
│   │   │   ├── login/, signup/
│   │   │   └── t/[tenantSlug]/(dashboard)/   # 12 páginas
│   │   ├── proxy.ts, panda.config.ts
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
│   ├── data-access/    # Conexão MongoDB, models, repositories (inclui audit-log)
│   ├── auth/           # NextAuth config (Edge + Node.js)
│   ├── pitkit/         # Design System (atoms → molecules → organisms)
│   ├── shared-utils/   # API client, formatadores, logger (Pino)
│   ├── ads/            # Google AdSense components
│   └── config/         # Variáveis de ambiente tipadas
│
├── tests/              # 265 testes unitários + 7 integração
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
- **Toda** estilização via `styled()` do PandaCSS — **nunca `className` no JSX**
- **NUNCA** CSS modules, inline styles, Tailwind classes
- Todos os estilos em `page.styles.ts` como `styled()` components
- Import padrão: `import * as S from './page.styles'`
- Uso no JSX: `<S.Wrapper>`, `<S.InfoRow>`, `<S.InfoIcon icon="map-pin" />`
- `styled()` aceita tags HTML e componentes PitKit: `styled('div', {...})`, `styled(Icon, {...})`, `styled(Link, {...})`
- Estilos dinâmicos: usar `cva()` variants dentro do `styled()` — ex: `styled('div', cva({ variants: { status: {...} } }))`
- Componentes PitKit internos usam `cva()` em `libs/pitkit/src/`
- Detalhes em `STYLES.md`

> ⚠️ **Dívida conhecida — o Pitlane NÃO cumpre esta regra.** Torque e Showroom estão 100% em
> `styled()` (0 `className`). O Pitlane tem **261 `className`** e **12 arquivos importando `{ css }`**:
> o commit `65274c7` migrou PitKit e Torque e não voltou pro Pitlane. Plano de migração página-por-página
> no `PLANO.md` (Degrau 3). **Ao editar arquivo do Pitlane, migrar para `styled()` — não replicar o `css()`.**
> Os `className={className}` do PitKit são repasse de prop, API legítima do design system, não violação.

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
// 3. Estilos da página (import * as S from './page.styles')
// 4. Relativos locais
```

### Padrão de Arquivos por Página (Torque)
```
pagina/
├── page.tsx           # Server: auth + data fetch + serialize
├── PaginaClient.tsx   # Client: render + interação (usa <S.Wrapper>, <S.InfoRow>...)
├── page.styles.ts     # styled() components (importa styled-system/jsx + PitKit)
└── actions.ts         # Server Actions (se tiver mutations)
```

### Padrão de page.styles.ts
```ts
// page.styles.ts
import Link from 'next/link';
import { styled } from '../../../../styled-system/jsx';
import { Icon } from '@pitkit';

export const Wrapper = styled('div', { base: { padding: 'page' } });
export const BackLink = styled(Link, { base: { color: 'brand.600' } });
export const InfoIcon = styled(Icon, { base: { color: 'gray.400' } });
```

---

## 6. Autenticação e RBAC

### Fluxo
Login → NextAuth Credentials → JWT com: `id, tenantId, tenantSlug, name, email, role`

### Edge Runtime
- `proxy.ts` → importar apenas `@manuraj/auth/auth.config` (Node.js runtime)
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
| `AuditLog` | tenantId, userId, action, entity, entityId, before/after (13 mutations, fire-and-forget) |

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

### Logger (`@manuraj/shared-utils`)
`logger` (Pino) e `createLogger(context)`. **Server-side apenas** — auth, DB, cron, guards e
`withErrorHandler`. Client component (`'use client'`) usa `console.error` mesmo: é log de navegador.
Nível por `LOG_LEVEL` (silenciado nos testes via config do vitest).

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

> ℹ️ **Como isso funciona (não "consertar").** Os 4 `panda.config.ts` (raiz + 3 apps) apontam `outdir`
> para o **mesmo** `styled-system/` da raiz — parece colisão, não é. O CSS real é gerado **por app**
> pelo PostCSS (cada app tem seu `postcss.config.cjs` e seu `global.css`); conferido no CSS compilado:
> Torque `#059669`, Pitlane `#2563eb`. O `styled-system/` compartilhado só fornece a factory `jsx`/`css`
> e os tipos. **Ninguém usa `token()` em runtime — se passar a usar, aí sim vira colisão real.**

---

## 10. Scripts e Comandos

```bash
# Dev
npm run dev              # Pitlane (3000)
npm run dev:torque       # Torque (3001)
npm run dev:all          # Todos em paralelo

# Build
npm run build:torque     # next build apps/torque
npm run build:pitlane    # Build pitlane
npm run build:all        # Build todos

# Testes e tipos
npm run test:run         # 265 testes unitários (~1,5s)
npm run test             # Watch mode
npm run typecheck        # OS 3 APPS — use este, nunca `tsc -p tsconfig.json` (raiz não checa nada)

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
| Edge runtime `crypto` | MongoDB importado no proxy | Proxy importar apenas `@manuraj/auth/auth.config` |
| `/_global-error` prerendering | Era bug do plugin NX com Next 16 | **NX foi removido em 28/ago/2026** — se voltar a aparecer, é outra causa |
| Estilos não aplicam | PandaCSS desatualizado | `npm run panda:codegen` |
| "Credenciais inválidas" | Banco vazio ou senha errada | `npm run db:seed` (senha: `demo1234`) |
| `tsc` passa em 0,6s sem erro | `tsconfig.json` da raiz tem `files: []` — **não checa nada** | `npm run typecheck` (roda os 3 apps) |
| Estilo do app errado (cor do outro app) | codegen rodou com a config errada | CSS é por app via PostCSS — ver nota em §9 antes de mexer |

---

## 12. Testes Automatizados

- **265 testes unitários** passando (~1s): schemas Zod (65), RBAC (33), constants (16), formatadores (44), API client (17), auth guards (46), auth config (20), sanitize (24)
- **7 testes integração** (tenant isolation, precisa MongoDB)
- Estrutura: `tests/domain/`, `tests/shared-utils/`

---

## 13. Estado Atual (28 Agosto 2026)

> Verificado rodando, não lendo doc: 265 testes passando (1,57s), typecheck limpo nos 3 apps,
> zero `TODO`/`FIXME` no código, nenhum segredo rastreado.

### Status por App
| App | Superfície | Completude | Padrão `styled()` |
|-----|-----------|------------|-------------------|
| **Pitlane** (admin) | 12 páginas + **21 API routes** | ~85% | ❌ **0%** — ver dívida em §4 |
| **Torque** (campo) | 9 páginas, server actions, PWA | ~100% | ✅ 100% (9 `.styles.ts`) |
| **Showroom** (landing) | 1 rota + Hero/Header/Footer/ContactForm | ~70% | ✅ 100% (11 `.styles.ts`) |

### Duas arquiteturas convivendo (intencional, não bug)
| | Pitlane | Torque / Showroom |
|---|---|---|
| Componentes | `'use client'` (14 arquivos) | Server components + `*Client.tsx` |
| Dados | `fetch` no cliente → API routes | Repository no servidor |
| Mutations | API routes (com OpenAPI publicado) | Server Actions |

As API routes do Pitlane **não são legado**: têm OpenAPI em `/docs`, são superfície de produto.

### API routes do Pitlane (21)
`auth/[...nextauth]` · `health` · `metrics` · `docs/spec` · `lead` · `signup` ·
`cron/generate-preventive-orders` · `machines` (+`[id]`, `[id]/documents`, `prepare-upload`,
`confirm-upload`) · `work-orders` (+`[id]`, `assign`, `start`, `finish`) · `preventive-plans` (+`[id]`) ·
`users` (+`[id]`)

### Infraestrutura (detalhes em `INFRA.md`)
- **Logging estruturado** (Pino) em auth, DB, cron e guards
- **Audit log** — model + repository, integrado em 13 mutations (fire-and-forget)
- **OpenAPI 3.1 + Swagger UI** em `/docs`, spec em `/api/docs/spec`
- **PWA do Torque** · **Health check** `/api/health` · **Métricas** `/api/metrics`
- **Cron de preventivas** · **Transactions** no signup · **Input sanitization** (Zod + `sanitize()`)
- MongoDB Atlas conectado (seed: 6 users, 7 máquinas, 7 OS, 5 planos)
- Torque: sidebar colapsável (64px/240px), `loading.tsx` em todas as rotas, `error.tsx` + `not-found.tsx`

### Pendências travando o repo
- 🚨 **Nunca foi deployado.** Não existe `.vercel/` nem `vercel.json`; `.env.example` só tem
  `localhost:3000`. O app roda apenas local, com MongoDB Atlas na nuvem. Serão **3 projetos na
  Vercel** (um por app, mesmo repo, Root Directory diferente) — plano em `PLANO.md` §3.3.
- `package.json` **modificado e não commitado desde 22/jul**: meia-migração `nx dev` → `next dev`
  (`start` e `lint` continuam em `nx`). Decisão em `PLANO.md` §3.1.


## 14. Roadmap

**Roadmap completo, escada kaizen e decisões pendentes: `PLANO.md`.** Resumo:

### Feito
- [x] Torque 100% — 9 páginas, loading/error/404, server actions, PWA
- [x] Showroom — lead capture (`ContactForm` + `/api/lead`) e signup real (`/api/signup`)
- [x] Infra fase 1 e 2 parcial: Pino, audit log, OpenAPI, cron, transactions, sanitization
- [x] Ferramental: `npm run typecheck` que checa de verdade os 3 apps

### Aberto — em ordem
- [ ] **Decidir NX: fica ou sai** (trava o `package.json` pendurado) — `PLANO.md` §3.1
- [ ] **Pitlane no padrão `styled()`** — 12 páginas, uma por sessão — `PLANO.md` Degrau 3
- [ ] Rate limiting e CSRF — `INFRA.md` (antes de escala, não é kaizen)
- [ ] Pitlane: dashboard com gráficos, notificações, exportação de relatórios

## 15. Kaizen — melhoria pequena e contínua, todo dia

**Achou, já trata.** Typo em doc, nome ruim de variável, função morta, `console.log` esquecido, doc que
descreve o que o código não faz mais: se o conserto é pequeno e seguro, conserta **no mesmo passo** e
avisa numa linha.

- **Pequeno e seguro** = poucas linhas, não muda comportamento, não pede dependência nova.
- **Grande ou arriscado** = registra no `PLANO.md` e avisa. Kaizen **não** é refactor de brinde.
- **Todo dia, um degrau.** Toda sessão deixa o repo melhor do que encontrou.
- Neste repo o kaizen tem endereço: **tocou arquivo do Pitlane, migra ele pro `styled()`.**


## 16. Checklist para Novas Features

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

## 17. Referências

- **Repositório**: `/Users/raj/reposRAJ/manuRaj`
- **GitHub**: https://github.com/rodrigojosebr/manuRaj.git
- **Desenvolvedor**: Raj
