# manuRaj - Guia de Estilos

> Documento de referência para padrões visuais e de layout do projeto.
> Consultado pelo Claude Code para manter consistência entre sessões.
> Última atualização: 11 de Fevereiro de 2026
>
> 🧰 **Catálogo completo de componentes**: Veja `PITKIT.md` para documentação detalhada do Design System.

---

## 1. Filosofia

- **PandaCSS + CVA** - Toda estilização via `css()` e `cva()` do styled-system
- **PitKit obrigatório** - Usar componentes PitKit em vez de HTML nativo. Se o componente não existir, criar no PitKit primeiro.
- **Design Tokens** - Cores, fontes e espaçamentos via tokens do PandaCSS
- **Sem libs externas de UI** - Nada de Bootstrap, MaterialUI, Tailwind, styled-components
- **Sem inline styles** - Nunca usar `style={}`
- **Sem CSS modules** - Nunca usar `.module.css`

---

## 2. Paletas de Cores por App

Cada app tem sua própria paleta `brand` definida em seu `panda.config.ts`.
Os tokens `success`, `warning`, `danger` e `gray` são compartilhados.

### Pitlane (Azul) - apps/pitlane/panda.config.ts

| Token | Hex | Uso |
|-------|-----|-----|
| `brand.50` | `#eff6ff` | Backgrounds sutis |
| `brand.100` | `#dbeafe` | Subtextos sobre fundo escuro |
| `brand.200` | `#bfdbfe` | Hover em backgrounds claros |
| `brand.300` | `#93c5fd` | Borders, outlines |
| `brand.400` | `#60a5fa` | Ícones secundários |
| `brand.500` | `#3b82f6` | Cor principal (texto, ícones) |
| `brand.600` | `#2563eb` | Botões, links, CTAs |
| `brand.700` | `#1d4ed8` | Backgrounds de painéis, login |
| `brand.800` | `#1e40af` | Backgrounds escuros, decorações |
| `brand.900` | `#1e3a8a` | Texto sobre fundo claro, alto contraste |

### Torque (Verde Esmeralda) - apps/torque/panda.config.ts

| Token | Hex | Uso |
|-------|-----|-----|
| `brand.50` | `#ecfdf5` | Backgrounds sutis |
| `brand.100` | `#d1fae5` | Subtextos sobre fundo escuro |
| `brand.200` | `#a7f3d0` | Hover em backgrounds claros |
| `brand.300` | `#6ee7b7` | Borders, outlines |
| `brand.400` | `#34d399` | Ícones secundários |
| `brand.500` | `#10b981` | Cor principal (texto, ícones) |
| `brand.600` | `#059669` | Botões, links, CTAs |
| `brand.700` | `#047857` | Backgrounds de painéis, login |
| `brand.800` | `#065f46` | Backgrounds escuros, decorações |
| `brand.900` | `#064e3b` | Texto sobre fundo claro, alto contraste |

### Cores Compartilhadas (todos os apps)

| Token | Hex | Uso |
|-------|-----|-----|
| `success.500` | `#22c55e` | Status positivo, badges |
| `success.600` | `#16a34a` | Hover do success |
| `warning.500` | `#f59e0b` | Alertas, atenção |
| `warning.600` | `#d97706` | Hover do warning |
| `danger.500` | `#ef4444` | Erros, exclusão |
| `danger.600` | `#dc2626` | Hover do danger |

### Tokens Semânticos (dark mode ready)

```ts
bg.canvas   // gray.50 (claro) / gray.900 (escuro)
bg.surface  // white / gray.800
bg.subtle   // gray.100 / gray.700
text.primary   // gray.900 / white
text.secondary // gray.600 / gray.400
text.muted     // gray.500 / gray.500
border.default // gray.200 / gray.700
```

---

## 3. Layout de Login (Padrão para todos os apps)

### Estrutura: Split-screen responsivo

```
DESKTOP (lg+):
┌────────────────────┬────────────────────┐
│                    │                    │
│  BRANDING PANEL    │   FORM PANEL       │
│  (50% - brand.700) │   (50% - white)    │
│                    │                    │
│  - Logo manuRaj    │  - Título          │
│  - Subtítulo       │  - Subtítulo       │
│  - Descrição       │  - Input Empresa   │
│  - Features (3)    │  - Input Email     │
│                    │  - Input Senha     │
│  Circulos          │  - Erro (se houver)│
│  decorativos       │  - Botão Entrar    │
│  (brand.600/800    │  - Link signup*    │
│   opacity 0.3)     │                    │
│                    │                    │
└────────────────────┴────────────────────┘

MOBILE (base):
┌────────────────────┐
│  BRANDING PANEL    │
│  (100% - brand.700)│
│  - Logo + subtítulo│
│  - Descrição       │
│  (sem features)    │
├────────────────────┤
│  FORM PANEL        │
│  (100% - white)    │
│  - Título mobile   │
│  - Inputs          │
│  - Botão           │
└────────────────────┘
```

*Link de signup apenas no Pitlane (admin). Torque não tem.

### CSS Principal

```tsx
// Container raiz
flexDirection: { base: 'column', lg: 'row' }

// Branding panel
backgroundColor: 'brand.700'
width: { base: '100%', lg: '50%' }
minHeight: { base: 'auto', lg: '100vh' }
padding: { base: '8', md: '12', lg: '16' }

// Form panel
backgroundColor: 'white'
width: { base: '100%', lg: '50%' }
minHeight: { base: 'auto', lg: '100vh' }
padding: { base: '6', md: '8', lg: '16' }

// Form container
maxWidth: '400px'
gap: '5'
```

### Diferenças por App

| Aspecto | Pitlane | Torque |
|---------|---------|--------|
| Cor do branding panel | Azul (`brand.700`) | Verde (`brand.700`) |
| Subtítulo | "Painel de Gestao" (via metadata) | "App Operacional" (via metadata) |
| Descrição | Gestão de manutenção industrial | App operacional para manutentores |
| Features desktop | Máquinas, OS, Multi-tenant | OS em campo, Celular, Tempo/peças |
| Link signup | Sim ("Cadastre sua empresa") | Não |
| Suspense/callbackUrl | Sim (segurança) | Não necessário |

### Circulos Decorativos

```tsx
// Circulo superior direito
position: absolute, top: -20%, right: -10%
width/height: 400px, borderRadius: full
backgroundColor: brand.600, opacity: 0.3

// Circulo inferior esquerdo
position: absolute, bottom: -15%, left: -10%
width/height: 300px, borderRadius: full
backgroundColor: brand.800, opacity: 0.3
```

---

## 4. Tipografia

### Família de Fontes

```ts
body: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
heading: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
mono: 'ui-monospace, monospace'
```

### Escala de Tamanhos

| Token | Uso Típico |
|-------|------------|
| `xs` | Labels mínimos, badges |
| `sm` | Texto auxiliar, subtítulos, helpers |
| `md` | Texto padrão, parágrafos |
| `lg` | Subtítulos em destaque |
| `xl` | Títulos de seção mobile |
| `2xl` | Títulos de seção desktop |
| `3xl` | Títulos de página mobile, logo mobile |
| `4xl` | Logo tablet |
| `5xl` | Logo desktop |

### Peso da Fonte

| Token | Uso |
|-------|-----|
| `normal` | Texto corrido |
| `medium` | Links, labels com destaque |
| `semibold` | Subtítulos, nomes |
| `bold` | Títulos, headings, logo |

---

## 5. Espaçamento

Usar tokens do PandaCSS (baseados em múltiplos de 4px):

| Token | Valor | Uso Típico |
|-------|-------|------------|
| `1` | 4px | Micro gap entre label e input |
| `2` | 8px | Gap entre itens relacionados |
| `3` | 12px | Padding interno de badges, alertas |
| `4` | 16px | Gap em formulários, padding de cards |
| `5` | 20px | Gap em formulários com mais respiro |
| `6` | 24px | Padding de cards, seções |
| `8` | 32px | Margin entre seções, padding mobile |
| `10` | 40px | Espaçamento entre blocos grandes |
| `12` | 48px | Padding de painéis tablet |
| `16` | 64px | Padding de painéis desktop |

### Tokens Semânticos de Spacing

Definidos em `panda.config.ts` de cada app (valores idênticos):

| Token | Referência | Px | Uso |
|-------|-----------|-----|-----|
| `page` | `spacing.6` | 24px | Padding de página/conteúdo |
| `section` | `spacing.8` | 32px | Margem entre seções |
| `card-padding` | `spacing.6` | 24px | Padding interno de cards |
| `card-gap` | `spacing.5` | 20px | Gap entre cards na lista |
| `field-gap` | `spacing.4` | 16px | Gap entre campos de form |

```tsx
// Uso nos page.styles.ts
export const wrapper = css({ padding: 'page' });
export const grid = css({ gap: 'card-gap' });
export const card = css({ padding: 'card-padding' });
```

---

## 6. Breakpoints Responsivos

| Token | Min-width | Uso |
|-------|-----------|-----|
| `base` | 0px | Mobile (padrão) |
| `sm` | 640px | Mobile grande |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Desktop grande |
| `2xl` | 1536px | Telas ultra-wide |

### Padrão de Uso

```tsx
// Mobile-first: base é o padrão, sobrescreve para maiores
padding: { base: '4', md: '6', lg: '8' }
fontSize: { base: 'sm', lg: 'md' }
display: { base: 'none', lg: 'flex' }
flexDirection: { base: 'column', lg: 'row' }
width: { base: '100%', lg: '50%' }
```

---

## 7. Componentes PitKit - Uso Padrão

> 📖 **Catálogo completo**: Veja `PITKIT.md` para documentação detalhada de todos os componentes.

O PitKit segue **Atomic Design**: Atoms → Molecules → Organisms.

### Button (Átomo)

```tsx
// Primário (ação principal)
<Button size="lg" fullWidth isLoading={loading}>Entrar</Button>

// Secundário
<Button variant="secondary">Cancelar</Button>

// Perigo
<Button variant="danger">Excluir</Button>

// Ghost (sem background)
<Button variant="ghost">Fechar</Button>

// Link (parece texto clicável)
<Button variant="link">Ver mais</Button>
```

### TextField (Molécula) - Substitui antigo Input

```tsx
<TextField
  label="Email"              // Label acima do campo
  type="email"               // Tipo HTML
  placeholder="seu@email"    // Placeholder
  value={value}
  onChange={(e) => set(e.target.value)}
  error="Campo obrigatório"  // Mensagem de erro (opcional)
  helperText="Dica"          // Texto auxiliar (opcional)
  required                   // Obrigatório
/>
```

### Field + InputBase (Abordagem Atômica)

```tsx
<Field label="Email" error={errors.email} required>
  <InputBase type="email" placeholder="seu@email" />
</Field>
```

### Card

```tsx
<Card padding="md">
  <CardHeader>
    <h2>Título</h2>
  </CardHeader>
  <CardContent>
    Conteúdo
  </CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

### Badge

```tsx
<Badge variant="success">Operacional</Badge>
<Badge variant="warning">Em Manutenção</Badge>
<Badge variant="danger">Crítico</Badge>
<Badge variant="info">Planejado</Badge>
<Badge variant="default">Rascunho</Badge>
```

### Table

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Nome</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Torno CNC</TableCell>
      <TableCell><Badge variant="success">Ativo</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>

// Estado vazio
<TableEmpty colSpan={5} message="Nenhum registro encontrado" />
```

### Modal

```tsx
<Modal isOpen={open} onClose={() => setOpen(false)} title="Confirmar" size="md">
  <p>Tem certeza?</p>
  <Button onClick={handleConfirm}>Sim</Button>
</Modal>
```

### Skeleton (Loading)

```tsx
<Skeleton />           // Retângulo genérico
<SkeletonText />       // Linhas de texto
<SkeletonTable />      // Tabela fantasma
```

---

## 8. Padrões de UI

### Estado de Erro em Formulários

```tsx
{error && (
  <div className={css({
    backgroundColor: '#fef2f2',
    border: '1px solid',
    borderColor: '#fecaca',
    borderRadius: 'md',
    padding: '3',
    paddingX: '4',
  })}>
    <p className={css({ color: 'danger.600', fontSize: 'sm', textAlign: 'center' })}>
      {error}
    </p>
  </div>
)}
```

### Estado de Loading em Botões

```tsx
<Button isLoading={loading}>Salvar</Button>
// Mostra spinner automaticamente e desabilita o botão
```

### Links Estilizados

```tsx
<Link
  href="/destino"
  className={css({
    color: 'brand.600',
    fontWeight: 'medium',
    _hover: { textDecoration: 'underline' },
  })}
>
  Texto do link
</Link>
```

### Títulos Responsivos (mobile vs desktop)

```tsx
// Desktop
<div className={css({ display: { base: 'none', lg: 'block' } })}>
  <h2 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'gray.900' })}>
    Título Desktop
  </h2>
</div>

// Mobile
<div className={css({ display: { base: 'block', lg: 'none' } })}>
  <h2 className={css({ fontSize: 'xl', fontWeight: 'bold', color: 'gray.900' })}>
    Título Mobile
  </h2>
</div>
```

---

## 9. Títulos das Abas (Browser Tab)

Cada app identifica-se claramente na aba do browser:

| App | Título da Aba | Arquivo |
|-----|--------------|---------|
| Pitlane | `manuRaj Pitlane - Gestão de Manutenção Industrial` | `apps/pitlane/app/layout.tsx` |
| Torque | `manuRaj Torque - App Operacional` | `apps/torque/app/layout.tsx` |
| Showroom | Definir quando implementar | `apps/showroom/app/layout.tsx` |

### themeColor (barra do browser mobile)

| App | Cor | Hex |
|-----|-----|-----|
| Pitlane | Azul | `#2563eb` (brand.600) |
| Torque | Verde | `#059669` (brand.600) |

---

## 10. global.css por App

### Itens em Comum

```css
@layer reset, base, tokens, recipes, utilities;
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background-color: #f9fafb; color: #111827; min-height: 100vh; }
```

### Torque (mobile-first additions)

```css
touch-action: manipulation;              /* Evita zoom acidental */
input, select, textarea { font-size: 16px; }  /* Evita zoom iOS */
/* Safe area para phones com notch */
@supports (padding: max(0px)) {
  body { padding: env(safe-area-inset-*); }
}
scrollbar-width: 4px;  /* Scrollbar fina */
```

### Focus e Tap Highlight

| App | Focus color | Tap highlight |
|-----|------------|---------------|
| Pitlane | `#3b82f6` (azul) | Padrão do browser |
| Torque | `#10b981` (verde) | `rgba(16, 185, 129, 0.2)` |

---

## 11. Checklist de Estilo para Novas Páginas

1. [ ] Usar componentes PitKit (Button, Input, Select, Card, etc.)
2. [ ] Estilos via `css()` do PandaCSS - nunca inline/modules/Tailwind
3. [ ] Responsive: definir `base` (mobile) + `lg` (desktop) no mínimo
4. [ ] Cores via tokens (`brand.600`, `gray.500`) - nunca hex direto (exceto error/warning bg)
5. [ ] Textos em português brasileiro
6. [ ] Título da aba coerente com o app
7. [ ] Loading states com `<Skeleton>` ou `isLoading` em botões
8. [ ] Error states com o padrão de div vermelha documentado
9. [ ] Testar em mobile e desktop
