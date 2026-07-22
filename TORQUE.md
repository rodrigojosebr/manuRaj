# Torque - App Operacional (Mobile-First)

> Particularidades do Torque. Padrões gerais em `CLAUDE.md`, paletas em `STYLES.md`, design system em `PITKIT.md`.

---

## Visão Geral

O **Torque** é o app mobile-first para manutentores e operadores executarem ordens de serviço em campo. Porta 3001.

---

## Arquitetura Server/Client

O Torque segue o padrão de split entre server components (dados) e client components (interação):

```
layout.tsx (server) ──────── auth + tenant fetch ──→ TorqueLayoutClient.tsx (client: nav, ads, logout)
page.tsx   (server) ──────── stats do MongoDB   ──→ TorqueDashboardClient.tsx (client: render)
minhas-os/page.tsx (server) ── OS do user       ──→ MinhasOsClient.tsx (client: tabs, cards, filtros)
minhas-os/[id]/page.tsx (server) ── OS detail   ──→ WoDetailClient.tsx (client: info + start/finish actions)
nova-solicitacao/page.tsx (server) ── máquinas  ──→ NovaSolicitacaoClient.tsx (client: form → server action)
maquinas/page.tsx (server) ──────── máquinas   ──→ MaquinasClient.tsx (client: tabs, cards, filtros)
maquinas/[id]/page.tsx (server) ── machine det  ──→ MachineDetailClient.tsx (client: info + OS recentes)
config/page.tsx   (server) ──────── user data  ──→ ConfigClient.tsx (client: perfil, forms → server actions)
```

- **Server components**: autenticação, `connectDB()`, queries via repository, redirect se não autenticado
- **Client components**: interatividade (forms, nav, logout, links, tabs, filtros)
- **Serialização**: server → client via props (ObjectId → string, Date → ISO string)

---

## Layout — Sidebar Colapsavel

### Sidebar (substitui header fixo + bottom nav)
- **Colapsada** (padrao desktop): 64px de largura, so icones SVG 24x24 centralizados
- **Expandida**: 240px de largura, icone + label de cada item
- **Toggle**: botao hamburger (colapsada) / chevron-left (expandida) no topo da sidebar
- **Transicao**: `transition: width 0.2s ease` suave

### Responsividade
- **Desktop (>= md)**: sidebar fixa a esquerda, conteudo ao lado. Colapsavel via toggle.
- **Mobile (< md)**: sidebar oculta. Header mobile (brand.600) com hamburger. Sidebar abre como overlay (position fixed + backdrop escuro). Sempre 240px no mobile.

### Itens de Navegacao (5 + logout no footer)
| Icone SVG | Label | Rota |
|-----------|-------|------|
| home | Inicio | `/t/{slug}` |
| clipboard | Minhas OS | `/t/{slug}/minhas-os` |
| plus-circle | Nova OS | `/t/{slug}/nova-solicitacao` |
| gear | Maquinas | `/t/{slug}/maquinas` |
| wrench | Config | `/t/{slug}/config` |

### Sidebar Footer
- Avatar circular (inicial do nome, `brand.100` bg)
- Nome do usuario + role display name (pt-BR)
- Botao "Sair" com icone logout
- Tudo oculto por `overflow: hidden` quando colapsada — so avatar + icone logout visiveis

### Ads
- AdBanner horizontal no topo do conteudo (mobile only, `md: display: none`)
- Sem ad rails laterais (diferente do Pitlane)
- AdProvider wrapa todo o layout

---

## Spacing Tokens Semânticos

Definidos em `apps/torque/panda.config.ts` (e espelhados no Pitlane):

| Token | Valor | Px | Uso |
|-------|-------|-----|-----|
| `page` | `spacing.6` | 24px | Padding de página/conteúdo |
| `section` | `spacing.8` | 32px | Margem entre seções |
| `card-padding` | `spacing.6` | 24px | Padding interno de cards |
| `card-gap` | `spacing.5` | 20px | Gap entre cards |
| `field-gap` | `spacing.4` | 16px | Gap entre campos de form |

Uso nos styles: `padding: 'page'`, `gap: 'card-gap'`, etc.

---

## Padrão de Estilos

Todos os arquivos seguem o padrão de estilos extraídos:

```
page.tsx                                   → import * as S from './page.styles'
page.styles.ts                             → exports de css()
TorqueLayoutClient.tsx                     → import * as S from './TorqueLayoutClient.styles'
TorqueLayoutClient.styles.ts               → exports de css()
login/page.tsx                             → import * as S from './page.styles'
login/page.styles.ts                       → exports de css()
minhas-os/MinhasOsClient.tsx               → import * as S from './page.styles'
minhas-os/page.styles.ts                   → exports de css()
minhas-os/[id]/WoDetailClient.tsx          → import * as S from './page.styles'
minhas-os/[id]/page.styles.ts             → exports de css()
nova-solicitacao/NovaSolicitacaoClient.tsx  → import * as S from './page.styles'
nova-solicitacao/page.styles.ts            → exports de css()
maquinas/MaquinasClient.tsx                → import * as S from './page.styles'
maquinas/page.styles.ts                    → exports de css()
maquinas/[id]/MachineDetailClient.tsx      → import * as S from './page.styles'
maquinas/[id]/page.styles.ts              → exports de css()
config/ConfigClient.tsx                    → import * as S from './page.styles'
config/page.styles.ts                      → exports de css()
```

**Regra**: Zero `css()` inline nos arquivos `.tsx` do Torque.

---

## Paleta Brand (Verde Esmeralda)

Definida em `apps/torque/panda.config.ts`:
- `brand.600` = `#059669` (cor principal)
- `brand.700` = `#047857` (branding panel do login)
- `brand.50` = `#ecfdf5` (backgrounds de stat cards)

O `global-error.tsx` usa `#059669` inline (exceção justificada - renderiza fora do PandaCSS pipeline).

---

## Dashboard Rico

O dashboard busca 7 dados do MongoDB via server component:
- `countAssignedByStatus(tenantId, userId, 'assigned')` → OS abertas do usuario
- `countAssignedByStatus(tenantId, userId, 'in_progress')` → OS em andamento
- `countOverdueByAssignee(tenantId, userId)` → OS vencidas
- `countCompletedThisMonth(tenantId)` → Concluidas no mes (equipe inteira)
- `machineRepository.countByTenant(tenantId)` → Total de maquinas
- `findAssignedToUser(tenantId, userId, { limit: 5 })` → OS recentes (serializadas)
- `preventivePlanRepository.findDueSoon(tenantId, 7)` → Planos preventivos proximos 7 dias

### Layout (5 secoes)
1. **Saudacao** — "Ola, {userName}" + Badge com role + data atual (pt-BR, weekday+dia+mes)
2. **Resumo** — Grid 2x2 (mobile) / 4 colunas (desktop) de stat cards
   - OS Abertas (brand), Em Andamento (warning), Vencidas (danger), Concluidas no Mes (success)
3. **OS Recentes** — Lista de ate 5 cards com borda esquerda colorida por status + link "Ver todas"
   - Cada card: maquina, descricao truncada (80 chars), badges de status + prioridade
4. **Manutencoes Programadas** — Proximos 7 dias via `findDueSoon`
   - Cada item: nome do plano + maquina, data de vencimento + dias restantes
   - Urgente (<=2 dias): cor laranja
5. **Acoes Rapidas** — Grid 2x2 com contadores (pendentes, equipamentos)

### Componentes PitKit usados
- `Heading`, `Badge`, `getStatusBadgeVariant`, `getPriorityBadgeVariant`
- `ROLE_DISPLAY_NAMES`, `WORK_ORDER_STATUS_DISPLAY`, `WORK_ORDER_PRIORITY_DISPLAY`
- `truncate`, `formatDate`, `daysUntil` de shared-utils

---

## Página /minhas-os (Lista de OS)

Arquitetura:
- `page.tsx` (server): auth → `findAssignedToUser(tenantId, userId, { limit: 100 })` → serializa → props
- `MinhasOsClient.tsx` (client): tabs de filtro + lista de cards

**Tabs**: Todas | Atribuídas | Em Andamento | Concluídas (filtro client-side)

**Card de OS** usa `div` com `css()` estilizado (borda esquerda dinâmica via `S.card(status)`):
- Borda esquerda 4px colorida por status: assigned→brand, in_progress→warning, completed→success, open→blue
- OS vencidas: borda vermelha via `S.cardOverdue`
- Conteúdo interno: máquina (🔧), descrição (80 chars), badges (tipo + prioridade), prazo, status bar
- Cards clicáveis via `<Link>` → `/minhas-os/[id]`

**Componentes PitKit usados**: `Heading`, `Text`, `Badge`, `Card`, `getPriorityBadgeVariant`, `EmptyState`
**Formatadores**: `formatDate`, `formatMinutes`, `isOverdue`, `truncate`
**Display names**: `WORK_ORDER_STATUS_DISPLAY`, `WORK_ORDER_TYPE_DISPLAY`, `WORK_ORDER_PRIORITY_DISPLAY`

---

## APIs, Repositories e Server Actions

### Leitura (server components → repositories direto)
- `workOrderRepository.findAssignedToUser()` — lista de OS + OS recentes do dashboard
- `workOrderRepository.findById()` — detalhe de OS (`/minhas-os/[id]`)
- `workOrderRepository.findByTenant({ machineId })` — OS de uma máquina (`/maquinas/[id]`)
- `workOrderRepository.countAssignedByStatus()` — stats do dashboard
- `workOrderRepository.countOverdueByAssignee()` — OS vencidas
- `workOrderRepository.countCompletedThisMonth()` — concluídas no mês
- `machineRepository.findByTenant()` — lista de máquinas
- `machineRepository.findById()` — detalhe de máquina (`/maquinas/[id]`)
- `machineRepository.countByTenant()` — total de máquinas (dashboard)

### Escrita (client → server actions)
O Torque usa **Server Actions** (`'use server'`) para mutations, evitando duplicar API routes do Pitlane:
- `nova-solicitacao/actions.ts` → `createWorkOrderAction()` — cria OS tipo `request`
- `config/actions.ts` → `updateProfileAction()` — edita nome/email + `changePasswordAction()` — troca senha
- `minhas-os/[id]/actions.ts` → `startWorkOrderAction()` — inicia OS (status → in_progress) + `finishWorkOrderAction()` — finaliza OS (status → completed, timeSpentMin, notes)

Padrão de um server action no Torque:
1. `auth()` — verifica sessão
2. `hasPermission()` — verifica RBAC
3. `schema.safeParse()` — valida input com Zod
4. `repository.method()` — executa no banco
5. Retorna `{ success: true }` ou `{ success: false, error: string }`

---

## PWA & Mobile Patterns

Configurados em `global.css`:
- Viewport: `width=device-width, initial-scale=1, viewport-fit=cover`
- `touch-action: manipulation` (evita double-tap zoom)
- Input `font-size: 16px` (evita zoom automático no iOS)
- Scrollbar fina (4px) para mobile
- Focus ring verde: `#10b981`
- Tap highlight: `rgba(16,185,129,0.2)`
- Safe areas: `env(safe-area-inset-*)` para dispositivos com notch

---

## Página /nova-solicitacao (Formulário)

Arquitetura:
- `page.tsx` (server): auth → `machineRepository.findByTenant(tenantId, { limit: 200 })` → filtra decommissioned → serializa → props
- `NovaSolicitacaoClient.tsx` (client): formulário com submit via server action
- `actions.ts` (server action): auth + RBAC + Zod + cria OS tipo `request`

**Campos do formulário:**
| Campo | Componente PitKit | Obrigatório |
|-------|-------------------|-------------|
| Máquina | `SelectField` (lista do server) | Sim |
| Prioridade | `SelectField` (Baixa/Média/Alta/Crítica, default: Média) | Sim |
| Descrição | `TextareaField` (max 2000 chars) | Sim |

**Fluxo de sucesso**: Mostra card verde com botões "Ver Minhas OS" e "Nova Solicitação"
**Permissão**: `WORK_ORDERS_CREATE_REQUEST` (operadores) ou `WORK_ORDERS_CREATE` (supervisores)

---

## Página /minhas-os/[id] (Detalhe de OS)

Arquitetura:
- `page.tsx` (server): auth → `workOrderRepository.findById(tenantId, id)` → redirect se não encontrada → serializa (incluindo machine, assignedTo, partsUsed) → props
- `WoDetailClient.tsx` (client): info completa da OS + ações de iniciar/finalizar
- `actions.ts` (server actions): `startWorkOrderAction()` + `finishWorkOrderAction()`
- `page.styles.ts`: estilos extraídos (padrão Torque)

**Layout:**
1. **Voltar** — Link ← para `/minhas-os`
2. **Header** — Máquina (nome + código) + badges (status, tipo, prioridade, vencida)
3. **Descrição** — Texto completo da OS
4. **Informações** — Grid com ícones: localização, prazo, atribuído a, criada em, iniciada em
5. **Resultado** (se completed) — Data conclusão, tempo gasto, notas
6. **Ações** — Botão "Iniciar OS" (se assigned/open) ou "Finalizar OS" (se in_progress, com form de tempo + notas)

**Permissões**: `WORK_ORDERS_START` para iniciar, `WORK_ORDERS_FINISH` para finalizar
**Componentes PitKit**: `Badge`, `Button`, `TextField`, `TextareaField`, `getStatusBadgeVariant`, `getPriorityBadgeVariant`
**Formatadores**: `formatDate`, `formatMinutes`, `daysUntil`, `isOverdue`

**Navegação para detalhe:**
- Dashboard → OS Recentes (cards clicáveis com Link)
- /minhas-os → cards clicáveis com Link
- /maquinas/[id] → OS recentes da máquina (cards clicáveis com Link)

---

## Página /maquinas (Consulta de Máquinas)

Arquitetura:
- `page.tsx` (server): auth → `machineRepository.findByTenant(tenantId, { limit: 200 })` → serializa → props
- `MaquinasClient.tsx` (client): tabs de filtro + lista de cards (read-only)
- `page.styles.ts`: estilos extraídos (padrão Torque)

**Tabs**: Todas | Operacional | Manutenção | Parada (filtro client-side)
- `decommissioned` aparece em "Todas" mas não tem tab dedicado

**Card de máquina** usa `<Card variant="outlined" colorScheme={status} borderPosition="left">`:
- Borda esquerda colorida por status: operational→success, maintenance→warning, stopped→danger, decommissioned→neutral
- Conteúdo: nome (🔧), código, localização (📍), fabricante • modelo, Badge de status

**Componentes PitKit usados**: `Heading`, `Text`, `Badge`, `Card`, `getMachineStatusBadgeVariant`, `EmptyState`
**Display names**: `MACHINE_STATUS_DISPLAY`

---

## Página /maquinas/[id] (Detalhe de Máquina)

Arquitetura:
- `page.tsx` (server): auth → `machineRepository.findById(tenantId, id)` → redirect se não encontrada → `workOrderRepository.findByTenant(tenantId, { machineId, limit: 5 })` → serializa → props
- `MachineDetailClient.tsx` (client): info completa da máquina + OS recentes clicáveis
- `page.styles.ts`: estilos extraídos (padrão Torque)

**Layout:**
1. **Voltar** — Link ← para `/maquinas`
2. **Header** — Nome da máquina + badges (código, status)
3. **Informações** — Grid com ícones: localização (📍), fabricante (🏭), modelo (📐), serial (🔢)
4. **OS Recentes** — Últimas 5 OS da máquina, cards clicáveis → `/minhas-os/[id]` (borda esquerda por status)

**Navegação para detalhe:** /maquinas → cards clicáveis com Link

**Componentes PitKit**: `Badge`, `getMachineStatusBadgeVariant`, `getStatusBadgeVariant`, `getPriorityBadgeVariant`
**Display names**: `MACHINE_STATUS_DISPLAY`, `WORK_ORDER_STATUS_DISPLAY`, `WORK_ORDER_PRIORITY_DISPLAY`
**Formatadores**: `truncate`, `formatDate`

---

## Página /config (Configurações)

Arquitetura:
- `page.tsx` (server): auth → `userRepository.findById(tenantId, userId)` → serializa → props
- `ConfigClient.tsx` (client): perfil, edição, troca de senha, logout
- `actions.ts` (server actions): `updateProfileAction()` + `changePasswordAction()`
- `page.styles.ts`: estilos extraídos (padrão Torque)

**Seções (4 cards):**
1. **Card de perfil** — `Card variant="filled" colorScheme="brand"`: nome, email, Badge com role, data membro
2. **Editar Perfil** — `Card` com TextField nome + email, Button "Salvar Alterações"
3. **Alterar Senha** — `Card` com 3 TextFields type="password", Button "Alterar Senha"
4. **Logout** — `Button variant="danger" fullWidth`

**Schemas Zod**: `updateProfileSchema` (name, email) e `changePasswordSchema` (currentPassword, newPassword, confirmPassword com refine)

**Server Actions:**
- `updateProfileAction`: valida input → verifica email único no tenant → `userRepository.update()`
- `changePasswordAction`: valida input → `verifyPassword()` → `userRepository.update({ password })` (hash automático)

**Self-service**: Usuário não pode alterar role nem active status (admin-only no Pitlane).

**Componentes PitKit usados**: `Heading`, `Badge`, `Card`, `CardContent`, `TextField`, `Button`
**Formatadores**: `formatDate`
**Display names**: `ROLE_DISPLAY_NAMES`

---

## Infraestrutura UX

### Loading Skeletons (`loading.tsx`)
Cada rota tem um `loading.tsx` que renderiza skeletons PitKit enquanto o server component carrega:
- Usa `Skeleton`, `SkeletonCard` de `@pitkit`
- Server components (sem `'use client'`)
- Estilos inline via `css()` (exceção aceita — arquivos de infraestrutura sem `page.styles.ts`)
- Layout do skeleton espelha a estrutura da página real (stats, tabs, cards, form fields)

### Error Boundary (`error.tsx`)
- `'use client'` (requisito Next.js)
- Botão "Tentar novamente" via `reset()` + PitKit `Button`
- Renderiza no layout do tenant (dentro da sidebar)

### Not Found (`not-found.tsx`)
- Usa PitKit `EmptyState` com ícone, título, descrição
- Botão "Voltar ao inicio" com `href="."` (navegação relativa para dashboard do tenant)

### Feedback Visual (OS Actions)
- `WoDetailClient.tsx` exibe banner verde de sucesso após iniciar/finalizar OS
- Banner desaparece automaticamente após 3 segundos (`setTimeout`)
- Estilo `successBanner` em `page.styles.ts`

---

## Navegação (Rotas)

| Rota | Status | Descrição |
|------|--------|-----------|
| `/login` | ✅ Implementado | Login com tenant + email + senha |
| `/t/[slug]` | ✅ Implementado | Dashboard com stats reais |
| `/t/[slug]/minhas-os` | ✅ Implementado | Lista de OS com tabs e cards clicáveis |
| `/t/[slug]/minhas-os/[id]` | ✅ Implementado | Detalhe da OS: info completa + iniciar/finalizar |
| `/t/[slug]/nova-solicitacao` | ✅ Implementado | Formulário para abrir solicitação |
| `/t/[slug]/maquinas` | ✅ Implementado | Consultar máquinas (cards clicáveis, filtro por status) |
| `/t/[slug]/maquinas/[id]` | ✅ Implementado | Detalhe da máquina: info + OS recentes |
| `/t/[slug]/config` | ✅ Implementado | Configurações: perfil, senha, logout |
