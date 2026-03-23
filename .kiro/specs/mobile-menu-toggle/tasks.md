# mobile-menu-toggle — Tasks

## Tasks

- [x] 1. Exploratory: confirmar os seis defeitos no código não-corrigido
  - [x] 1.1 Verificar Bug 1: abrir menu mobile, disparar `keydown` Escape e clicar fora do `nav-panel`, confirmar que `nav-panel--open` permanece presente
  - [x] 1.2 Verificar Bug 2: inspecionar `computedStyle(.nav-item-title)` em viewport mobile com título longo, confirmar truncamento (`overflow: hidden` ou `white-space: nowrap` herdado do flex pai)
  - [x] 1.3 Verificar Bug 3: inspecionar `computedStyle(.nav-item-title)` em viewport tablet, confirmar `maxWidth === '140px'` e `whiteSpace === 'nowrap'`
  - [x] 1.4 Verificar Bug 4: inspecionar o DOM e confirmar que `#nav-toggle` está dentro de `.nav-menu` (abaixo do `site-header`), não dentro de `.site-header`
  - [x] 1.5 Verificar Bug 5: abrir menu mobile, confirmar que nenhum elemento com classe `nav-menu-overlay--visible` existe no DOM
  - [x] 1.6 Verificar Bug 6: abrir menu mobile, confirmar que `document.body.classList.contains('nav-body-lock')` retorna `false`

- [x] 2. Fix — mover `nav-toggle` para `BaseLayout.astro` (Bug 4)
  - [x] 2.1 Adicionar botão `#nav-toggle` com `.hamburger-icon` dentro do `<header class="site-header">` em `src/layouts/BaseLayout.astro`, entre o `.site-title` e o `ThemeToggle`
  - [x] 2.2 Adicionar estilos CSS do `.nav-toggle` e `.hamburger-icon` no `<style>` do `BaseLayout.astro` (visível apenas em mobile via `display: none` / `display: flex`)
  - [x] 2.3 Remover o elemento `<button id="nav-toggle">` e seus estilos do `src/components/NavigationMenu.astro`

- [x] 3. Fix — adicionar overlay ao `NavigationMenu.astro` (Bug 5)
  - [x] 3.1 Inserir `<div id="nav-menu-overlay" class="nav-menu-overlay" aria-hidden="true"></div>` após o `</nav>` em `NavigationMenu.astro`
  - [x] 3.2 Adicionar CSS do overlay: `position: fixed; inset: 0; z-index: 99; background: rgba(0,0,0,0.35); opacity: 0; pointer-events: none; transition: opacity 280ms ease`
  - [x] 3.3 Adicionar classe `.nav-menu-overlay--visible { opacity: 1; pointer-events: auto }` e regra `@media (prefers-reduced-motion: reduce)` para desabilitar a transição

- [x] 4. Fix — scroll lock no body (Bug 6)
  - [x] 4.1 Adicionar `:global(.nav-body-lock) { overflow: hidden }` no `<style>` do `NavigationMenu.astro`
  - [x] 4.2 Aplicar `document.body.classList.add('nav-body-lock')` ao abrir o menu no script
  - [x] 4.3 Remover `document.body.classList.remove('nav-body-lock')` ao fechar o menu no script

- [x] 5. Fix — mecanismo completo de fechar o menu (Bug 1)
  - [x] 5.1 Criar função `openMenu()` no script: adiciona `nav-panel--open`, `nav-menu-overlay--visible`, `nav-body-lock`; atualiza `aria-expanded="true"` e `aria-label="Fechar menu de navegação"`
  - [x] 5.2 Criar função `closeMenu()` no script: remove `nav-panel--open`, `nav-menu-overlay--visible`, `nav-body-lock`; atualiza `aria-expanded="false"` e `aria-label="Abrir menu de navegação"`; devolve foco ao `nav-toggle`
  - [x] 5.3 Substituir o listener de `click` no `nav-toggle` para chamar `openMenu()` / `closeMenu()` conforme o estado atual
  - [x] 5.4 Adicionar listener de `click` no `nav-menu-overlay` para chamar `closeMenu()`
  - [x] 5.5 Adicionar listener de `keydown` no `document` para chamar `closeMenu()` quando `key === 'Escape'` e o menu estiver aberto

- [x] 6. Fix — ícone X no botão hambúrguer (Bug 1 — feedback visual)
  - [x] 6.1 Adicionar CSS para transformar as três linhas em X quando `aria-expanded="true"`: `span:nth-child(1) { transform: translateY(6px) rotate(45deg) }`, `span:nth-child(2) { opacity: 0 }`, `span:nth-child(3) { transform: translateY(-6px) rotate(-45deg) }`
  - [x] 6.2 Garantir que a transição do ícone respeita `@media (prefers-reduced-motion: reduce)`

- [x] 7. Fix — títulos completos no mobile (Bug 2)
  - [x] 7.1 No breakpoint `@media (max-width: 767px)` do `NavigationMenu.astro`, adicionar regra `.nav-item-title { white-space: normal; word-break: break-word; overflow: visible; max-width: none }`
  - [x] 7.2 Verificar que `.nav-chapter-link` e `.nav-section-link` em mobile permitem que o texto filho quebre linha (ajustar `align-items` se necessário para `align-items: flex-start`)

- [x] 8. Fix — títulos completos no tablet (Bug 3)
  - [x] 8.1 No breakpoint `@media (min-width: 768px) and (max-width: 1024px)` do `NavigationMenu.astro`, substituir as regras de `.nav-item-title` por `white-space: normal; word-break: break-word; max-width: none; overflow: visible`

- [x] 9. Fix Checking: verificar que os seis defeitos foram corrigidos
  - [x] 9.1 Verificar que pressionar Escape com menu aberto chama `closeMenu()` e remove `nav-panel--open`
  - [x] 9.2 Verificar que clicar no overlay chama `closeMenu()` e remove `nav-panel--open`
  - [x] 9.3 Verificar que `aria-expanded` e `aria-label` do `nav-toggle` refletem corretamente o estado do menu
  - [x] 9.4 Verificar que `document.body.classList.contains('nav-body-lock')` é `true` com menu aberto e `false` com menu fechado
  - [x] 9.5 Verificar que `.nav-menu-overlay` tem `opacity: 1` com menu aberto e `opacity: 0` com menu fechado
  - [x] 9.6 Verificar que `#nav-toggle` está dentro de `.site-header` no DOM
  - [x] 9.7 Verificar que `.nav-item-title` em mobile não tem `max-width` fixo nem `white-space: nowrap`
  - [x] 9.8 Verificar que `.nav-item-title` em tablet não tem `max-width: 140px`

- [x] 10. Preservation Checking: verificar que não há regressões
  - [x] 10.1 Verificar que em viewport desktop (≥ 1025px) o `nav-panel` continua com `display: block` e `nav-toggle` não é visível
  - [x] 10.2 Verificar que em viewport tablet (768–1024px) o `nav-panel` continua sempre visível e `nav-toggle` não é visível
  - [x] 10.3 Verificar que clicar em `.nav-category-btn` continua alternando o estado de colapso da categoria
  - [x] 10.4 Verificar que o estado de colapso das categorias continua sendo persistido e carregado do `localStorage` (`ibbook_nav_categories`)
  - [x] 10.5 Verificar que o `site-header` continua exibindo título do site e `ThemeToggle` em todas as viewports
  - [x] 10.6 Verificar que abrir/fechar o `GlossaryPanel` não interfere com o estado do menu mobile (e vice-versa)
  - [x] 10.7 Verificar que `nav-body-lock` e `glossary-body-lock` são classes independentes e não conflitam
