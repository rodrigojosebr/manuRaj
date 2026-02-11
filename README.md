# manuRaj

Sistema de gestao de manutencao industrial (CMMS) multi-tenant, construido com Next.js 16 em monorepo NX.

> *"Uma fabrica e uma corrida que nunca termina."*

---

## O Projeto

manuRaj permite que empresas gerenciem:

- **Maquinas e equipamentos** - cadastro, status, documentos tecnicos
- **Ordens de servico** - corretivas, preventivas e solicitacoes
- **Planos preventivos** - checklists com periodicidade automatica
- **Equipes** - controle de acesso por cargo (RBAC com 5 niveis)
- **Multi-tenant** - cada empresa tem seus dados isolados

### Arquitetura (Universo F1)

| App | Porta | Descricao |
|-----|-------|-----------|
| **Pitlane** | 3000 | Painel administrativo (supervisores) |
| **Torque** | 3001 | App operacional mobile-first (manutentores) |
| **Showroom** | 3002 | Landing page publica |

| Lib | Pacote | Descricao |
|-----|--------|-----------|
| **PitKit** | `@manuraj/pitkit` | Design System Atomic Design (atoms, molecules, organisms) |
| **Domain** | `@manuraj/domain` | Tipos, schemas Zod, constantes, permissoes RBAC |
| **Data Access** | `@manuraj/data-access` | Models Mongoose + repositories |
| **Auth** | `@manuraj/auth` | NextAuth v5, guards, helpers de response |
| **Shared Utils** | `@manuraj/shared-utils` | API client, formatadores (data, tempo, arquivo) |
| **Ads** | `@manuraj/ads` | Componentes Google AdSense |
| **Config** | `@manuraj/config` | Configuracoes de ambiente tipadas |

> Leia `UNIVERSE.md` para a narrativa completa do universo F1 do produto.

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Monorepo | NX 22 |
| Frontend | Next.js 16, React 19 |
| Estilizacao | PandaCSS + CVA |
| Auth | NextAuth v5 (Credentials + JWT) |
| Validacao | Zod 4 |
| Database | MongoDB Atlas + Mongoose 9 |
| Storage | AWS S3 (presigned URLs) |
| Testes | Vitest 4 |
| Linguagem | TypeScript 5.9 (strict) |

---

## Setup Rapido

### Pre-requisitos

- Node.js 20+
- npm 10+
- Conta no [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier funciona)

### 1. Clonar e instalar

```bash
git clone https://github.com/rodrigojosebr/manuRaj.git
cd manuRaj
npm install
```

### 2. Configurar variaveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com seus dados:

```env
# Obrigatorio - MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/manuraj?retryWrites=true&w=majority

# Obrigatorio - Gerar com: openssl rand -base64 32
AUTH_SECRET=sua-chave-secreta

# Opcional - Para upload de documentos
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=manuraj-documents
```

### 3. Popular o banco com dados demo

```bash
MONGODB_URI='sua_connection_string' npx tsx scripts/seed.ts
```

Isso cria:
- 1 tenant (Industria Demo Ltda, slug: `demo`)
- 6 usuarios (todos com senha `demo1234`)
- 7 maquinas
- 7 ordens de servico
- 5 planos preventivos

### 4. Rodar

```bash
npm run dev          # Pitlane em http://localhost:3000
```

Acesse `/login` com:
- **Tenant**: `demo`
- **Email**: `admin@demo.com`
- **Senha**: `demo1234`

---

## Scripts

### Desenvolvimento

```bash
npm run dev              # Pitlane (porta 3000)
npm run dev:torque       # Torque (porta 3001)
npm run dev:showroom     # Showroom (porta 3002)
npm run dev:all          # 3 apps em paralelo
npm run dev:apps         # Pitlane + Torque
```

### Build e Producao

```bash
npm run build            # Build Pitlane
npm run build:all        # Build todos
npm run start            # Start Pitlane em producao
```

### Testes

```bash
npm run test             # Watch mode
npm run test:run         # Roda uma vez (175 testes, ~1s)
npm run test:coverage    # Com relatorio de cobertura
```

### Banco de Dados

```bash
npm run db:seed          # Popular com dados demo
npm run db:check         # Diagnostico de conexao
npm run db:up            # MongoDB local via Docker (opcional)
npm run db:down          # Parar MongoDB local
```

### Outros

```bash
npm run lint             # Lint
npm run lint:all         # Lint em todos os projetos
npm run panda:codegen    # Regenerar styled-system (PandaCSS)
```

---

## Usuarios Demo

Apos rodar o seed, estes usuarios estao disponiveis (senha: `demo1234`):

| Email | Cargo | Acesso |
|-------|-------|--------|
| `admin@demo.com` | Supervisor Geral | Acesso total |
| `supervisor@demo.com` | Supervisor Manutencao | Gerencia OS, equipe, maquinas |
| `joao@demo.com` | Manutentor | Executa OS atribuidas |
| `pedro@demo.com` | Manutentor | Executa OS atribuidas |
| `maria@demo.com` | Operador | Visualiza maquinas, abre solicitacoes |
| `lucas@demo.com` | Operador | Visualiza maquinas, abre solicitacoes |

---

## Estrutura do Monorepo

```
manuRaj/
├── apps/
│   ├── pitlane/          # Admin (Next.js, porta 3000)
│   ├── torque/           # App campo (Next.js, porta 3001)
│   └── showroom/         # Landing (Next.js, porta 3002)
├── libs/
│   ├── domain/           # Tipos, schemas, permissoes
│   ├── data-access/      # Models + repositories MongoDB
│   ├── auth/             # NextAuth + guards
│   ├── pitkit/           # Design System (atoms → molecules → organisms)
│   ├── shared-utils/     # API client, formatadores
│   ├── ads/              # Google AdSense
│   └── config/           # Configuracoes
├── tests/                # Testes unitarios e integracao
├── scripts/              # Seed, diagnosticos
├── CLAUDE.md             # Documentacao tecnica detalhada (contexto AI)
├── UNIVERSE.md           # Narrativa de produto (universo F1)
└── .env.example          # Template de variaveis de ambiente
```

---

## API Endpoints

Todas as APIs ficam em `apps/pitlane/app/api/`:

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | `/api/auth/[...nextauth]` | Autenticacao NextAuth |
| POST | `/api/signup` | Cadastro de empresa |
| GET | `/api/metrics` | Dashboard (totais, overdue) |
| GET/POST | `/api/machines` | Listar/criar maquinas |
| GET/PATCH/DELETE | `/api/machines/[id]` | Detalhe/editar/remover maquina |
| GET/POST | `/api/machines/[id]/documents` | Documentos da maquina |
| GET/POST | `/api/work-orders` | Listar/criar ordens |
| GET/PATCH/DELETE | `/api/work-orders/[id]` | Detalhe/editar/remover ordem |
| POST | `/api/work-orders/[id]/assign` | Atribuir manutentor |
| POST | `/api/work-orders/[id]/start` | Iniciar OS |
| POST | `/api/work-orders/[id]/finish` | Finalizar OS |
| GET/POST | `/api/preventive-plans` | Listar/criar planos |
| GET/PATCH/DELETE | `/api/preventive-plans/[id]` | Detalhe/editar/remover plano |
| GET/POST | `/api/users` | Listar/criar usuarios |
| GET/PATCH/DELETE | `/api/users/[id]` | Detalhe/editar/remover usuario |

Todas as rotas exigem autenticacao e respeitam isolamento multi-tenant.

---

## Permissoes (RBAC)

5 niveis hierarquicos:

| Cargo | Pode fazer |
|-------|------------|
| **Operador** | Ver maquinas, abrir solicitacoes |
| **Manutentor** | + Executar OS, registrar tempo/pecas |
| **Sup. Manutencao** | + Gerenciar OS, equipe, maquinas |
| **Sup. Geral** | + Acesso total ao tenant, metricas |
| **Super Admin** | + Acesso a todos os tenants |

---

## Documentacao Adicional

| Arquivo | Conteudo |
|---------|----------|
| `CLAUDE.md` | Documentacao tecnica (regras, convencoes, estado atual, troubleshooting) |
| `TORQUE.md` | App operacional mobile-first (sidebar, paginas, PWA, server actions) |
| `PITKIT.md` | Catalogo do Design System (Atomic Design, componentes, exemplos de uso) |
| `STYLES.md` | Guia de estilos (paletas, layouts, tipografia, spacing tokens) |
| `UNIVERSE.md` | Narrativa de produto, metafora F1, visao de cada app |
| `.env.example` | Todas as variaveis de ambiente com explicacoes |

---

## Licenca

MIT
