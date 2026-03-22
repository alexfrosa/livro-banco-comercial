# Missing Spacing After List — Bugfix Design

## Overview

O reset CSS global (`* { margin: 0; padding: 0 }`) em `src/styles/global.css` zera as margens de todos os elementos HTML, incluindo `ul` e `ol`. O arquivo define explicitamente `margin-bottom` para `p`, mas omite regras equivalentes para listas. Como resultado, qualquer `ul` ou `ol` seguido de outro elemento no conteúdo MDX aparece sem espaço visual, causando conteúdo "amontoado".

A correção é mínima e cirúrgica: adicionar três regras CSS em `global.css` para `ul`/`ol`, `ul:last-child`/`ol:last-child` e `li`, espelhando o padrão já estabelecido para `p`.

## Glossary

- **Bug_Condition (C)**: Elemento `ul` ou `ol` presente no conteúdo MDX sem `margin-bottom` definido, causando ausência de espaço visual após a lista
- **Property (P)**: Comportamento correto — listas devem ter `margin-bottom: var(--spacing-paragraph)` e `padding-left: 1.5rem`, com `margin-bottom: 0` quando forem `last-child`
- **Preservation**: Comportamento existente que não deve mudar — `p:last-child`, blockquotes, callouts, tema escuro, responsividade e itens aninhados
- **`--spacing-paragraph`**: Variável CSS definida em `themes.css`, valor mínimo de `1.2em`, usada como espaçamento padrão entre blocos de texto
- **`global.css`**: Arquivo `src/styles/global.css` — reset, tipografia base e estilos globais do projeto

## Bug Details

### Bug Condition

O bug manifesta quando um elemento `ul` ou `ol` aparece no conteúdo MDX. O reset global zera `margin` e `padding` de todos os elementos, mas `global.css` não redefine `margin-bottom` para listas (ao contrário de `p`, que tem regra explícita).

**Formal Specification:**
```
FUNCTION isBugCondition(element)
  INPUT: element — nó DOM renderizado a partir de conteúdo MDX
  OUTPUT: boolean

  RETURN element.tagName IN ['UL', 'OL']
         AND computedStyle(element).marginBottom = '0px'
         AND NOT element.matches(':last-child')
END FUNCTION
```

### Examples

- `ol` seguido de `h3` → heading aparece colado ao último `li` (bug ativo)
- `ul` seguido de `p` → parágrafo aparece sem separação visual (bug ativo)
- `ul` como último elemento de uma seção → sem margem inferior (comportamento correto, deve ser preservado)
- `p` seguido de `h3` → funciona corretamente (regra `p { margin-bottom }` existe)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- `p:last-child { margin-bottom: 0 }` deve continuar funcionando sem interferência
- `blockquote p` e `.callout p` com `margin-bottom: 0` devem permanecer inalterados
- Tema escuro deve aplicar as mesmas regras de espaçamento sem regressão visual
- Listas dentro de `blockquote` ou `.callout` devem respeitar o `padding` interno desses contêineres
- Layout responsivo em dispositivos móveis não deve sofrer overflow ou colapso

**Scope:**
Todos os elementos que NÃO sejam `ul` ou `ol` devem ser completamente inalterados por este fix. Isso inclui `p`, `h1`–`h6`, `blockquote`, `.callout`, `figure`, `img` e qualquer outro elemento já estilizado.

## Hypothesized Root Cause

Causa raiz confirmada pelo usuário:

1. **Reset global sem restauração para listas**: O seletor `* { margin: 0; padding: 0 }` zera `margin` e `padding` de `ul` e `ol`, mas nenhuma regra posterior em `global.css` os redefine — ao contrário de `p`, que tem `margin-bottom: var(--spacing-paragraph)` explícito.

2. **Omissão por inconsistência**: O padrão de "reset + restauração seletiva" foi aplicado para `p` mas não estendido para `ul`/`ol` quando o arquivo foi criado.

3. **Sem `padding-left`**: Além da margem, o reset também zera `padding-left`, removendo a indentação padrão dos itens de lista.

## Correctness Properties

Property 1: Bug Condition — List Bottom Margin

_For any_ elemento `ul` ou `ol` que não seja `:last-child` no conteúdo MDX, a versão corrigida do `global.css` SHALL aplicar `margin-bottom: var(--spacing-paragraph)` e `padding-left: 1.5rem`, criando separação visual adequada entre a lista e o elemento seguinte.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation — Last-Child and Existing Elements

_For any_ elemento `ul` ou `ol` que seja `:last-child`, e para todos os demais elementos já estilizados (`p`, `blockquote`, `.callout`, etc.), a versão corrigida SHALL produzir exatamente o mesmo resultado visual que a versão original, preservando todos os comportamentos existentes.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

## Fix Implementation

### Changes Required

**File**: `src/styles/global.css`

**Specific Changes**:

1. **Adicionar regra para `ul, ol`** — após o bloco de parágrafos, espelhando o padrão de `p`:
   ```css
   ul,
   ol {
     margin-bottom: var(--spacing-paragraph);
     padding-left: 1.5rem;
   }
   ```

2. **Adicionar regra `last-child`** — para evitar margem desnecessária no último elemento (req 3.1):
   ```css
   ul:last-child,
   ol:last-child {
     margin-bottom: 0;
   }
   ```

3. **Adicionar espaçamento interno dos itens** — para legibilidade em listas com múltiplos itens:
   ```css
   li {
     margin-bottom: 0.25em;
   }
   ```

As três regras devem ser inseridas logo após o bloco `/* ── Parágrafos ── */`, mantendo a organização semântica do arquivo.

## Testing Strategy

### Validation Approach

Abordagem em duas fases: primeiro verificar o bug no código não-corrigido (exploratory), depois confirmar que o fix funciona e que nenhuma regressão foi introduzida (fix checking + preservation checking).

### Exploratory Bug Condition Checking

**Goal**: Confirmar a causa raiz observando o comportamento antes do fix.

**Test Plan**: Inspecionar `computedStyle` de elementos `ul`/`ol` no DOM renderizado e verificar que `marginBottom` é `"0px"` antes da correção.

**Test Cases**:
1. **ol seguido de h3**: Renderizar MDX com `ol` antes de `h3` e verificar `marginBottom === "0px"` (falha esperada no código não-corrigido)
2. **ul seguido de p**: Renderizar MDX com `ul` antes de `p` e verificar `marginBottom === "0px"` (falha esperada)
3. **ul sem padding-left**: Verificar que `paddingLeft === "0px"` antes do fix (falha esperada)
4. **ul:last-child**: Verificar que `marginBottom === "0px"` para lista como último elemento (comportamento correto — deve passar antes e depois)

**Expected Counterexamples**:
- `computedStyle(ul).marginBottom` retorna `"0px"` em vez de valor de `--spacing-paragraph`
- `computedStyle(ul).paddingLeft` retorna `"0px"` em vez de `"24px"` (1.5rem)

### Fix Checking

**Goal**: Verificar que para todos os inputs onde a bug condition é verdadeira, o código corrigido produz o comportamento esperado.

**Pseudocode:**
```
FOR ALL element WHERE isBugCondition(element) DO
  result := computedStyle_fixed(element)
  ASSERT result.marginBottom = var(--spacing-paragraph)
  ASSERT result.paddingLeft = '1.5rem'
END FOR
```

### Preservation Checking

**Goal**: Verificar que para todos os inputs onde a bug condition NÃO é verdadeira, o código corrigido produz o mesmo resultado que o original.

**Pseudocode:**
```
FOR ALL element WHERE NOT isBugCondition(element) DO
  ASSERT computedStyle_original(element) = computedStyle_fixed(element)
END FOR
```

**Testing Approach**: Testes de snapshot CSS e inspeção de `computedStyle` são adequados aqui. Property-based testing pode gerar combinações aleatórias de elementos para verificar que nenhum elemento não-lista foi afetado.

**Test Cases**:
1. **p:last-child preservation**: Verificar que `p:last-child` continua com `margin-bottom: 0`
2. **blockquote p preservation**: Verificar que `blockquote p` continua com `margin-bottom: 0`
3. **ul:last-child preservation**: Verificar que `ul:last-child` tem `margin-bottom: 0` após o fix
4. **Tema escuro**: Verificar que as regras se aplicam igualmente com `data-theme="dark"`

### Unit Tests

- Verificar `computedStyle(ul).marginBottom` após aplicar o CSS corrigido
- Verificar `computedStyle(ol).marginBottom` após aplicar o CSS corrigido
- Verificar `computedStyle(ul).paddingLeft === "24px"` (1.5rem com base 16px)
- Verificar `computedStyle(li).marginBottom === "0.25em"`
- Verificar `computedStyle(ul:last-child).marginBottom === "0px"`

### Property-Based Tests

- Gerar elementos aleatórios (`p`, `h2`, `blockquote`, etc.) e verificar que nenhum teve `computedStyle` alterado pelo fix
- Gerar listas com número variável de itens e verificar que `margin-bottom` é aplicado consistentemente
- Verificar que listas dentro de `blockquote`/`.callout` não causam overflow com o `padding-left` adicionado

### Integration Tests

- Renderizar capítulo real (ex: `05-onboarding/02-backoffice.mdx`) e verificar visualmente que headings após listas têm espaço adequado
- Verificar que o layout não quebra em viewport mobile (375px)
- Verificar que listas dentro de callouts mantêm alinhamento correto com o `padding` do contêiner
