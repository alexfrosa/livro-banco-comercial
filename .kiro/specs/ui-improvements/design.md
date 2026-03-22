# ui-improvements Bugfix Design

## Overview

Este documento cobre três problemas de UI/manutenção no projeto `interactive-banking-book`:

1. **Astro desatualizado** — `package.json` declara `"astro": "^4.0.0"` e integrações compatíveis com 4.x; a versão estável mais recente é 6.x.
2. **Menu lateral sem link para a home** — `NavigationMenu.astro` renderiza apenas os itens recebidos via prop `items` (capítulos/seções), sem nenhuma entrada fixa apontando para `/`.
3. **Barra superior sem título** — `BaseLayout.astro` renderiza `<header class="site-header">` contendo apenas `<ThemeToggle />`, sem exibir o título do site ou da página.

A estratégia de correção é cirúrgica: atualizar versões no `package.json`/`astro.config.mjs`, inserir um item "Home" fixo no topo do `NavigationMenu.astro` e adicionar um `<span>` de título no `<header>` do `BaseLayout.astro`.

---

## Glossary

- **Bug_Condition (C)**: Conjunto de condições que caracterizam cada um dos três defeitos observáveis.
- **Property (P)**: Comportamento correto esperado quando a condição de bug é satisfeita.
- **Preservation**: Comportamentos existentes que NÃO devem ser alterados pela correção.
- **NavigationMenu**: Componente em `src/components/NavigationMenu.astro` que renderiza o menu lateral de navegação.
- **BaseLayout**: Layout base em `src/layouts/BaseLayout.astro` que define o shell HTML de todas as páginas.
- **navItems**: Prop do tipo `NavItem[]` passada ao `NavigationMenu` contendo capítulos e seções gerados dinamicamente.
- **site-header**: Elemento `<header>` em `BaseLayout.astro` que contém controles globais da barra superior.

---

## Bug Details

### Bug Condition

Os três defeitos são independentes e cada um possui sua própria condição de bug.

**Formal Specification:**

```
FUNCTION isBugCondition(input)
  INPUT: input de tipo { context: 'install' | 'navigation' | 'page_view' }
  OUTPUT: boolean

  IF input.context = 'install'
    RETURN astroVersionInPackageJson MATCHES '^4\\.0\\.0'
           AND latestStableAstro = '6.x'

  IF input.context = 'navigation'
    RETURN navPanelRendered = true
           AND NOT homeEntryPresentInNavPanel

  IF input.context = 'page_view'
    RETURN siteHeaderRendered = true
           AND NOT titlePresentInSiteHeader

  RETURN false
END FUNCTION
```

### Examples

- **Bug 1 — Astro desatualizado**: `npm install` instala `astro@4.x` em vez de `astro@6.x`. Integrações `@astrojs/mdx@^3`, `@astrojs/preact@^3` e `@astrojs/sitemap@^3` também ficam em versões antigas.
- **Bug 2 — Sem link home**: Usuário está lendo o capítulo 05; o menu lateral exibe apenas os capítulos 00–N sem nenhum item "Home" ou "Início" no topo.
- **Bug 3 — Header sem título**: Usuário acessa qualquer página; a barra superior exibe somente o botão de tema, sem identificação do site.
- **Edge case — Bug 2**: Usuário já está na home (`/`); o link "Home" deve aparecer no menu mas sem o estado `aria-current="page"` conflitante (ou com ele, se `currentUrl === '/'`).

---

## Expected Behavior

### Preservation Requirements

**Comportamentos que NÃO devem mudar:**

- Cliques em itens do menu lateral continuam navegando para a URL correta do capítulo/seção.
- O conteúdo MDX de todos os capítulos continua sendo renderizado corretamente após a atualização do Astro.
- A alternância de tema (claro/escuro) continua funcionando sem recarregar a página.
- O menu hambúrguer colapsável continua funcionando em dispositivos móveis.
- O menu lateral fixo (sticky sidebar) continua funcionando em desktop.
- Os indicadores de seção visitada (ícone ✓) continuam sendo exibidos corretamente.

**Escopo:**

Todas as interações que NÃO envolvem as três condições de bug acima devem ser completamente inalteradas. Isso inclui:
- Navegação por clique nos itens existentes do menu
- Comportamento do `ThemeToggle`
- Renderização de diagramas Mermaid e simulações interativas
- Funcionalidade de busca e progresso do leitor

---

## Hypothesized Root Cause

1. **Bug 1 — Versão desatualizada**: O `package.json` foi criado quando o Astro 4.x era a versão mais recente e nunca foi atualizado. As integrações `@astrojs/mdx`, `@astrojs/preact` e `@astrojs/sitemap` também precisam de bump para versões compatíveis com Astro 6.x.

2. **Bug 2 — Sem link home**: O `NavigationMenu.astro` foi projetado para renderizar apenas os itens recebidos via prop `items`, que são gerados dinamicamente a partir dos capítulos. Nenhum item fixo de "Home" foi adicionado ao template do componente.

3. **Bug 3 — Header sem título**: O `<header class="site-header">` em `BaseLayout.astro` foi implementado com `justify-content: flex-end`, posicionando apenas o `ThemeToggle` à direita. Nenhum elemento de título foi incluído no markup do header.

---

## Correctness Properties

Property 1: Bug Condition — Astro na versão estável mais recente

_For any_ execução de `npm install` no projeto, o sistema SHALL instalar o Astro na versão 6.x (estável mais recente) com todas as integrações (`@astrojs/mdx`, `@astrojs/preact`, `@astrojs/sitemap`) em versões compatíveis com Astro 6.x.

**Validates: Requirements 2.1**

Property 2: Bug Condition — Link "Home" presente no menu lateral

_For any_ renderização do `NavigationMenu` em qualquer página do site, o painel de navegação SHALL exibir um link "Home" (ou equivalente) no topo da lista que aponta para `/`.

**Validates: Requirements 2.2**

Property 3: Bug Condition — Título presente na barra superior

_For any_ renderização de uma página usando `BaseLayout`, o elemento `<header class="site-header">` SHALL exibir o título do site visível ao usuário, ao lado do `ThemeToggle`.

**Validates: Requirements 2.3**

Property 4: Preservation — Comportamentos existentes inalterados

_For any_ interação que NÃO envolva as condições de bug acima (navegação por clique, alternância de tema, menu hambúrguer, renderização de conteúdo MDX), o sistema corrigido SHALL produzir exatamente o mesmo resultado que o sistema original.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

---

## Fix Implementation

### Changes Required

**Bug 1 — Atualizar Astro e integrações**

Arquivo: `package.json`

Alterações específicas:
1. Atualizar `"astro": "^4.0.0"` → `"astro": "^6.0.0"`
2. Atualizar `"@astrojs/mdx": "^3.0.0"` → `"^4.0.0"` (versão compatível com Astro 6)
3. Atualizar `"@astrojs/preact": "^3.0.0"` → `"^4.0.0"` (versão compatível com Astro 6)
4. Atualizar `"@astrojs/sitemap": "^3.0.0"` → `"^3.2.0"` ou superior compatível com Astro 6

Arquivo: `astro.config.mjs` — verificar se há breaking changes na API `defineConfig` entre 4.x e 6.x e ajustar se necessário.

---

**Bug 2 — Adicionar link "Home" no NavigationMenu**

Arquivo: `src/components/NavigationMenu.astro`

Alterações específicas:
1. Antes do `{items.map(...)}`, inserir um item fixo `<li>` com link para `/`
2. Aplicar `aria-current="page"` quando `currentUrl === '/'`
3. Reutilizar as classes CSS existentes (`nav-chapter-link`, `nav-active`) para consistência visual

```astro
<li class="nav-chapter nav-home">
  <a
    href="/"
    class:list={['nav-chapter-link', { 'nav-active': isActive('/') }]}
    aria-current={isActive('/') ? 'page' : undefined}
  >
    <span class="nav-item-title">🏠 Home</span>
  </a>
</li>
```

---

**Bug 3 — Adicionar título na barra superior**

Arquivo: `src/layouts/BaseLayout.astro`

Alterações específicas:
1. Adicionar um `<span>` ou `<a>` com o título do site dentro do `<header class="site-header">`
2. Alterar `justify-content: flex-end` para `justify-content: space-between` no CSS do `.site-header`
3. O título pode ser o valor da prop `title` já disponível no componente, ou um nome fixo do site

```astro
<header class="site-header">
  <a href="/" class="site-title" aria-label="Ir para a página inicial">
    Interactive Banking Book
  </a>
  <ThemeToggle />
</header>
```

---

## Testing Strategy

### Validation Approach

A estratégia segue duas fases: primeiro, confirmar os defeitos no código não corrigido (exploratory); depois, verificar que a correção funciona e que os comportamentos existentes foram preservados.

### Exploratory Bug Condition Checking

**Goal**: Demonstrar os três defeitos ANTES de implementar a correção. Confirmar ou refutar a análise de causa raiz.

**Test Plan**: Inspecionar `package.json` para versão do Astro; renderizar `NavigationMenu` com itens de teste e verificar ausência do link home; renderizar `BaseLayout` e verificar ausência de título no header.

**Test Cases**:
1. **Versão do Astro**: Verificar que `package.json` declara `^4.0.0` (falha no código não corrigido — versão desatualizada)
2. **Link Home ausente**: Renderizar `NavigationMenu` com `items=[]` e `currentUrl="/"` e verificar que nenhum link para `/` está presente (falha no código não corrigido)
3. **Título ausente no header**: Renderizar `BaseLayout` e verificar que `.site-header` não contém texto de título (falha no código não corrigido)
4. **Edge case — Home ativa**: Renderizar `NavigationMenu` com `currentUrl="/"` e verificar que o link home recebe `aria-current="page"` (pode falhar no código não corrigido)

**Expected Counterexamples**:
- `package.json` contém `"astro": "^4.0.0"` em vez de `^6.x`
- O `nav-panel` não contém nenhum `<a href="/">` 
- O `.site-header` não contém nenhum elemento com texto visível além do `ThemeToggle`

### Fix Checking

**Goal**: Verificar que, para todas as entradas onde a condição de bug é satisfeita, a função corrigida produz o comportamento esperado.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := fixedSystem(input)
  ASSERT expectedBehavior(result)
END FOR
```

### Preservation Checking

**Goal**: Verificar que, para todas as entradas onde a condição de bug NÃO é satisfeita, o sistema corrigido produz o mesmo resultado que o original.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT originalSystem(input) = fixedSystem(input)
END FOR
```

**Testing Approach**: Testes baseados em propriedades são recomendados para preservation checking porque:
- Geram muitos casos de teste automaticamente no domínio de entrada
- Capturam edge cases que testes unitários manuais podem perder
- Fornecem garantias fortes de que o comportamento é inalterado para todas as entradas não-bugadas

**Test Cases**:
1. **Preservação de navegação**: Verificar que clicar em itens do menu continua navegando para URLs corretas após a correção
2. **Preservação do ThemeToggle**: Verificar que o toggle de tema continua presente e funcional no header após adicionar o título
3. **Preservação do menu hambúrguer**: Verificar que o comportamento mobile do menu não foi afetado pela adição do link home
4. **Preservação de conteúdo MDX**: Verificar que capítulos renderizam corretamente após atualização do Astro

### Unit Tests

- Testar que `NavigationMenu` renderiza um link `<a href="/">` como primeiro item da lista
- Testar que o link home recebe `aria-current="page"` quando `currentUrl === '/'`
- Testar que o link home NÃO recebe `aria-current` quando `currentUrl !== '/'`
- Testar que `BaseLayout` renderiza um elemento com texto de título dentro de `.site-header`
- Testar que `package.json` declara Astro `^6.x` após a correção

### Property-Based Tests

- Gerar `currentUrl` aleatórios e verificar que o link home sempre aparece no menu independente da URL atual
- Gerar listas de `navItems` aleatórias e verificar que o link home é sempre o primeiro item renderizado
- Gerar props `title` aleatórias e verificar que o título aparece no header para qualquer valor de título

### Integration Tests

- Testar o fluxo completo: acessar um capítulo, clicar em "Home" no menu, verificar redirecionamento para `/`
- Testar que o header exibe título e ThemeToggle simultaneamente em todas as páginas
- Testar que a build do Astro 6.x completa sem erros com o conteúdo MDX existente
- Testar responsividade: verificar que o título no header não quebra o layout em mobile
