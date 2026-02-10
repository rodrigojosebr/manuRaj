# Torque - App Operacional (Mobile-First)

> Particularidades do Torque. Padrões gerais em `CLAUDE.md`, paletas em `STYLES.md`, design system em `PITKIT.md`.

---

## Visão Geral

O **Torque** é o app mobile-first para manutentores e operadores executarem ordens de serviço em campo. Porta 3001.

---

## Arquitetura Server/Client

O Torque segue o padrão de split entre server components (dados) e client components (interação):

```
layout.tsx (server) ──── auth + tenant fetch ──→ TorqueLayoutClient.tsx (client: nav, ads, logout)
page.tsx   (server) ──── stats do MongoDB   ──→ TorqueDashboardClient.tsx (client: render)
minhas-os/page.tsx (server) ── OS do user  ──→ MinhasOsClient.tsx (client: tabs, cards, filtros)
```

- **Server components**: autenticação, `connectDB()`, queries via repository, redirect se não autenticado
- **Client components**: interatividade (forms, nav, logout, links, tabs, filtros)
- **Serialização**: server → client via props (ObjectId → string, Date → ISO string)

---

## Layout Mobile-First

### Header Fixo
- Background: `brand.600` (verde esmeralda)
- Título: `md` (16px), subtítulo: `sm` (14px)
- Mostra: "manuRaj" + nome do usuário + nome do tenant
- Botão de logout à direita (padding: `3`)

### Bottom Navigation (4 itens)
- Início, Minhas OS, Nova OS, Config
- Ícones SVG: **32×32px**
- Nav item: `padding: '3'`, `minWidth: '16'` (64px touch target)
- Label: `fontSize: 'xs'`, `marginTop: '2'`
- `paddingBottom: 'max(16px, env(safe-area-inset-bottom))'`
- Item ativo: `brand.600`, inativo: `gray.500`

### Espaçamento (Content)
- `paddingBottom: '120px'` no conteúdo (compensa nav + safe area)

### Ads
- AdBanner no topo do conteúdo (se `tenant.adsEnabled`)
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
page.tsx                           → import * as S from './page.styles'
page.styles.ts                     → exports de css()
TorqueLayoutClient.tsx             → import * as S from './TorqueLayoutClient.styles'
TorqueLayoutClient.styles.ts       → exports de css()
login/page.tsx                     → import * as S from './page.styles'
login/page.styles.ts               → exports de css()
minhas-os/page.tsx                 → import * as S from './page.styles'  (via MinhasOsClient)
minhas-os/page.styles.ts           → exports de css()
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

## Dashboard (Dados Reais)

O dashboard busca dados do MongoDB via server component:
- `countAssignedByStatus(tenantId, userId, 'assigned')` → OS abertas do usuário
- `countAssignedByStatus(tenantId, userId, 'in_progress')` → OS em andamento
- `countOverdueByAssignee(tenantId, userId)` → OS vencidas

Saudação mostra o nome real: "Olá, {userName}"

---

## Página /minhas-os (Lista de OS)

Arquitetura:
- `page.tsx` (server): auth → `findAssignedToUser(tenantId, userId, { limit: 100 })` → serializa → props
- `MinhasOsClient.tsx` (client): tabs de filtro + lista de cards

**Tabs**: Todas | Atribuídas | Em Andamento | Concluídas (filtro client-side)

**Card de OS** mostra:
- Máquina (nome + código) com ícone 🔧
- Descrição truncada (80 chars)
- Badges: tipo (Corretiva/Preventiva/Solicitação) + prioridade
- Prazo + tempo gasto
- Barra de status colorida (brand.50/orange.50/green.50)
- Borda esquerda 4px colorida por status
- Indicador vermelho para OS vencidas

**Componentes PitKit usados**: `Heading`, `Text`, `Badge`, `getPriorityBadgeVariant`, `EmptyState`
**Formatadores**: `formatDate`, `formatMinutes`, `isOverdue`, `truncate`
**Display names**: `WORK_ORDER_STATUS_DISPLAY`, `WORK_ORDER_TYPE_DISPLAY`, `WORK_ORDER_PRIORITY_DISPLAY`

---

## APIs e Repositories

O Torque usa **repositories direto** nos server components (sem API intermediária):
- `workOrderRepository.findAssignedToUser()` — lista de OS
- `workOrderRepository.countAssignedByStatus()` — stats do dashboard
- `workOrderRepository.countOverdueByAssignee()` — OS vencidas

Para ações que precisam de POST (iniciar/finalizar OS), usa APIs do Pitlane:
- `POST /api/work-orders` (criar solicitação)
- `POST /api/work-orders/[id]/start` (iniciar OS)
- `POST /api/work-orders/[id]/finish` (finalizar OS)

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

## Navegação (Rotas)

| Rota | Status | Descrição |
|------|--------|-----------|
| `/login` | ✅ Implementado | Login com tenant + email + senha |
| `/t/[slug]` | ✅ Implementado | Dashboard com stats reais |
| `/t/[slug]/minhas-os` | ✅ Implementado | Lista de OS com tabs e cards |
| `/t/[slug]/nova-solicitacao` | ❌ Pendente | Abrir nova solicitação |
| `/t/[slug]/maquinas` | ❌ Pendente | Consultar máquinas |
| `/t/[slug]/config` | ❌ Pendente | Configurações do usuário |
