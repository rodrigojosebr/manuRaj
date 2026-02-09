# O Universo do Produto

> *Uma fábrica é uma corrida que nunca termina.*

A pista é a produção.
Os carros são as máquinas.
E cada parada não é "só um problema": é tempo perdido, meta ameaçada, cliente esperando.

Nesse mundo, você não vence com sorte. **Vence com ritual, velocidade e padrão.**

E é exatamente isso que essa família de projetos entrega.

---

## 🏎️ Torque (App) — O piloto do chão de fábrica

> **"Torque resolve."**

O **Torque** é onde a manutenção acontece de verdade.

É o app do cara que chega no equipamento e resolve:
- Recebe a ordem
- Identifica a máquina
- Segue checklist
- Registra evidências
- Troca peça
- Finaliza e devolve a linha pra rodar

O Torque não é "bonito" só por ser bonito. Ele é **rápido, claro e direto**, porque no campo não existe tempo pra adivinhar.

**Torque é o piloto**: mão firme, resposta rápida, foco em voltar pra pista.

### Tecnologia
- App: `apps/torque`
- Stack: Next.js, Mobile-first, PWA-ready
- Porta: 3001
- Paleta: Verde esmeralda (`brand.600: #059669`)
- Tab: "manuRaj Torque - App Operacional"

---

## 🔧 garage-torque (Backend do App) — A oficina que registra tudo

> *Se o Torque é o piloto, o garage-torque é a garagem por trás.*

É ali que:
- Autentica usuário e empresa
- Guarda histórico da máquina
- Versiona checklist
- Salva anexos/fotos
- Dispara notificações
- Garante rastreabilidade (o que foi feito, por quem e quando)

**O piloto resolve. A garagem garante que ficou registrado, auditável e repetível.**

Sem o garage-torque, vira "memória do técnico".
Com ele, vira **histórico de máquina**.

### Tecnologia
- Integrado ao backend do Pitlane (mesmo banco, mesmas APIs)
- Futuro: possível microserviço separado

---

## 🏁 Pitlane (Admin) — O pit stop da gestão

> **"Pitlane decide."**

O **Pitlane** é o painel onde a corrida é decidida.

Não é o lugar do "conserto", é o lugar do **comando**:
- Fila de chamados e prioridade
- SLA e gargalos
- Reincidência (o mesmo carro parando toda hora)
- Indicadores de tempo, causa e custo
- Visão por equipe, setor, planta, empresa

No Pitlane você enxerga a pergunta que muda o jogo:

> *"A gente tá só trocando pneu… ou tá resolvendo a causa?"*

**Pitlane é pit stop**: rápido, cirúrgico, orientado a performance.

### Tecnologia
- App: `apps/pitlane`
- Stack: Next.js, Desktop-first
- Porta: 3000
- Paleta: Azul (`brand.600: #2563eb`)
- Tab: "manuRaj Pitlane - Gestão de Manutenção Industrial"

---

## 🧠 garage-pitlane (Backend do Admin) — O muro de comando

> *O garage-pitlane é o "pit wall" invisível.*

É ele que:
- Aplica regras e permissões
- Organiza cadastros e estruturas
- Calcula indicadores
- Consolida relatórios
- Integra com o resto do mundo (ERP, e-mail, webhook, BI)
- Garante consistência entre empresas (multi-tenant de verdade)

**Pitlane mostra. garage-pitlane governa.**

**Pitlane é o painel. garage-pitlane é o cérebro.**

### Tecnologia
- APIs em: `apps/pitlane/app/api/`
- Libs: `libs/data-access`, `libs/auth`, `libs/domain`
- Database: MongoDB Atlas

---

## 🏪 Showroom (Landing) — A vitrine da equipe

> **"Showroom conquista."**

O **Showroom** é onde o produto deixa de ser "um sistema" e vira algo que dá vontade de usar.

Ele traduz o valor sem jargão:
- O problema (parada custa caro)
- A promessa (voltar a rodar rápido e com histórico)
- A prova (exemplos, telas, casos)
- O convite (testar, falar, entrar)

**Showroom é a lataria polida**: ninguém compra um carro pelo motor só — compra pelo conjunto, pela confiança.

### Tecnologia
- App: `apps/showroom`
- Stack: Next.js, SEO-optimized
- Porta: 3002

---

## 🎫 garage-showroom (Backend da Landing) — O recepcionista

> *Se você quiser ir além de uma landing estática...*

O **garage-showroom** entra como "concierge":
- Captura lead
- Qualifica
- Manda pra CRM
- Dispara e-mails
- Registra campanhas
- Cria trial, convite, onboarding

É o cara do box que pega sua ficha e já te coloca na fila certa.

### Tecnologia
- Futuro: quando precisar de funcionalidades além de landing estática
- Pode usar signup API do Pitlane inicialmente

---

## 📊 garage-data (Dados) — A caixa-preta da operação

> *O garage-data é onde a corrida vira inteligência.*

É a "black box" da fábrica:
- Eventos do campo (criou OS, começou, pausou, finalizou)
- Tempos reais (MTTR, tempo parado, tempo de atendimento)
- Padrões (quais máquinas mais param, quais causas se repetem)
- Previsões e alertas (tendência de falha, peças críticas)

No fim, é o que separa *"a gente apaga incêndio"* de **"a gente melhora o sistema"**.

### Tecnologia
- Futuro: Data warehouse, analytics, ML
- Hoje: Métricas básicas via API `/api/metrics`

---

## 🧰 PitKit (Design System) — O kit do pit stop

> **"O PitKit garante padrão."**

O **PitKit** é a parte mais F1 de todas.

Pit stop funciona porque todo mundo usa o mesmo padrão:
- Ferramenta certa
- Encaixe certo
- Movimento certo
- Sem improviso

O PitKit é isso, só que pra interface:
- **Atomic Design**: Átomos (InputBase, Label) → Moléculas (Field, TextField) → Organismos (Card, Table, Modal)
- Tokens de cor/tipografia/espaçamento
- Padrões de formulário, estados, feedback
- Consistência entre Pitlane, Torque e Showroom

**Resultado**: você monta telas como troca pneus — rápido e sem surpresa.

**PitKit é o kit de pit stop. O resto só corre porque ele existe.**

### Tecnologia
- Lib: `libs/pitkit`
- Import: `@manuraj/pitkit`
- Arquitetura: Atomic Design (atoms, molecules, organisms)
- Stack: PandaCSS + CVA (Class Variance Authority)
- Docs: `PITKIT.md`

---

## Mapa de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                         SHOWROOM                                │
│                    (Landing - Público)                          │
│                     apps/showroom                               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │          SIGNUP/LOGIN         │
            └───────────────┬───────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   │                   ▼
┌───────────────┐           │           ┌───────────────┐
│    PITLANE    │           │           │    TORQUE     │
│    (Admin)    │           │           │    (App)      │
│ Supervisores  │           │           │ Manutentores  │
│ apps/pitlane  │           │           │ apps/torque   │
└───────┬───────┘           │           └───────┬───────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                    ┌───────┴───────┐
                    │   GARAGE-*    │
                    │  (Backend)    │
                    │ libs/data-*   │
                    │ libs/auth     │
                    └───────┬───────┘
                            │
                    ┌───────┴───────┐
                    │   MongoDB     │
                    │    Atlas      │
                    └───────────────┘

        ┌─────────────────────────────────────┐
        │              PITKIT                 │
        │          (Design System)            │
        │           libs/pitkit               │
        │  Usado por: Pitlane, Torque,        │
        │            Showroom                 │
        └─────────────────────────────────────┘
```

---

## Resumo

| Projeto | Tipo | Função | Metáfora | Cor |
|---------|------|--------|----------|-----|
| **Torque** | App | Execução de manutenção | O piloto | Verde esmeralda |
| **Pitlane** | Admin | Gestão e comando | O pit stop | Azul |
| **Showroom** | Landing | Conversão e marketing | A vitrine | A definir |
| **PitKit** | Lib | Design System | O kit de ferramentas | - |
| **garage-*** | Backend | Sustentação | A garagem | - |
| **garage-data** | Analytics | Inteligência | A caixa-preta | - |

---

## A Frase que Resume Tudo

> **Torque resolve. Pitlane decide. Showroom conquista.**
> **A "Garage" sustenta. E o PitKit garante padrão.**

---

*"No fim, é simples: a fábrica não pode parar. E se parar, tem que voltar rápido. Com histórico. Com padrão. Sem improviso."*
