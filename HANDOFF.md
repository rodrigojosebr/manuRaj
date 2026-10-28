# HANDOFF — montar o ambiente do manuRaj em outro PC

> Documento de **setup de máquina**: login do git, variáveis, como rodar, como validar.
> **Não é doc de status** — estado do projeto vive no `CLAUDE.md`, roadmap no `PLANO.md`.
> Última revisão: 27/out/2026.

---

## 1. Estado do git

- **`main` = tronco único.** Não há deploy automático: **o projeto ainda não subiu a lugar nenhum**
  (ver `PLANO.md` §3.3).
- Monorepo **npm workspaces** (`apps/*`, `libs/*`). **Não usa NX** — foi removido em ago/2026.

Conferir se alguma branch tem coisa não mesclada:
```bash
git fetch origin && git branch -a --no-merged main
```

## 2. Login do GitHub no PC novo (é por máquina)

```bash
gh auth login
```
`GitHub.com` → `HTTPS` → `Authenticate Git with your GitHub credentials? Yes` →
`Login with a web browser` → conta **`rodrigojosebr`**.

```bash
git config --global user.name "RAJ - Rodrigo José" && git config --global user.email "rodrigojosebr@gmail.com"
```

> Se o PC já tem outra conta GitHub no keychain, o push dá **"Repository not found"**. Limpar com
> `printf "protocol=https\nhost=github.com\n\n" | git credential-osxkeychain erase` e refazer o login.

## 3. Instalar

```bash
npm install
```

O `postinstall` (`prepare`) roda `panda codegen` automaticamente e gera `styled-system/` na raiz.
**Sem isso não há estilo nenhum.**

## 4. Variáveis de ambiente

Copiar `.env.example` para **`.env.local`** (gitignorado) e preencher. O que é **obrigatório**:

| Var | Como obter |
|---|---|
| `MONGODB_URI` | MongoDB Atlas (M0 free serve): criar cluster → Database Access (usuário+senha) → Network Access (liberar o IP) → Connect → copiar a string |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` em dev |
| `AUTH_TRUST_HOST` | `true` |

Opcional (o app sobe sem, mas a feature não funciona):

| Var | Para quê |
|---|---|
| `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME` | upload de documentos de máquina |
| `CRON_SECRET` | proteger `/api/cron/generate-preventive-orders` |
| `NEXT_PUBLIC_PITLANE_URL` | o Showroom usa para o form de lead e os CTAs de signup |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | botão de WhatsApp do Showroom |
| `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` | anúncios reais (vazio = placeholder) |

### Alternativa sem Atlas: MongoDB local via Docker

```bash
npm run db:up
```
Sobe mongo:7 em `localhost:27017` (admin/admin123) + Mongo Express em `localhost:8081`.
Nesse caso o `MONGODB_URI` é a linha comentada do `.env.example`. Derrubar com `npm run db:down`.

## 5. Popular o banco

```bash
npm run db:seed
```

Cria o tenant demo. **Senha de todos: `demo1234`.**

| Usuário | Papel |
|---|---|
| `admin@demo.com` | Supervisor Geral |
| `supervisor@demo.com` | Supervisor de Manutenção |
| `joao@demo.com`, `pedro@demo.com` | Manutentor |
| `maria@demo.com`, `lucas@demo.com` | Operador |

Diagnosticar conexão: `npm run db:check`

## 6. Rodar

```bash
npm run dev:all
```

| App | Porta | O que é |
|---|---|---|
| Pitlane | 3000 | admin (supervisores) |
| Torque | 3001 | app de campo (mobile/PWA) |
| Showroom | 3002 | landing pública |

Um de cada vez: `npm run dev` (pitlane), `npm run dev:torque`, `npm run dev:showroom`.

## 7. Validar antes de fechar qualquer edição

```bash
npm run test:run && npm run typecheck
```

Esperado: **265 testes passando** (~1,5s) e **0 erro** nos 3 apps.

```bash
npm run build:all
```

> ⚠️ **Nunca use `tsc --noEmit -p tsconfig.json`** na raiz: ela tem `files: []` e **não checa nada** —
> sai verde em 0,6s sem olhar um arquivo. Use sempre `npm run typecheck`.

> ⚠️ **Mexeu em `panda.config.ts`?** Rode `npm run panda:codegen`, senão o estilo não muda.

Testes de integração (precisam de MongoDB acessível):
```bash
npm run test:integration
```

## 8. Armadilhas conhecidas

| Sintoma | Causa | Saída |
|---|---|---|
| `Credenciais inválidas` no login | banco vazio | `npm run db:seed` (senha `demo1234`) |
| Estilos não aplicam | `styled-system/` desatualizado | `npm run panda:codegen` |
| Edge runtime reclama de `crypto` | MongoDB importado no `proxy.ts` | o proxy só pode importar `@manuraj/auth/auth.config` |
| `tsc` passa suspeito de rápido | tsconfig da raiz não checa nada | `npm run typecheck` |
| Next infere workspace root errado | `package-lock.json` órfão numa pasta acima | apagar o lockfile órfão |

## 9. Lembretes de fluxo

- **Git é sempre o Rodrigo quem roda** (branch/commit/push/PR). O Claude só prepara os comandos.
- Segredos (`AUTH_SECRET`, `MONGODB_URI`, chaves AWS) **nunca** no código — só `.env.local` / env var.
- **Toda query filtra por `tenantId`.** Violação = vazamento entre clientes. Os repositories já encapsulam.
- **PitKit obrigatório**: nada de `<button>`/`<input>` cru, nada de `className` no JSX
  (ver dívida conhecida do Pitlane no `CLAUDE.md` §4).
