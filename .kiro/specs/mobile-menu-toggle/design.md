# mobile-menu-toggle Bugfix Design

## Overview

Auditoria de UX identificou seis defeitos no menu de navegação mobile/tablet do `interactive-banking-book`. Os problemas afetam `src/components/NavigationMenu.astro` e `src/layouts/BaseLayout.astro` e cobrem: ausência de mecanismo de fechar o menu (toggle, clique fora, Escape, ícone X), truncamento de títulos em mobile e tablet, posicionamento incorreto do botão hambúrguer fora do `site-header`, ausência de overlay/backdrop e ausência de scroll lock no `body`.

A estratégia de correção é cirúrgica e segue o padrão já estabelecido pelo `GlossaryPanel.astro`: overlay semitransparente, classe `body-lock` via `:global()`, foco devolvido ao elemento disparador e fechamento por Escape/clique-fora. As mudanças de CSS são isoladas nos breakpoints `max-width: 767px` e `768px–1024px`, sem afetar o comportamento desktop (≥ 1025px).

## Glossary

- **Bug_Condition (C)**: Conjunto de condições que caracterizam cada um dos seis defeitos observáveis no menu mobile/tablet
- **Property (P)**: Comportamento correto esperado quando a condição de bug é satisfeita
- **Preservation**: Comportamentos existentes que NÃO devem ser alterados pela correção
- **`nav-toggle`**: Botão hambúrguer em `NavigationMenu.astro` que controla a visibilidade do `nav-panel` no mobile
- **`nav-panel`**: Painel de navegação colapsável em `NavigationMenu.astro`, visível sempre no desktop/tablet, controlado pelo `nav-toggle` no mobile
- **`nav-menu-overlay`**: Elemento overlay a ser criado em `NavigationMenu.astro`, análogo ao `glossary-overlay` do `GlossaryPanel.astro`
- **`nav-body-lock`**: Classe CSS a ser aplicada ao `body` quando o menu mobile está aberto, análoga à `glossary-body-lock`
- **`site-header`**: Elemento `<header>` em `BaseLayout.astro` que contém o título do site e o `ThemeToggle`
- **`nav-item-title`**: Span CSS em `NavigationMenu.astro` que envolve o texto dos títulos de capítulo/seção
- **`isBugCondition`**: Função pseudocódigo que identifica os inputs que ativam cada defeito

## Bug Details

### Bug Condition

Os seis defeitos são independentes mas relacionados ao mesmo componente. Cada um possui sua própria condição de bug.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input de tipo {
    viewport: 'mobile' | 'tablet' | 'desktop',
    action: 'open_menu' | 'click_outside' | 'press_escape' | 'click_link' | 'view_title' | 'view_header',
    menuState: 'open' | 'closed',
    titleLength: 'short' | 'long'
  }
  OUTPUT: boolean

  -- Bug 1: sem mecanismo de fechar
  IF input.viewport = 'mobile' AND input.menuState = 'open'
     AND input.action IN ['click_outside', 'press_escape']
    RETURN true  -- menu não fecha

  -- Bug 2: títulos truncados no mobile
  IF input.viewport = 'mobile' AND input.titleLength = 'long'
     AND input.action = 'view_title'
    RETURN true  -- título cortado com overflow hidden

  -- Bug 3: títulos truncados no tablet
  IF input.viewport = 'tablet' AND input.titleLength = 'long'
     AND input.action = 'view_title'
    RETURN true  -- título cortado com max-width: 140px + white-space: nowrap

  -- Bug 4: hambúrguer fora do site-header
  IF input.viewport = 'mobile' AND input.action = 'view_header'
    RETURN true  -- nav-toggle renderizado abaixo do site-header

  -- Bug 5: sem overlay no mobile
  IF input.viewport = 'mobile' AND input.menuState = 'open'
     AND input.action = 'open_menu'
    RETURN overlayNotPresent  -- nav-panel abre sem backdrop

  -- Bug 6: sem scroll lock no mobile
  IF input.viewport = 'mobile' AND input.menuState = 'open'
    RETURN bodyScrollNotLocked  -- body.overflow não é 'hidden'

  RETURN false
END FUNCTION
```

### Examples

- **Bug 1a** — Usuário abre o menu mobile e clica fora do `nav-panel` → menu permanece aberto (bug ativo)
- **Bug 1b** — Usuário abre o menu mobile e pressiona Escape → menu permanece aberto (bug ativo)
- **Bug 1c** — Botão hambúrguer permanece com ícone de três linhas mesmo com menu aberto → sem feedback visual de estado (bug ativo)
- **Bug 2** — Título "Jornada de Onboarding e Abertura de Conta" no mobile → exibido truncado com `overflow: hidden` (bug ativo)
- **Bug 3** — Título "Gestão de Ativos e Passivos (ALM)" no tablet → cortado em 140px com ellipsis (bug ativo)
- **Bug 4** — Viewport mobile: `nav-toggle` aparece abaixo do `<header class="site-header">`, fora da área do header (bug ativo)
- **Bug 5** — Menu mobile aberto: conteúdo principal visível sem escurecimento, sem feedback de camada (bug ativo)
- **Bug 6** — Menu mobile aberto: usuário consegue rolar a página por baixo do painel (bug ativo)
- **Edge case** — Usuário em desktop (≥ 1025px): nenhum dos bugs deve ser visível; `nav-panel` sempre visível, sem overlay, sem scroll lock

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Desktop (≥ 1025px): `nav-panel` sempre visível, sem botão hambúrguer, sem overlay, sem scroll lock
- Tablet (768–1024px): `nav-panel` sempre visível, sem botão hambúrguer, sem overlay, sem scroll lock
- Colapso/expansão de categorias via `.nav-category-btn` continua funcionando normalmente
- Estado de colapso das categorias continua persistido no `localStorage` sob a chave `ibbook_nav_categories`
- Navegação por teclado (Tab/Enter/Space) nos itens do menu continua funcionando
- Indicadores de seção visitada (ícone ✓) continuam sendo exibidos corretamente
- `site-header` continua exibindo título do site e `ThemeToggle` lado a lado em todas as viewports
- `GlossaryPanel` continua com seu próprio overlay e scroll lock independentes, sem interferência
- Scroll suave para seções (`smoothScrollToSection`) continua funcionando

**Scope:**
Todas as interações que NÃO envolvam viewport mobile com menu aberto, ou títulos longos em mobile/tablet, devem ser completamente inalteradas. Isso inclui toda a navegação desktop, o comportamento do glossário, a alternância de tema e o progresso do leitor.

## Hypothesized Root Cause

1. **Bug 1 — Sem mecanismo de fechar**: O script existente em `NavigationMenu.astro` implementa apenas o `click` no `nav-toggle` para abrir o menu. Não há listener para `click` fora do painel, não há listener para `keydown` com `Escape`, e o ícone do botão não muda de estado. O `aria-label` também não é atualizado.

2. **Bug 2 — Títulos truncados no mobile**: O breakpoint `@media (max-width: 767px)` não define regras para `.nav-item-title`. O elemento herda estilos de outros contextos ou do reset global que podem causar `overflow: hidden` implícito via `flex` no elemento pai (`.nav-chapter-link` usa `display: flex` com `justify-content: space-between`).

3. **Bug 3 — Títulos truncados no tablet**: O breakpoint `@media (min-width: 768px) and (max-width: 1024px)` define explicitamente `.nav-item-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px }`. O `max-width` fixo de 140px é insuficiente para títulos longos em português.

4. **Bug 4 — Hambúrguer fora do header**: O `nav-toggle` está dentro do componente `NavigationMenu`, que é renderizado no `<div class="layout">` em `BaseLayout.astro`, abaixo do `<header class="site-header">`. No mobile, o layout empilha verticalmente, colocando o botão fora do header.

5. **Bug 5 — Sem overlay**: Não existe nenhum elemento de overlay no markup do `NavigationMenu.astro`. O `GlossaryPanel.astro` tem `<div id="glossary-overlay">` dedicado; o menu de navegação não tem equivalente.

6. **Bug 6 — Sem scroll lock**: O script do `NavigationMenu.astro` não adiciona nenhuma classe ao `body` ao abrir o menu. O `GlossaryPanel.astro` usa `document.body.classList.add('glossary-body-lock')` com `:global(.glossary-body-lock) { overflow: hidden }`.

## Correctness Properties

Property 1: Bug Condition — Fechar menu mobile (toggle, clique fora, Escape, ícone X)

_For any_ estado onde o menu mobile está aberto (`nav-panel--open` presente), o código corrigido SHALL fechar o menu (remover `nav-panel--open`, atualizar `aria-expanded="false"`, restaurar `aria-label` para "Abrir menu de navegação", exibir ícone hambúrguer) quando o usuário clicar no `nav-toggle`, clicar no overlay, ou pressionar Escape.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

Property 2: Bug Condition — Títulos completos no mobile

_For any_ item de seção ou capítulo com título longo exibido no `nav-panel` em viewport mobile (< 768px), o código corrigido SHALL exibir o título completo com quebra de linha (`white-space: normal; word-break: break-word`), sem truncamento por `overflow: hidden` ou `text-overflow: ellipsis`.

**Validates: Requirements 2.6**

Property 3: Bug Condition — Títulos completos no tablet

_For any_ item de seção ou capítulo com título longo exibido no menu em viewport tablet (768–1024px), o código corrigido SHALL exibir o título completo com quebra de linha, removendo `max-width` fixo e `white-space: nowrap` do `.nav-item-title`.

**Validates: Requirements 2.7**

Property 4: Bug Condition — Hambúrguer integrado ao site-header no mobile

_For any_ renderização em viewport mobile (< 768px), o código corrigido SHALL exibir o `nav-toggle` visualmente dentro do `site-header`, ao lado do título do site, movendo o botão para `BaseLayout.astro`.

**Validates: Requirements 2.8**

Property 5: Bug Condition — Overlay ao abrir menu mobile

_For any_ abertura do menu mobile, o código corrigido SHALL exibir um overlay semitransparente (`nav-menu-overlay--visible`) cobrindo o conteúdo principal, e SHALL remover o overlay ao fechar o menu.

**Validates: Requirements 2.9, 2.10**

Property 6: Bug Condition — Scroll lock ao abrir menu mobile

_For any_ estado onde o menu mobile está aberto, o código corrigido SHALL aplicar `nav-body-lock` ao `body` (equivalente a `overflow: hidden`), e SHALL remover a classe ao fechar o menu.

**Validates: Requirements 2.11, 2.12**

Property 7: Preservation — Comportamentos desktop/tablet e funcionalidades existentes

_For any_ interação em viewport desktop (≥ 1025px) ou tablet (768–1024px), e para qualquer interação que não envolva as condições de bug acima (colapso de categorias, localStorage, glossário, tema, progresso), o código corrigido SHALL produzir exatamente o mesmo resultado que o código original.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9**

## Fix Implementation

### Changes Required

**Arquivo 1**: `src/layouts/BaseLayout.astro`

**Mudanças específicas**:
1. **Mover `nav-toggle` para o `site-header`**: Adicionar o botão hambúrguer diretamente no `<header class="site-header">`, entre o título do site e o `ThemeToggle`. O botão deve ser renderizado condicionalmente via CSS (visível apenas em mobile via `display: none` / `display: flex`).
2. **Passar referência ao toggle**: O `nav-toggle` no header precisa controlar o `nav-panel` no `NavigationMenu`. A solução mais simples é manter o `id="nav-toggle"` e o script existente funciona via `getElementById`.
3. **Remover `nav-toggle` do `NavigationMenu.astro`**: Após mover para o `BaseLayout`, remover o botão do componente de navegação para evitar duplicação.

```astro
<header class="site-header">
  <a href={`${import.meta.env.BASE_URL}`} class="site-title" aria-label="Ir para a página inicial">
    Interactive Banking Book
  </a>
  <!-- Hambúrguer: visível apenas em mobile via CSS -->
  <button
    id="nav-toggle"
    class="nav-toggle"
    aria-expanded="false"
    aria-controls="nav-panel"
    aria-label="Abrir menu de navegação"
  >
    <span class="hamburger-icon" aria-hidden="true">
      <span></span><span></span><span></span>
    </span>
  </button>
  <ThemeToggle />
</header>
```

---

**Arquivo 2**: `src/components/NavigationMenu.astro`

**Mudanças específicas**:

1. **Remover `nav-toggle` do markup** — o botão foi movido para `BaseLayout.astro`.

2. **Adicionar overlay** — inserir `<div id="nav-menu-overlay" class="nav-menu-overlay" aria-hidden="true"></div>` após o `</nav>`, análogo ao `glossary-overlay`.

3. **Atualizar script de toggle** — expandir a lógica existente para:
   - Alternar ícone hambúrguer ↔ X ao abrir/fechar
   - Atualizar `aria-label` do botão
   - Mostrar/ocultar overlay (`nav-menu-overlay--visible`)
   - Aplicar/remover `nav-body-lock` no `body`
   - Fechar ao clicar no overlay
   - Fechar ao pressionar Escape
   - Devolver foco ao `nav-toggle` ao fechar

4. **Corrigir CSS mobile — títulos** — no breakpoint `@media (max-width: 767px)`, adicionar:
   ```css
   .nav-item-title {
     white-space: normal;
     word-break: break-word;
     overflow: visible;
   }
   ```

5. **Corrigir CSS tablet — títulos** — no breakpoint `@media (min-width: 768px) and (max-width: 1024px)`, remover `max-width: 140px`, `white-space: nowrap` e `overflow: hidden` do `.nav-item-title`, substituindo por:
   ```css
   .nav-item-title {
     white-space: normal;
     word-break: break-word;
   }
   ```

6. **Adicionar CSS overlay e scroll lock**:
   ```css
   .nav-menu-overlay {
     position: fixed;
     inset: 0;
     z-index: 99;
     background: rgba(0, 0, 0, 0.35);
     opacity: 0;
     pointer-events: none;
     transition: opacity 280ms ease;
   }
   .nav-menu-overlay--visible {
     opacity: 1;
     pointer-events: auto;
   }
   :global(.nav-body-lock) {
     overflow: hidden;
   }
   ```

7. **Atualizar CSS do `nav-panel` mobile** — garantir `z-index: 100` (acima do overlay em `z-index: 99`).

8. **Adicionar CSS do ícone X no `nav-toggle`** — quando `aria-expanded="true"`, transformar as três linhas em X via CSS:
   ```css
   .nav-toggle[aria-expanded="true"] .hamburger-icon span:nth-child(1) {
     transform: translateY(6px) rotate(45deg);
   }
   .nav-toggle[aria-expanded="true"] .hamburger-icon span:nth-child(2) {
     opacity: 0;
   }
   .nav-toggle[aria-expanded="true"] .hamburger-icon span:nth-child(3) {
     transform: translateY(-6px) rotate(-45deg);
   }
   ```

9. **Mover estilos do `nav-toggle`** — como o botão foi para `BaseLayout.astro`, os estilos do `.nav-toggle` e `.hamburger-icon` devem ser movidos para o `<style>` do `BaseLayout.astro` ou para `global.css`.

## Testing Strategy

### Validation Approach

A estratégia segue duas fases: primeiro, confirmar os defeitos no código não corrigido (exploratory); depois, verificar que a correção funciona e que os comportamentos existentes foram preservados (fix checking + preservation checking).

### Exploratory Bug Condition Checking

**Goal**: Demonstrar os seis defeitos ANTES de implementar a correção. Confirmar ou refutar a análise de causa raiz. Se refutarmos, precisaremos re-hipotetizar.

**Test Plan**: Simular eventos de teclado e mouse no `nav-toggle` e `nav-panel`, inspecionar `computedStyle` de `.nav-item-title`, verificar posição do `nav-toggle` no DOM, verificar presença de overlay e `overflow` do `body`.

**Test Cases**:
1. **Fechar por Escape**: Abrir menu mobile, disparar `keydown` com `key: 'Escape'`, verificar que `nav-panel--open` ainda está presente (falha esperada no código não corrigido)
2. **Fechar por clique fora**: Abrir menu mobile, clicar fora do `nav-panel`, verificar que `nav-panel--open` ainda está presente (falha esperada)
3. **Ícone X ausente**: Abrir menu mobile, verificar que `aria-expanded` do `nav-toggle` é `"true"` mas o ícone não mudou para X (falha esperada)
4. **Título truncado mobile**: Renderizar item com título longo em viewport mobile, verificar `computedStyle(.nav-item-title).whiteSpace !== 'normal'` (falha esperada)
5. **Título truncado tablet**: Renderizar item com título longo em viewport tablet, verificar `computedStyle(.nav-item-title).maxWidth === '140px'` (falha esperada)
6. **Overlay ausente**: Abrir menu mobile, verificar que nenhum elemento com classe `nav-menu-overlay--visible` existe no DOM (falha esperada)
7. **Scroll lock ausente**: Abrir menu mobile, verificar que `document.body.classList` não contém `nav-body-lock` (falha esperada)

**Expected Counterexamples**:
- `nav-panel--open` permanece após Escape/clique fora
- `computedStyle(.nav-item-title).maxWidth` retorna `"140px"` no tablet
- `document.querySelector('.nav-menu-overlay--visible')` retorna `null`
- `document.body.classList.contains('nav-body-lock')` retorna `false`

### Fix Checking

**Goal**: Verificar que para todos os inputs onde a bug condition é verdadeira, o código corrigido produz o comportamento esperado.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := fixedNavigationMenu(input)
  ASSERT expectedBehavior(result)
END FOR
```

### Preservation Checking

**Goal**: Verificar que para todos os inputs onde a bug condition NÃO é verdadeira, o código corrigido produz o mesmo resultado que o original.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT originalNavigationMenu(input) = fixedNavigationMenu(input)
END FOR
```

**Testing Approach**: Property-based testing é recomendado para preservation checking porque:
- Gera muitos casos de teste automaticamente no domínio de entrada
- Captura edge cases que testes unitários manuais podem perder
- Fornece garantias fortes de que o comportamento é inalterado para todas as entradas não-bugadas

**Test Cases**:
1. **Colapso de categorias**: Verificar que clicar em `.nav-category-btn` continua alternando o estado de colapso após a correção
2. **Persistência no localStorage**: Verificar que o estado de colapso continua sendo salvo/carregado de `ibbook_nav_categories`
3. **Desktop sempre visível**: Verificar que em viewport ≥ 1025px o `nav-panel` continua com `display: block` independente do estado do toggle
4. **Tablet sempre visível**: Verificar que em viewport 768–1024px o `nav-panel` continua sempre visível
5. **GlossaryPanel independente**: Verificar que abrir/fechar o glossário não interfere com o estado do menu mobile

### Unit Tests

- Verificar que clicar no `nav-toggle` com menu fechado adiciona `nav-panel--open` e `nav-menu-overlay--visible`
- Verificar que clicar no `nav-toggle` com menu aberto remove `nav-panel--open` e `nav-menu-overlay--visible`
- Verificar que pressionar Escape com menu aberto fecha o menu e devolve foco ao `nav-toggle`
- Verificar que clicar no overlay fecha o menu
- Verificar que `document.body.classList` contém `nav-body-lock` quando menu está aberto
- Verificar que `document.body.classList` não contém `nav-body-lock` quando menu está fechado
- Verificar que `aria-expanded` do `nav-toggle` reflete corretamente o estado do menu
- Verificar que `aria-label` do `nav-toggle` alterna entre "Abrir" e "Fechar menu de navegação"
- Verificar que `.nav-item-title` em mobile não tem `max-width` fixo nem `white-space: nowrap`
- Verificar que `.nav-item-title` em tablet não tem `max-width: 140px`

### Property-Based Tests

- Gerar sequências aleatórias de abrir/fechar o menu e verificar que o estado final é sempre consistente (`aria-expanded` ↔ `nav-panel--open` ↔ `nav-body-lock` ↔ overlay)
- Gerar strings de título aleatórias de comprimento variável (1–200 chars) e verificar que nenhuma é truncada em mobile
- Gerar strings de título aleatórias e verificar que nenhuma é truncada em tablet após a correção
- Gerar combinações de estado (menu aberto/fechado, glossário aberto/fechado) e verificar que os dois sistemas operam de forma independente

### Integration Tests

- Testar fluxo completo mobile: abrir menu → navegar para seção → verificar que menu fecha e página carrega
- Testar que o `nav-toggle` no `site-header` está visualmente alinhado com o título e o `ThemeToggle`
- Testar que o overlay aparece e desaparece com animação ao abrir/fechar o menu
- Testar que o scroll do body está travado enquanto o menu está aberto e restaurado ao fechar
- Testar que pressionar Tab com menu aberto mantém o foco dentro do `nav-panel` (trap de foco)
- Testar que em desktop/tablet o `nav-toggle` não é visível e o `nav-panel` está sempre acessível
