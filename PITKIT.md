# PitKit - Design System

> *"O kit de pit stop. O resto só corre porque ele existe."*
>
> Última atualização: 05 de Fevereiro de 2026

---

## 1. Filosofia

O PitKit segue **Atomic Design** - metodologia que organiza componentes em níveis de complexidade crescente:

| Nível | Descrição | Exemplo |
|-------|-----------|---------|
| **Atoms** | Elementos indivisíveis, a menor unidade de UI | `Button`, `InputBase`, `Label`, `Badge` |
| **Molecules** | Combinação de átomos que formam um componente funcional | `Field`, `TextField`, `SelectField` |
| **Organisms** | Combinação de moléculas/átomos que formam uma seção completa | `Card`, `Table`, `Modal` |

### Regras de Ouro

1. **PitKit obrigatório** - NUNCA usar `<button>`, `<input>`, `<select>` HTML diretamente
2. **Sem libs externas** - NADA de Bootstrap, MaterialUI, Tailwind, styled-components
3. **PandaCSS + CVA** - Toda estilização via `css()` e `cva()` com design tokens
4. **Variants tipadas** - Props de customização sempre via variants do CVA
5. **Genérico > Específico** - Componentes reutilizáveis, não específicos de página

---

## 2. Estrutura de Arquivos

```
libs/pitkit/src/
├── atoms/                      # Elementos indivisíveis
│   ├── index.ts
│   ├── Button.tsx              # Botão (variant, size, fullWidth, isLoading)
│   ├── Badge.tsx               # Tag de status (variant)
│   ├── Heading.tsx             # Títulos h1-h6 (as, color)
│   ├── Text.tsx                # Parágrafos (size, color, weight)
│   ├── Icon.tsx                # Wrapper para emojis/svg (size, variant)
│   ├── Label.tsx               # Label de formulário (size, required)
│   ├── HelperText.tsx          # Texto de ajuda/erro (variant)
│   ├── InputBase.tsx           # Input puro (size, state)
│   ├── TextareaBase.tsx        # Textarea puro (size, state)
│   ├── SelectBase.tsx          # Select puro (size, state, children)
│   ├── Spinner.tsx             # Loading spinner (size)
│   └── Skeleton.tsx            # Loading placeholder
│
├── molecules/                  # Combinação de átomos
│   ├── index.ts
│   ├── Field.tsx               # Wrapper: Label + children + HelperText
│   ├── TextField.tsx           # Field + InputBase (convenience)
│   ├── SelectField.tsx         # Field + SelectBase + options
│   └── TextareaField.tsx       # Field + TextareaBase
│
├── organisms/                  # Componentes complexos
│   ├── index.ts
│   ├── Card.tsx                # Container (CardHeader, CardContent, CardFooter)
│   ├── Table.tsx               # Tabela completa (TableHeader, TableBody, etc.)
│   └── Modal.tsx               # Dialog modal (isOpen, onClose, title, size)
│
└── index.ts                    # Re-exports + aliases de compatibilidade
```

---

## 3. Catálogo de Componentes

### 3.1 Atoms (Átomos)

#### Button
```tsx
import { Button } from '@pitkit';

<Button variant="primary" size="md">Salvar</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="danger" size="sm">Excluir</Button>
<Button variant="ghost">Fechar</Button>
<Button variant="link">Ver mais</Button>
<Button fullWidth isLoading>Processando...</Button>
```

| Prop | Valores | Default | Descrição |
|------|---------|---------|-----------|
| `variant` | `primary`, `secondary`, `danger`, `ghost`, `link` | `primary` | Estilo visual |
| `size` | `sm`, `md`, `lg` | `md` | Tamanho |
| `fullWidth` | `boolean` | `false` | Ocupar largura total |
| `isLoading` | `boolean` | `false` | Mostrar spinner e desabilitar |

#### Badge
```tsx
import { Badge } from '@pitkit';

<Badge variant="success">Operacional</Badge>
<Badge variant="warning">Em Manutenção</Badge>
<Badge variant="danger">Crítico</Badge>
<Badge variant="info">Planejado</Badge>
<Badge variant="default">Rascunho</Badge>
```

| Prop | Valores | Default |
|------|---------|---------|
| `variant` | `default`, `success`, `warning`, `danger`, `info` | `default` |

#### Heading
```tsx
import { Heading } from '@pitkit';

<Heading as="h1">Título Principal</Heading>
<Heading as="h2" color="brand">Subtítulo</Heading>
<Heading as="h3" color="muted">Seção</Heading>
```

| Prop | Valores | Default |
|------|---------|---------|
| `as` | `h1`, `h2`, `h3`, `h4`, `h5`, `h6` | `h2` |
| `color` | `default`, `white`, `muted`, `brand` | `default` |

#### Text
```tsx
import { Text } from '@pitkit';

<Text>Texto padrão</Text>
<Text size="lg" weight="semibold">Destaque</Text>
<Text size="sm" color="muted">Texto auxiliar</Text>
<Text as="span" color="light">Texto em fundo escuro</Text>
```

| Prop | Valores | Default |
|------|---------|---------|
| `as` | `p`, `span` | `p` |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | `md` |
| `color` | `default`, `muted`, `light`, `white`, `subtle` | `default` |
| `weight` | `normal`, `medium`, `semibold` | `normal` |

#### Icon
```tsx
import { Icon } from '@pitkit';

<Icon emoji="⚙️" size="lg" />
<Icon emoji="📋" size="md" variant="rounded" bg="#eff6ff" />
<Icon size="xl" variant="circle" bg="brand.600">🔧</Icon>
```

| Prop | Valores | Default |
|------|---------|---------|
| `emoji` | string | - |
| `size` | `sm`, `md`, `lg`, `xl`, `xxl` | `md` |
| `variant` | `default`, `circle`, `rounded` | `default` |
| `bg` | string (cor) | - |

#### Label
```tsx
import { Label } from '@pitkit';

<Label htmlFor="email">Email</Label>
<Label htmlFor="nome" required>Nome</Label>
<Label size="sm">Campo pequeno</Label>
```

| Prop | Valores | Default |
|------|---------|---------|
| `size` | `sm`, `md`, `lg` | `md` |
| `required` | `boolean` | `false` |

#### HelperText
```tsx
import { HelperText } from '@pitkit';

<HelperText>Dica útil</HelperText>
<HelperText variant="error">Campo obrigatório</HelperText>
<HelperText variant="success">Disponível!</HelperText>
```

| Prop | Valores | Default |
|------|---------|---------|
| `variant` | `default`, `error`, `success` | `default` |

#### InputBase
```tsx
import { InputBase } from '@pitkit';

<InputBase type="text" placeholder="Digite..." />
<InputBase type="email" size="lg" />
<InputBase state="error" />
```

| Prop | Valores | Default |
|------|---------|---------|
| `size` | `sm`, `md`, `lg` | `md` |
| `state` | `default`, `error`, `success` | `default` |

#### TextareaBase
```tsx
import { TextareaBase } from '@pitkit';

<TextareaBase placeholder="Descrição..." />
<TextareaBase size="lg" rows={5} />
<TextareaBase state="error" />
```

| Prop | Valores | Default |
|------|---------|---------|
| `size` | `sm`, `md`, `lg` | `md` |
| `state` | `default`, `error`, `success` | `default` |

#### SelectBase
```tsx
import { SelectBase } from '@pitkit';

<SelectBase>
  <option value="">Selecione...</option>
  <option value="1">Opção 1</option>
  <option value="2">Opção 2</option>
</SelectBase>
```

| Prop | Valores | Default |
|------|---------|---------|
| `size` | `sm`, `md`, `lg` | `md` |
| `state` | `default`, `error`, `success` | `default` |

#### Spinner
```tsx
import { Spinner } from '@pitkit';

<Spinner />
<Spinner size="lg" />
```

| Prop | Valores | Default |
|------|---------|---------|
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | `sm` |

#### Skeleton
```tsx
import { Skeleton, SkeletonText, SkeletonTable } from '@pitkit';

<Skeleton />           // Retângulo genérico
<SkeletonText />       // Linhas de texto
<SkeletonTable />      // Tabela fantasma
```

---

### 3.2 Molecules (Moléculas)

#### Field (Composição)
```tsx
import { Field, InputBase, SelectBase, TextareaBase } from '@pitkit';

// Com InputBase
<Field label="Email" error={errors.email} required>
  <InputBase type="email" placeholder="seu@email.com" />
</Field>

// Com SelectBase
<Field label="Prioridade" helperText="Selecione a urgência">
  <SelectBase>
    <option value="low">Baixa</option>
    <option value="medium">Média</option>
    <option value="high">Alta</option>
  </SelectBase>
</Field>

// Com TextareaBase
<Field label="Descrição" error={errors.description}>
  <TextareaBase rows={4} />
</Field>
```

| Prop | Tipo | Descrição |
|------|------|-----------|
| `label` | `string` | Texto da label |
| `error` | `string` | Mensagem de erro (mostra estado vermelho) |
| `helperText` | `string` | Texto de ajuda (oculto se houver error) |
| `required` | `boolean` | Adiciona asterisco na label |
| `size` | `'sm' \| 'md' \| 'lg'` | Propaga para Label e children |
| `id` | `string` | ID do input (auto-gerado da label se omitido) |
| `children` | `ReactNode` | InputBase, SelectBase ou TextareaBase |

#### TextField (Convenience)
```tsx
import { TextField } from '@pitkit';

// Equivalente a Field + InputBase
<TextField
  label="Email"
  type="email"
  placeholder="seu@email.com"
  error={errors.email}
  required
/>
```

#### SelectField (Convenience)
```tsx
import { SelectField } from '@pitkit';

const roles = [
  { value: 'operator', label: 'Operador' },
  { value: 'maintainer', label: 'Manutentor' },
];

<SelectField
  label="Cargo"
  options={roles}
  placeholder="Selecione..."
  error={errors.role}
/>
```

| Prop | Tipo | Descrição |
|------|------|-----------|
| `options` | `{ value: string; label: string }[]` | Opções do select |
| `placeholder` | `string` | Primeira opção desabilitada |

#### TextareaField (Convenience)
```tsx
import { TextareaField } from '@pitkit';

<TextareaField
  label="Observações"
  placeholder="Descreva..."
  rows={4}
  helperText="Máximo 500 caracteres"
/>
```

---

### 3.3 Organisms (Organismos)

#### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@pitkit';
import type { CardColorScheme, CardBorderPosition } from '@pitkit';

// Default — mesmo visual de sempre (backward compatible)
<Card padding="md">
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
  </CardHeader>
  <CardContent>
    Conteúdo aqui...
  </CardContent>
  <CardFooter>
    <Button variant="secondary">Cancelar</Button>
    <Button>Salvar</Button>
  </CardFooter>
</Card>

// Filled — stat cards com background colorido
<Card variant="filled" colorScheme="brand" padding="md">
  <p>42</p>
  <p>OS Abertas</p>
</Card>

// Outlined com borda lateral — OS cards
<Card variant="outlined" colorScheme="danger" borderPosition="left" padding="md">
  <p>Torno CNC</p>
  <p>Motor com vibração</p>
</Card>

// Elevated + interactive — action cards clicáveis
<Link href="/nova-os">
  <Card variant="elevated" interactive padding="md">
    <span>➕</span>
    <p>Nova Solicitação</p>
  </Card>
</Link>
```

| Prop (Card) | Valores | Default | Descrição |
|-------------|---------|---------|-----------|
| `variant` | `default`, `elevated`, `outlined`, `filled` | `default` | Estilo visual base |
| `padding` | `none`, `sm`, `md`, `lg` | `md` | Padding interno |
| `colorScheme` | `brand`, `success`, `warning`, `danger`, `info`, `neutral` | — | Cor para bg (filled) ou border accent |
| `interactive` | `boolean` | `false` | Hover shadow + active scale + cursor pointer |
| `borderPosition` | `none`, `left`, `top` | `none` | Borda colorida de accent (usa colorScheme) |

**Variants:**
- `default` — branco, borda gray.200, sombra sm (comportamento original)
- `elevated` — branco, sem borda, sombra md (cards clicáveis)
- `outlined` — branco, borda gray.200, sem sombra (info/OS cards)
- `filled` — background colorido sutil (brand.50, green.50, etc.)

#### Table
```tsx
import {
  Table, TableHeader, TableBody, TableRow,
  TableHead, TableCell, TableEmpty
} from '@pitkit';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Nome</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Ações</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.length === 0 ? (
      <TableEmpty colSpan={3} message="Nenhum registro" />
    ) : (
      items.map(item => (
        <TableRow key={item.id}>
          <TableCell>{item.name}</TableCell>
          <TableCell><Badge variant="success">Ativo</Badge></TableCell>
          <TableCell><Button variant="ghost" size="sm">Editar</Button></TableCell>
        </TableRow>
      ))
    )}
  </TableBody>
</Table>
```

#### Modal
```tsx
import { Modal } from '@pitkit';

<Modal
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Confirmar Ação"
  size="md"
>
  <p>Tem certeza que deseja continuar?</p>
  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
    <Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
    <Button onClick={handleConfirm}>Confirmar</Button>
  </div>
</Modal>
```

| Prop | Valores | Default |
|------|---------|---------|
| `isOpen` | `boolean` | - |
| `onClose` | `() => void` | - |
| `title` | `string` | - |
| `size` | `sm`, `md`, `lg`, `xl` | `md` |

---

## 4. Compatibilidade com Código Legado

Para manter compatibilidade com código existente, o `index.ts` exporta aliases:

```tsx
// Código antigo (continua funcionando)
import { Input, Select } from '@pitkit';
<Input label="Nome" error="Obrigatório" />

// É equivalente a:
import { TextField, SelectField } from '@pitkit';
<TextField label="Nome" error="Obrigatório" />
```

**Recomendação**: Para novo código, prefira os nomes explícitos (`TextField`, `SelectField`) ou a composição com `Field`.

---

## 5. Padrão para Criar Novos Componentes

### 5.1 Átomo (em `atoms/`)

```tsx
// atoms/NovoAtomo.tsx
'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cva } from '../../../../styled-system/css';

const styles = cva({
  base: {
    // Estilos que sempre aplicam
  },
  variants: {
    variant: {
      primary: { /* ... */ },
      secondary: { /* ... */ },
    },
    size: {
      sm: { /* ... */ },
      md: { /* ... */ },
      lg: { /* ... */ },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export interface NovoAtomoProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const NovoAtomo = forwardRef<HTMLDivElement, NovoAtomoProps>(
  ({ variant, size, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles({ variant, size })} ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NovoAtomo.displayName = 'NovoAtomo';
```

### 5.2 Molécula (em `molecules/`)

```tsx
// molecules/NovaMolecula.tsx
'use client';

import { SomeAtom } from '../atoms/SomeAtom';
import { OtherAtom } from '../atoms/OtherAtom';

interface NovaMoleculaProps {
  // Combine props dos átomos que compõem
}

export function NovaMolecula({ ...props }: NovaMoleculaProps) {
  return (
    <div>
      <SomeAtom />
      <OtherAtom />
    </div>
  );
}
```

### 5.3 Exportar no index

```tsx
// atoms/index.ts (ou molecules/ ou organisms/)
export * from './NovoAtomo';
```

---

## 6. Estilização com PandaCSS

### 6.1 Usando `cva()` para Variants

```tsx
import { cva } from '../../../../styled-system/css';

const buttonStyles = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: 'brand.600',
        color: 'white',
        _hover: { backgroundColor: 'brand.700' },
      },
    },
    size: {
      sm: { height: '8', paddingX: '3', fontSize: 'sm' },
      md: { height: '10', paddingX: '4', fontSize: 'sm' },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
```

### 6.2 Usando `styled()` (para componentes de página)

```tsx
import { styled } from '../../../../styled-system/jsx';

const Card = styled('div', {
  base: {
    padding: '32px',
    backgroundColor: 'white',
    borderRadius: '16px',
  },
  variants: {
    highlighted: {
      true: { border: '2px solid', borderColor: 'brand.500' },
      false: { border: '1px solid', borderColor: '#e2e8f0' },
    },
  },
});

// Uso: <Card highlighted={true}>...</Card>
```

---

## 7. Checklist para Novos Componentes

1. [ ] Definir em qual nível pertence (atom/molecule/organism)
2. [ ] Usar `forwardRef` para permitir refs
3. [ ] Exportar interface de Props
4. [ ] Usar `cva()` para variants
5. [ ] Adicionar `displayName`
6. [ ] Exportar no `index.ts` da pasta
7. [ ] Testar em Pitlane, Torque e Showroom
8. [ ] Documentar neste arquivo (PITKIT.md)

---

## 8. Importação

```tsx
// Importar tudo de uma vez
import {
  Button, Badge, Heading, Text, Icon,
  TextField, SelectField, Field, InputBase,
  Card, CardHeader, CardContent, CardFooter,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Modal, Spinner, Skeleton
} from '@pitkit';
```

---

*"Pit stop funciona porque todo mundo usa o mesmo padrão. PitKit é isso, só que pra interface."*
