# chapter-link-404 Bugfix Design

## Overview

O bug ocorre em `generateNavItems` (`src/utils/contentLoader.ts`): a URL gerada para o item de capítulo é `/{chapterSlug}`, mas o roteador Astro em `src/pages/[...slug].astro` só gera rotas estáticas no formato `/{chapterSlug}/{sectionSlug}`. Clicar no link do capítulo no menu lateral resulta em 404.

A correção é pontual: quando o capítulo possui seções, usar `generateSectionUrl(chapter.slug, sortedSections[0].slug)` como URL do capítulo. Quando não há seções, manter `/${chapter.slug}` como fallback.

## Glossary

- **Bug_Condition (C)**: Capítulo com pelo menos uma seção cujo NavItem tem `url === /${chapter.slug}` (URL sem sectionSlug)
- **Property (P)**: Para todo capítulo com seções, `navItem.url === generateSectionUrl(chapter.slug, sortedSections[0].slug)`
- **Preservation**: Comportamento de URLs de seções filhas, ordenação e fallback para capítulos sem seções permanecem inalterados
- **generateNavItems**: Função em `src/utils/contentLoader.ts` que converte a lista de capítulos/seções em `NavItem[]` para o menu lateral
- **generateSectionUrl**: Função em `src/utils/contentLoader.ts` que retorna `/${chapterSlug}/${sectionSlug}`
- **sortedSections**: Seções de um capítulo ordenadas por `frontmatter.order` ascendente

## Bug Details

### Bug Condition

O bug se manifesta quando `generateNavItems` processa um capítulo que possui seções. A função retorna `url: /${chapter.slug}` para o item do capítulo, mas essa rota não existe no roteador Astro.

**Formal Specification:**
```
FUNCTION isBugCondition(chapter)
  INPUT: chapter com slug, meta e sections[]
  OUTPUT: boolean

  RETURN chapter.sections.length > 0
         AND navItem.url === `/${chapter.slug}`
         AND NOT EXISTS rota estática para `/${chapter.slug}`
END FUNCTION
```

### Examples

- Capítulo `04-kyc-conceitos` com seção `01-conceitos` → URL gerada: `/04-kyc-conceitos` → 404 (esperado: `/04-kyc-conceitos/01-conceitos`)
- Capítulo `00-introducao` com seções `01-objetivo`, `02-o-que-e-backoffice` → URL gerada: `/00-introducao` → 404 (esperado: `/00-introducao/01-objetivo`)
- Capítulo sem seções → URL gerada: `/{chapterSlug}` → comportamento de fallback (sem bug, sem rota gerada pelo Astro também, mas é o comportamento atual aceito)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- URLs dos NavItems filhos (seções) devem continuar sendo `/{chapterSlug}/{sectionSlug}`
- Ordenação de capítulos e seções por `order` ascendente deve permanecer inalterada
- Capítulos sem seções devem continuar recebendo `url: /${chapter.slug}` como fallback

**Scope:**
Todos os inputs que NÃO envolvem capítulos com seções (ex: capítulos sem seções, geração de URLs de seções filhas, ordenação) devem ser completamente inalterados por esta correção.

## Hypothesized Root Cause

A causa raiz está confirmada:

1. **URL hardcoded sem sectionSlug**: Em `generateNavItems`, o retorno do item de capítulo usa `url: \`/${chapter.slug}\`` diretamente, sem verificar se existem seções disponíveis para compor uma URL válida.

2. **Ausência de rota `/{chapterSlug}`**: O `getStaticPaths` em `[...slug].astro` itera apenas sobre arquivos `.mdx` e gera params `{ slug: \`${chapterSlug}/${sectionSlug}\` }`. Não há geração de rota para o slug do capítulo isolado.

3. **Desconexão entre geração de nav e geração de rotas**: `generateNavItems` e `getStaticPaths` evoluíram de forma independente, criando essa inconsistência.

## Correctness Properties

Property 1: Bug Condition - URL do capítulo aponta para primeira seção

_For any_ capítulo onde `isBugCondition` retorna true (capítulo com `sections.length > 0`), a função `generateNavItems` corrigida SHALL retornar um NavItem cujo `url` seja igual a `generateSectionUrl(chapter.slug, sortedSections[0].slug)`.

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation - Comportamento para entradas sem bug

_For any_ entrada onde `isBugCondition` retorna false (capítulo sem seções, URLs de seções filhas, ordenação), a função `generateNavItems` corrigida SHALL produzir o mesmo resultado que a função original, preservando URLs de seções, ordenação e fallback de capítulos sem seções.

**Validates: Requirements 3.1, 3.2, 3.3**

## Fix Implementation

### Changes Required

**File**: `src/utils/contentLoader.ts`

**Function**: `generateNavItems`

**Specific Changes**:

1. **URL do capítulo com seções**: Substituir `url: \`/${chapter.slug}\`` por `url: generateSectionUrl(chapter.slug, sortedSections[0].slug)` quando `sortedSections.length > 0`

2. **Fallback para capítulo sem seções**: Manter `url: \`/${chapter.slug}\`` quando `sortedSections.length === 0`

**Diff conceitual:**
```
// ANTES
return {
  title: chapter.meta.title,
  slug: chapter.slug,
  url: `/${chapter.slug}`,   // ← bug: rota não existe
  children,
};

// DEPOIS
const chapterUrl = sortedSections.length > 0
  ? generateSectionUrl(chapter.slug, sortedSections[0].slug)
  : `/${chapter.slug}`;

return {
  title: chapter.meta.title,
  slug: chapter.slug,
  url: chapterUrl,           // ← correto: aponta para primeira seção
  children,
};
```

Nenhuma outra função ou arquivo precisa ser alterado.

## Testing Strategy

### Validation Approach

Abordagem em duas fases: primeiro executar testes no código não corrigido para confirmar o bug e a causa raiz; depois verificar que a correção funciona e que o comportamento existente é preservado.

### Exploratory Bug Condition Checking

**Goal**: Demonstrar o bug ANTES da correção. Confirmar que `generateNavItems` retorna `url: /${chapter.slug}` para capítulos com seções.

**Test Plan**: Chamar `generateNavItems` com capítulos que possuem seções e verificar que a URL do item de capítulo NÃO é `/${chapterSlug}` (o teste falhará no código não corrigido, confirmando o bug).

**Test Cases**:
1. **Capítulo com uma seção**: `generateNavItems([{ slug: 'cap-a', meta, sections: [s1] }])` → url deve ser `/cap-a/s1` (falha no código original)
2. **Capítulo com múltiplas seções**: url deve apontar para a seção de menor `order` (falha no código original)
3. **Capítulo sem seções**: url deve ser `/${chapterSlug}` (passa no código original — fallback)

**Expected Counterexamples**:
- `navItem.url === '/cap-a'` em vez de `'/cap-a/s1'`

### Fix Checking

**Goal**: Verificar que para todos os inputs onde `isBugCondition` é verdadeiro, a função corrigida produz o comportamento esperado.

**Pseudocode:**
```
FOR ALL chapter WHERE chapter.sections.length > 0 DO
  navItems := generateNavItems_fixed([chapter])
  chapterItem := navItems[0]
  sortedSections := sort(chapter.sections, by order ASC)
  ASSERT chapterItem.url === generateSectionUrl(chapter.slug, sortedSections[0].slug)
END FOR
```

### Preservation Checking

**Goal**: Verificar que para todos os inputs onde `isBugCondition` é falso, a função corrigida produz o mesmo resultado que a original.

**Pseudocode:**
```
FOR ALL chapter WHERE chapter.sections.length === 0 DO
  ASSERT generateNavItems_original([chapter]) === generateNavItems_fixed([chapter])
END FOR

FOR ALL chapter, section DO
  originalChildren := generateNavItems_original([chapter]).children
  fixedChildren    := generateNavItems_fixed([chapter]).children
  ASSERT originalChildren === fixedChildren
END FOR
```

**Testing Approach**: Testes baseados em propriedades são recomendados para preservation checking porque geram automaticamente muitos casos de teste e garantem que o comportamento é preservado para todos os inputs não-bugados.

**Test Cases**:
1. **Preservation de URLs de seções filhas**: Para qualquer capítulo/seção, `children[i].url === generateSectionUrl(chapter.slug, section.slug)`
2. **Preservation de ordenação**: Capítulos e seções retornados em ordem ascendente de `order`
3. **Preservation de fallback**: Capítulo sem seções retorna `url: /${chapter.slug}`

### Unit Tests

- Testar `generateNavItems` com capítulo com uma seção → url do capítulo aponta para a seção
- Testar `generateNavItems` com capítulo com múltiplas seções → url aponta para seção de menor `order`
- Testar `generateNavItems` com capítulo sem seções → url é `/${chapterSlug}` (fallback)
- Testar que URLs dos filhos (seções) não são afetadas pela correção

### Property-Based Tests

- Para qualquer capítulo com `sections.length > 0`, `navItem.url === generateSectionUrl(slug, sortedSections[0].slug)`
- Para qualquer capítulo com `sections.length === 0`, `navItem.url === \`/${slug}\``
- Para qualquer seção filha, `child.url === generateSectionUrl(chapterSlug, sectionSlug)` (preservação)
- Para qualquer lista de capítulos, a ordem dos NavItems retornados é ascendente por `meta.order`

### Integration Tests

- Verificar que nenhuma URL gerada por `generateNavItems` para capítulos com seções resulta em 404 ao ser comparada com as rotas geradas por `getStaticPaths`
- Verificar que o menu lateral renderiza links de capítulo que apontam para rotas existentes
