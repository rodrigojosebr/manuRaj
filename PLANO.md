# PLANO.md — manuRaj

> **Roadmap e decisões.** O que falta, em que ordem, e o que já foi decidido e por quê.
> **Não é** estado atual (isso é `CLAUDE.md` §13) nem plano de infra (isso é `INFRA.md`).
> Última revisão: **28/ago/2026** — após varredura completa do repo.

---

## 1. O que a varredura de 28/ago/2026 encontrou

Verificado rodando, não lendo doc:

| Frente | Situação |
|---|---|
| Testes | 265 unitários passando em 1,57s (8 arquivos) |
| Typecheck real (por app) | 0 erros nos 3 apps |
| `TODO`/`FIXME`/`HACK` no código | **zero** |
| Segredos | `.env.local` ignorado, nada sensível rastreado |
| Torque / Showroom | **100% no padrão** `styled()` — 0 `className`, 20 arquivos `.styles.ts` |
| **Pitlane** | **0% migrado** — 261 `className`, 12 arquivos com `{ css }`, 0 `.styles.ts` |
| `INFRA.md` | bem mantido, fiel à realidade |
| `CLAUDE.md` | estava 5 meses defasado — **sincronizado nesta revisão** |

### A descoberta que explica o resto: o Pitlane é de outra geração

O projeto tem **duas arquiteturas** convivendo, e isso não está errado — está **não documentado**:

| | Pitlane (geração 1) | Torque / Showroom (geração 2) |
|---|---|---|
| Componentes | `'use client'` (14 arquivos) | Server components + `*Client.tsx` |
| Dados | `fetch` no cliente → API routes | Repository no servidor |
| Mutations | API routes (21, com OpenAPI) | Server Actions |
| Estilo | `css()` + `className` | `styled()` + `page.styles.ts` |
| Erros | `console.error` no navegador | Pino no servidor |

O commit `65274c7` migrou **PitKit e Torque** para `styled()` e **não voltou pro Pitlane**. É essa a
dívida real do projeto — não é bug, é padrão declarado e não cumprido em 1 dos 3 apps.

---

## 2. Escada kaizen

Ordenada por **risco crescente**. Cada degrau fecha sozinho, com validação própria.

### ✅ Degrau 1 — Ferramental honesto *(feito em 28/ago/2026)*

- `npm run typecheck` criado (+ `:pitlane`, `:torque`, `:showroom`).
  **Motivo:** `tsc --noEmit -p tsconfig.json` na raiz saía **0 em 0,6s sem checar nada**
  (`files: []` + `references`). Dava verde falso a quem rodasse o comando óbvio.
- `packages/*` removido de `workspaces` — a pasta está vazia, era config morta.
- Pino silenciado nos testes (`env: { LOG_LEVEL: 'silent' }` nos 2 configs do vitest) — vazava
  `{"level":50,...,"msg":"Unhandled API error"}` na saída limpa.

### ✅ Degrau 2 — Doc sincronizado *(feito em 28/ago/2026)*

`CLAUDE.md` passou a refletir a realidade: Pino, AuditLog, OpenAPI/Swagger, `/api/health`,
`/api/metrics`, cron de preventivas, PWA do Torque, 21 API routes (dizia 17), Showroom no estado
real, e a **dívida do Pitlane declarada em vez de escondida**.

### 🔨 Degrau 3 — Pitlane no padrão `styled()` *(o grande — uma página por sessão)*

12 arquivos, ~261 `className`, 12 imports de `{ css }`. **Não fazer de uma vez.** Uma página por
sessão, cada uma virando seu `page.styles.ts`, com typecheck no fim.

Ordem sugerida — da mais isolada para a mais acoplada:

| # | Arquivo | Por que nesta posição |
|---|---|---|
| ~~1~~ | ~~`app/login/page.tsx`~~ | ✅ **feito 27/out/2026** — 352 → 149 linhas + `page.styles.ts` (207). Padrão de referência para as outras |
| 2 | `app/signup/page.tsx` | irmã do login, mesmo formato |
| 3 | `app/page.tsx` | landing interna, sem dados |
| 4 | `t/[tenantSlug]/TenantLayoutClient.tsx` | layout — também tem 2 `<button>` cru a trocar por PitKit |
| 5 | `(dashboard)/DashboardClient.tsx` | muitos cards |
| 6-7 | `machines/page.tsx` + `machines/[id]/page.tsx` | lista + detalhe juntos, mesmo domínio |
| 8-9 | `work-orders/page.tsx` + `work-orders/[id]/page.tsx` | idem |
| 10-11 | `preventive-plans/page.tsx` + `[id]/page.tsx` | idem |
| 12 | `admin/users/page.tsx` | última, mexe em RBAC |

**Definição de pronto por página:** 0 `className`, 0 import de `{ css }`, um `page.styles.ts` com
`styled()`, `npm run typecheck` limpo, e conferência visual no navegador antes de fechar.

### 🧹 Degrau 4 — Kaizen miúdo (a qualquer momento, entre degraus)

- [ ] **`npm install` de novo** — o build avisou `Found lockfile missing swc dependencies, patching...`
      e pediu reinstalação pra baixar `@next/swc`. Sobrou da remoção do NX.
- [ ] **59 vulnerabilidades** (6 críticas, 24 altas) reportadas no `npm install` pós-remoção do NX.
      Rodar `npm audit` e avaliar — **não** rodar `npm audit fix --force` no escuro (quebra major).
- [ ] `⚠ TypeScript project references are not fully supported` em todo build: vem do `tsconfig.json`
      da raiz (`files: []` + `references`, herança da feature `sync` do NX). Hoje esse arquivo não
      serve pra nada além de gerar o aviso e o verde falso do `tsc` — avaliar remover as `references`.
- [x] `logger.info('NextAuth initialized')` → `debug`: era 17 linhas de ruído por build (1 por worker).
- [ ] `npx update-browserslist-db@latest` — `caniuse-lite` está 7 meses velho e avisa em todo teste.
- ~1 GB de `.next` local somando os 3 apps — limpar quando incomodar.
- `libs/ads` (4 arquivos) ainda usa `css()` — entra junto com o Degrau 3 ou depois dele.

---

## 3. Decisões pendentes

### 3.1 NX — ✅ **DECIDIDO: saiu (28/ago/2026)**

Existe uma **meia-migração não commitada** desde 22/jul/2026: os scripts `dev*` foram trocados de
`nx dev` para `next dev`, mas `start`, `start:torque`, `lint` e `lint:all` **continuam em `nx`**.

O NX já era problema conhecido antes: `build:*` usa `node_modules/.bin/next build` justamente para
**contornar um bug do plugin NX com Next.js 16** (`CLAUDE.md` §11).

**NX não é o que faz o monorepo funcionar.** Isso é npm workspaces (`["apps/*","libs/*"]`),
os `paths` do `tsconfig.base.json`, o `transpilePackages` dos `next.config.js` e os aliases do
vitest — nenhum deles é NX. Sair do NX **não** desmonta o monorepo.

O que o NX faz aqui hoje, medido:

| Comando | Usa NX? |
|---|---|
| `build`, `build:all` | ❌ `node_modules/.bin/next build` — já foge do NX (bug do plugin com Next 16) |
| `dev*` | ❌ virou `next dev` no diff pendente |
| `test*`, `typecheck` | ❌ vitest e tsc direto |
| `start`, `lint` | ✅ só esses dois |

Além disso o plugin `@nx/js/typescript` no `nx.json` está configurado para `tsconfig.lib.json` e
**as libs não têm tsconfig nenhum** — não infere nada útil.

⚠️ **Acoplamento a considerar:** os **3 `next.config.js` usam `composePlugins(withNx)`**, então até o
`next build` "sem NX" carrega `@nx/next` ao ler a config. Sair do NX inclui mexer nesses 3 arquivos,
não só apagar o `nx.json`. Nos três, o `transpilePackages` já está declarado explicitamente (recurso
nativo do Next), então o `withNx` entrega pouco — mas isso **exige um build pra confirmar**.

Três caminhos:

| Opção | Trabalho | Ganho | Risco |
|---|---|---|---|
| **Sair do NX** | scripts `start`/`lint` + 3 `next.config.js` + remover `nx.json` e `@nx/*` | uma camada a menos, fim do workaround de build | build pode quebrar se o `withNx` fazia algo |
| **Voltar pro NX de verdade** | descartar o diff pendente, resolver o bug do plugin com Next 16, dar tsconfig às libs | cache e grafo funcionando | depende da compatibilidade do plugin com Next 16 |
| **Congelar** | commitar como está | zero | dois jeitos de rodar cada coisa, indefinidamente |

**O pior cenário é o atual: NX pela metade** — paga-se a camada sem usar o benefício.

**Decisão tomada: saiu.** Com 3 apps o cache não pagava uma camada que já obrigou workaround no
build — e o deploy na Vercel pede build Next puro.

### O que foi feito na saída (28/ago/2026)

| Alvo | Antes | Depois |
|---|---|---|
| 3 `next.config.js` | `composePlugins(withNx)(nextConfig)` + chave `nx: {}` | `module.exports = nextConfig`, tipo `import('next').NextConfig` |
| `start`, `start:torque` | `nx start <app>` | `next start apps/<app> -p <porta>` |
| `start:showroom` | buildava antes de iniciar (inconsistente) | `next start apps/showroom -p 3002`, igual aos outros |
| `build*` | `node_modules/.bin/next build` (workaround do plugin) | `next build apps/<app>` |
| `lint`, `lint:all` | `nx lint` / `nx run-many` | **removidos** — ver abaixo |
| `nx.json` | 2 plugins inferindo targets | apagado |
| deps | `nx`, `@nx/js`, `@nx/next`, `@nx/react` | removidas do `package.json` |
| `.prettierignore` | ignorava `/.nx/*` | linhas removidas |

`transpilePackages`, `serverExternalPackages`, `paths` do tsconfig e aliases do vitest **não foram
tocados** — o monorepo continua igual.

⚠️ **Lint não existe neste repo.** `next lint` foi **removido no Next 16** (não há `next-lint.js` no
CLI do 16.1.6) e **não existe nenhuma config de eslint** no projeto (`nx.json` gerava apps com
`linter: "none"`). O `npm run lint` era decorativo: não lintava nada. Foram removidos em vez de
mantidos mentindo. **Ter lint de verdade é tarefa separada** (escolher flat config do eslint 9 +
`eslint-config-next`), registrada aqui e não feita de brinde.

### Validação obrigatória desta mudança

O `withNx` era o único acoplamento restante ao NX. Ele **precisa** de um build pra confirmar que não
fazia nada essencial:

```bash
npm install && npm run build:all && npm run test:run && npm run typecheck
```

Se o build quebrar, o reverte é `git checkout -- . && git clean -fd` (nada foi commitado).

### 3.1.1 Sanitização pós-NX (28/ago/2026)

**7 dependências removidas** — nenhuma referenciada em 207 arquivos-fonte varridos:

| Removida | Por quê |
|---|---|
| `@swc/core`, `@swc/cli`, `@swc/helpers`, `@swc-node/register` | eram do build de libs do NX; o Next usa `@next/swc` próprio |
| `@vitejs/plugin-react` | nenhum config do vitest usa `plugins` (testes são `environment: 'node'`) |
| `@types/bcryptjs` | `bcryptjs` 3.x traz tipos próprios (`index.d.ts`) |
| `@types/uuid` | `uuid` 13.x traz tipos próprios |

**Mantidas de propósito** (não aparecem em `import`, mas são usadas — **não remover**):
`tslib` (`importHelpers: true` no `tsconfig.base.json`) · `tsx` (`db:seed`/`db:check`) ·
`@vitest/coverage-v8` (`test:coverage`) · `@types/swagger-ui-react` (a lib não tem tipos próprios) ·
`prettier`, `typescript`, `@types/node`, `@types/react`, `@types/react-dom`.

**Bug latente corrigido: o alias fantasma `@manuraj/ui`.** Não era o nome de nenhum pacote (a lib
chama-se `@manuraj/pitkit`) e estava no `transpilePackages` do pitlane e do torque — o PitKit **não
estava listado para transpilação nesses dois apps**. Buildava porque o código importa via `@pitkit`,
que os `paths` do tsconfig resolvem direto pro fonte. Corrigido para `@manuraj/pitkit`; o alias morto
saiu do `tsconfig.base.json`, dos 2 configs do vitest e do tsconfig do pitlane. Restaram dois caminhos
válidos para a mesma lib: **`@pitkit`** (36 usos, atalho do tsconfig) e **`@manuraj/pitkit`** (nome
real do pacote, usado no `transpilePackages`).

### 3.1.2 Sanitização ainda aberta

- [x] **`HANDOFF.md`** criado em 27/out/2026 — env vars obrigatórias x opcionais, Atlas e Docker,
      seed com os 6 usuários demo, validação e armadilhas conhecidas.
- [ ] **Restos do NX nos `tsconfig.json` dos 3 apps**: `include` de `../../dist/apps/<app>/.next/types`
      (output do NX, não existe mais), `exclude` de `out-tsc`, `jest.config.ts` e `jest.config.cts`
      (**não há jest no projeto**). Cosmético — mexer em `include` pede rebuild pra validar.
- [ ] **`tsconfig.json` da raiz** (`files: []` + `references`): herança do `sync` do NX. Só serve pra
      gerar o aviso `project references are not fully supported` em todo build e o verde falso do `tsc`.
- [ ] **Pastas vazias**: `apps/pitlane/app/api/hello` (scaffold), `apps/showroom/public` e
      `.../machines/[id]/documents` (a API de documentos existe, a página não — decidir se é feature
      abandonada ou pendente). Git não rastreia pasta vazia: é sujeira local, não do repo.

---


### 3.2 O que NÃO fazer — falsos positivos já investigados

Registrado para ninguém "consertar" o que está certo:

- **Brand por app funciona.** Os 4 `panda.config.ts` escrevem no mesmo `styled-system/`, o que
  *parece* colisão — mas o CSS real é gerado por app via PostCSS. Conferido no CSS compilado:
  Torque `#059669` (verde), Pitlane `#2563eb` (azul). Ninguém usa `token()` em runtime.
- **`console.error` no Pitlane está correto.** Os 17 casos estão todos em arquivos `'use client'`
  — são logs de navegador. Pino é server-side; migrar pioraria. O escopo do Pino era
  "auth, DB, cron, guards" e foi cumprido.
- **Os 19 `className` do PitKit não são violação.** São `className={className}`, repasse de prop —
  a API legítima de um design system.
- **API routes do Pitlane não são legado a eliminar.** Têm OpenAPI publicado em `/docs`: são
  superfície de produto. A arquitetura cliente→API do Pitlane é coerente com isso.

---

### 3.3 Deploy — **o projeto nunca subiu** 🚨

Constatado em 28/ago/2026: **não existe `.vercel/`, não existe `vercel.json`, e nenhum dos 7 docs
menciona Vercel.** O `.env.example` só tem `NEXTAUTH_URL=http://localhost:3000`. O app roda apenas na
máquina do Rodrigo, com MongoDB Atlas na nuvem.

Um CMMS multi-tenant com 265 testes, RBAC de 5 níveis, audit log e OpenAPI que nunca saiu do
`localhost`. **Isso é a maior lacuna do projeto — maior que a dívida de estilo do Pitlane.**

### Como fica (independe da decisão do NX)

3 apps Next = **3 projetos na Vercel**, todos apontando pro mesmo repo e commit:

| Projeto | Root Directory | Papel |
|---|---|---|
| `manuraj-showroom` | `apps/showroom` | domínio raiz, vitrine pública |
| `manuraj-pitlane` | `apps/pitlane` | admin (supervisores) |
| `manuraj-torque` | `apps/torque` | app de campo (PWA) |

A Vercel entende npm workspaces: instala da raiz, builda a partir do Root Directory. Um deploy único
não é possível — são três servidores Next com domínios e sessões próprios. A integração entre eles é
por link (o Showroom já manda signup e lead pro Pitlane).

### Decisão (28/ago/2026): sem domínio, vai de `*.vercel.app`

Não há domínio hoje. Sobe em `manuraj-showroom.vercel.app` / `-pitlane` / `-torque` e o domínio
próprio entra quando existir. **A troca depois é barata**, mas não é grátis:

- `NEXTAUTH_URL` e `NEXT_PUBLIC_APP_URL` são **env vars**, não código — mudam no painel da Vercel.
- ⚠️ Mas `NEXT_PUBLIC_APP_URL` está dentro de `env: {}` nos `next.config.js`, então é **inlinado no
  build**: trocar de domínio exige **redeploy**, não só editar a env var.
- O `NEXTAUTH_URL` errado quebra o login de forma silenciosa (redirect pro domínio velho) — é o
  primeiro suspeito se o login parar de funcionar depois de mexer em domínio.

### O que precisa antes do primeiro deploy

- [ ] Env vars por projeto na Vercel: `MONGODB_URI`, `AUTH_SECRET`, `NEXTAUTH_URL` (**um por app**),
      `AUTH_TRUST_HOST`, AWS S3 (4), `NEXT_PUBLIC_APP_URL`, `CRON_SECRET`, flags de signup/ads
- [ ] Allowlist do MongoDB Atlas liberando os IPs da Vercel
- [x] **`apps/pitlane/vercel.json`** com o cron diário às 09:00 UTC (06:00 BRT). ⚠️ **A rota estava
      quebrada para cron**: o Vercel Cron dispara **GET** e ela só tinha `POST` — nunca teria rodado.
      Corrigida em 27/out/2026 para exportar `GET` e `POST` no mesmo handler, com `maxDuration = 60`.
      Falta só definir `CRON_SECRET` na Vercel (ela injeta o header `Authorization: Bearer` sozinha).
- [x] `NEXT_PUBLIC_WHATSAPP_NUMBER` = `5511954278210`
- [ ] Rate limiting (`INFRA.md` 2.1) — sai de "antes de escala" e passa a ser **antes de expor**
- [x] ~~Confirmar que o `withNx` builda na Vercel~~ — NX removido, build é Next puro

**Ordem — corrigida em 27/out/2026.** O Showroom **não é independente**: consome
`NEXT_PUBLIC_PITLANE_URL` (o `ContactForm` faz `POST ${PITLANE_URL}/api/lead`) e os CTAs de signup
apontam para o Pitlane. Subir só ele deixa form e botões caindo no fallback `localhost:3000`.

1. **Showroom** — como **teste de pipeline**, não lançamento. Root Directory `apps/showroom`, sem banco
   e sem auth. Risco zero, valida build e domínio.
2. **Pitlane** — é o que destrava o Showroom de verdade. Root Directory `apps/pitlane`. Precisa de
   todas as env vars, allowlist do Atlas e `CRON_SECRET`.
3. Voltar no Showroom e apontar `NEXT_PUBLIC_PITLANE_URL` para a URL real do Pitlane. **Exige
   redeploy** — a var é `NEXT_PUBLIC_*` e fica inlinada no build.
4. **Torque** — Root Directory `apps/torque`, mesmas env vars do Pitlane com `NEXTAUTH_URL` próprio.

---

## 4. Dívida técnica de infra

Mora em `INFRA.md` e **não se duplica aqui**. Aberto hoje:

- **2.1 Rate limiting** — `/api/auth` e `/api/signup` contra brute force. Requer escolher stack.
- **2.3 CSRF** — risco baixo hoje (SameSite + Server Actions). Reavaliar se abrir API pública.

Ambos são "antes de produção com escala", não kaizen.

---

## 5. Roadmap de produto

### Showroom — **feito, marcar como feito**
- [x] Formulário de contato / lead capture (`ContactForm` + `/api/lead`)
- [x] Fluxo de signup → tenant → Pitlane (`/api/signup`)

### Pitlane — próximas features
- [ ] Dashboard com gráficos visuais
- [ ] Notificações (OS atribuída / alterada)
- [ ] Exportação de relatórios (PDF / Excel)

### Torque — polido (~100%)
Nada aberto. Mexer só se aparecer feedback de campo.

---

## 6. Como validar (comandos que o Rodrigo roda)

```bash
npm run test:run && npm run typecheck
```

Esperado: **265 testes passando** e **0 erro** nos 3 apps.
