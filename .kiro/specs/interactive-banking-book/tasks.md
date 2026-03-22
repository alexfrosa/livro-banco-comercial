# Implementation Plan: Interactive Banking Book

## Overview

Implementação de um site estático com Astro + Preact, hospedado no GitHub Pages, que apresenta um livro digital interativo sobre bancos comerciais. As tarefas seguem a ordem de dependência: estrutura do projeto → módulos de lógica pura → componentes UI → conteúdo → CI/CD.

## Tasks

- [x] 1. Inicializar projeto Astro e configurar stack
  - Criar projeto Astro com suporte a MDX e integração Preact
  - Configurar `astro.config.mjs` com `@astrojs/mdx`, `@astrojs/preact` e `@astrojs/sitemap`
  - Instalar dependências: `preact`, `vitest`, `fast-check`, `@testing-library/preact`, `happy-dom`, `mermaid`
  - Configurar `vitest.config.ts` com ambiente `happy-dom` e `fc.configureGlobal({ numRuns: 100 })`
  - Criar estrutura de diretórios conforme design: `src/components/`, `src/layouts/`, `src/pages/`, `src/styles/`, `content/chapters/`, `content/glossary/`
  - _Requirements: 8.1, 8.6, 9.5_

- [x] 2. Implementar variáveis CSS de tema e estilos globais
  - Criar `src/styles/themes.css` com as 5 variáveis de cor primárias, variáveis tipográficas e de espaçamento conforme design
  - Criar `src/styles/global.css` com reset, tipografia base (16px, line-height 1.6), espaçamento de parágrafos (1.2em), largura máxima de texto (65ch), padding mínimo de 24px
  - Configurar Google Fonts (Playfair Display + Inter) com `font-display: swap`
  - Definir escala tipográfica modular (razão 1.25x) para h1, h2, h3
  - Estilizar callouts/blockquotes com borda lateral de 4px e fundo com opacidade reduzida
  - Estilizar imagens com `border-radius: 8px`, `box-shadow` (opacidade ≤ 0.15) e legendas em 0.875em itálico
  - _Requirements: 6.1, 6.5, 10.1, 10.2, 10.3, 10.5, 10.6, 10.8, 10.9, 10.10, 10.12, 10.13_

- [x] 3. Implementar ThemeManager
  - Criar `src/utils/themeManager.ts` com as funções `getTheme`, `setTheme`, `getResolvedTheme` usando `localStorage` com chave `ibbook_theme`
  - Implementar `safeLocalStorageGet`/`safeLocalStorageSet` para modo degradado (localStorage indisponível)
  - Implementar detecção de `prefers-color-scheme` para tema inicial
  - Criar script inline para `<head>` que aplica o tema antes do render (evitar FOUC)
  - [ ]* 3.1 Escrever property test para ThemeManager
    - **Property 15: Round-trip de persistência de tema**
    - **Validates: Requirements 6.2, 6.3**
  - [ ]* 3.2 Escrever testes unitários para ThemeManager
    - Testar detecção de `prefers-color-scheme`, fallback sem localStorage, persistência
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 4. Implementar ProgressTracker
  - Criar `src/utils/progressTracker.ts` com `markVisited`, `getProgress`, `getPercentage`, `reset`, `restore` usando `localStorage` com chave `ibbook_progress`
  - Implementar modo degradado para localStorage indisponível
  - [ ]* 4.1 Escrever property test para round-trip de progresso
    - **Property 4: Round-trip de progresso de leitura**
    - **Validates: Requirements 2.1, 2.2**
  - [ ]* 4.2 Escrever property test para percentual de progresso
    - **Property 5: Cálculo correto do percentual de progresso**
    - **Validates: Requirements 2.4**
  - [ ]* 4.3 Escrever property test para reset de progresso
    - **Property 6: Reset zera completamente o progresso**
    - **Validates: Requirements 2.5**
  - [ ]* 4.4 Escrever testes unitários para ProgressTracker
    - Testar casos de borda: lista vazia, seção duplicada, totalSections = 1
    - _Requirements: 2.1, 2.2, 2.4, 2.5_

- [x] 5. Checkpoint — Garantir que todos os testes dos módulos de lógica passam
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

- [x] 6. Implementar lógica de cálculo da Simulation MoneyCreation
  - Criar `src/utils/moneyCreation.ts` com a função pura `calculateMoneyCreation(deposit, reserveRatio)` retornando `{ moneyMultiplier, totalMoneyCreated, error }`
  - Implementar `validateMoneyCreationInputs` conforme design (deposit: 0 < D ≤ 1.000.000.000; reserveRatio: 0.01 ≤ R ≤ 1.0)
  - [ ]* 6.1 Escrever property test para fórmula do multiplicador monetário
    - **Property 7: Fórmula do multiplicador monetário**
    - **Validates: Requirements 3.3**
  - [ ]* 6.2 Escrever property test para rejeição de inputs inválidos
    - **Property 8: Rejeição de inputs inválidos na Simulation**
    - **Validates: Requirements 3.5**
  - [ ]* 6.3 Escrever property test para reset da Simulation
    - **Property 9: Reset da Simulation restaura valores padrão**
    - **Validates: Requirements 3.4**
  - [ ]* 6.4 Escrever testes unitários para calculateMoneyCreation
    - Testar: reserveRatio = 1.0 (sem multiplicação), deposit = 0.01 (mínimo), valores conhecidos (1000, 0.10) → multiplier 10, total 10000
    - _Requirements: 3.3, 3.4, 3.5_

- [x] 7. Implementar lógica do Glossário
  - Criar `src/utils/glossary.ts` com `filterGlossaryTerms(terms, query)` (case-insensitive em `term` e `definition`) e `lookupGlossaryTerm(terms, id)`
  - [ ]* 7.1 Escrever property test para filtro do glossário
    - **Property 10: Filtro do Glossário retorna apenas termos relevantes**
    - **Validates: Requirements 4.4**
  - [ ]* 7.2 Escrever property test para lookup de definição
    - **Property 11: Lookup de definição de termo**
    - **Validates: Requirements 4.2**
  - [ ]* 7.3 Escrever testes unitários para glossário
    - Testar: query vazia retorna todos, query sem match retorna vazio, lookup de id inexistente retorna null
    - _Requirements: 4.2, 4.4_

- [x] 8. Implementar ContentLoader e geração de rotas
  - Criar `src/utils/contentLoader.ts` com `parseFrontmatter`, `generateNavItems` e `generateSectionUrl`
  - Implementar `generateSectionUrl` produzindo URLs no formato `/chapter-slug/section-slug`
  - Implementar `generateNavItems` ordenando por campo `order` (chapter → section)
  - Implementar tratamento de frontmatter inválido (campos obrigatórios ausentes fazem o build falhar com mensagem clara)
  - [ ]* 8.1 Escrever property test para round-trip de parsing de frontmatter
    - **Property 12: Round-trip de parsing de frontmatter**
    - **Validates: Requirements 8.3, 8.5**
  - [ ]* 8.2 Escrever property test para unicidade de URLs
    - **Property 2: Unicidade de URLs por Seção**
    - **Validates: Requirements 1.6, 11.4**
  - [ ]* 8.3 Escrever property test para ordem hierárquica da navegação
    - **Property 1: Ordem hierárquica da navegação**
    - **Validates: Requirements 1.1**
  - [ ]* 8.4 Escrever property test para cobertura completa do Navigation_Menu
    - **Property 14: Navigation_Menu inclui todos os arquivos de conteúdo**
    - **Validates: Requirements 8.2**
  - [ ]* 8.5 Escrever testes unitários para ContentLoader
    - Testar: arquivo ausente exibe ContentError sem interromper demais seções (Property 13)
    - _Requirements: 8.2, 8.3, 8.4, 8.5_

- [x] 9. Checkpoint — Garantir que todos os testes de lógica e conteúdo passam
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

- [x] 10. Implementar componente NavigationMenu
  - Criar `src/components/NavigationMenu.astro` com `role="navigation"` e `aria-label="Navegação do livro"`
  - Renderizar hierarquia chapter → section ordenada por `order`
  - Marcar item ativo com `aria-current="page"` (somente um item por vez)
  - Exibir indicador visual (ícone de check) em seções visitadas lidas do localStorage via script client-side
  - Implementar comportamento mobile: recolhível via botão hambúrguer com `aria-expanded`
  - Implementar scroll suave via `scrollIntoView` ao clicar em item
  - Estilizar: painel lateral fixo em desktop, compacto em 768–1024px, oculto/recolhível em < 768px
  - [ ]* 10.1 Escrever property test para item ativo no Navigation_Menu
    - **Property 3: Item ativo no Navigation_Menu**
    - **Validates: Requirements 1.3**

- [x] 11. Implementar componente GlossaryPanel
  - Criar `src/components/GlossaryPanel.astro` com `role="complementary"` e `aria-label="Glossário"`
  - Implementar abertura/fechamento sem navegação de página, com retorno de foco ao elemento de origem (`returnFocusRef`)
  - Implementar campo de pesquisa com filtragem em tempo real usando `filterGlossaryTerms`
  - Marcar termos no texto com `<span data-glossary-term>` e estilo visual destacado
  - Implementar fechamento via tecla Escape
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 12. Implementar componente ThemeToggle e integrar ThemeManager
  - Criar `src/components/ThemeToggle.astro` com controle visível (botão acessível) para alternar tema
  - Integrar com `themeManager.ts`: aplicar tema imediatamente ao `<html>` via `data-theme` sem reload
  - Garantir contraste mínimo 4.5:1 no tema escuro para textos, ícones e diagramas
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 13. Implementar componente ProgressTracker (UI)
  - Criar `src/components/ProgressTracker.astro` que exibe percentual de progresso
  - Integrar com `progressTracker.ts`: marcar seção como visitada ao navegar, exibir indicador nas seções visitadas no Navigation_Menu
  - Implementar botão de reset de progresso com confirmação
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 14. Implementar componente SkipLink e região aria-live
  - Criar `src/components/SkipLink.astro` como primeiro elemento focável, visível ao receber foco, oculto nos demais estados
  - Adicionar região `aria-live="polite"` que é atualizada com o título da seção ao navegar
  - [ ]* 14.1 Escrever testes unitários para SkipLink e aria-live
    - Testar: skip link visível ao focar, aria-live atualizado ao navegar (Property 19)
    - _Requirements: 12.3, 12.4_
  - [ ]* 14.2 Escrever property test para região aria-live
    - **Property 19: Região aria-live atualizada ao navegar entre seções**
    - **Validates: Requirements 12.4**

- [x] 15. Implementar Simulation MoneyCreation (Preact Island)
  - Criar `src/components/simulations/MoneyCreation.tsx` como componente Preact com `client:load`
  - Implementar inputs controlados para `deposit` e `reserveRatio` com validação em tempo real usando `validateMoneyCreationInputs`
  - Exibir `moneyMultiplier` e `totalMoneyCreated` calculados via `calculateMoneyCreation`
  - Exibir mensagens de erro inline com `role="alert"` abaixo do campo inválido
  - Implementar botão de reset que restaura `defaultDeposit` e `defaultReserveRatio`
  - Garantir navegação por teclado: Tab entre elementos, Enter/Space para ativar, foco visível em todos os controles
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 16. Implementar DiagramRenderer com Mermaid.js
  - Criar `src/components/DiagramRenderer.astro` que renderiza diagramas Mermaid a partir do campo `content`
  - Implementar Intersection Observer para iniciar animação ao entrar no viewport
  - Garantir atributo `alt` ou `aria-label` não-vazio em todos os diagramas
  - Implementar fallback estático para navegadores sem suporte a CSS animations/SVG
  - Criar diagrama de fluxo de dinheiro entre banco central, bancos comerciais e clientes
  - [ ]* 16.1 Escrever testes unitários para DiagramRenderer
    - Testar: presença de alt/aria-label (Property 22), fallback estático renderizado
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 17. Implementar layouts BaseLayout e ChapterLayout
  - Criar `src/layouts/BaseLayout.astro` com: SkipLink, ThemeToggle, NavigationMenu, `<main role="main">`, região aria-live, script de tema inline no `<head>`, meta tags SEO e Open Graph
  - Criar `src/layouts/ChapterLayout.astro` estendendo BaseLayout com ProgressTracker e GlossaryPanel
  - Implementar transição fade-in (≤ 300ms) ao navegar entre seções, suprimida se `prefers-reduced-motion`
  - Garantir ARIA landmarks: `role="navigation"`, `role="main"`, `role="complementary"` (quando GlossaryPanel visível)
  - [ ]* 17.1 Escrever testes unitários para ARIA landmarks e metadados
    - Testar: presença de landmarks (Property 18), unicidade de title e og:url (Property 16)
    - _Requirements: 11.1, 11.2, 12.1, 12.2_
  - [ ]* 17.2 Escrever property test para ARIA landmarks
    - **Property 18: ARIA landmarks presentes em toda página renderizada**
    - **Validates: Requirements 12.2**
  - [ ]* 17.3 Escrever property test para metadados únicos por página
    - **Property 16: Metadados de página completos e únicos**
    - **Validates: Requirements 11.1, 11.2**

- [x] 18. Implementar rota dinâmica `[...slug].astro` e ContentError
  - Criar `src/pages/[...slug].astro` usando `getStaticPaths` para gerar rotas a partir dos arquivos MDX em `content/chapters/`
  - Implementar URLs semânticas no formato `/chapter-slug/section-slug`
  - Criar componente `ContentError` que exibe mensagem descritiva para seções ausentes sem interromper demais seções
  - Integrar GlossaryPanel: identificar termos no texto e abrir painel ao clicar
  - [ ]* 18.1 Escrever testes unitários para ContentError e rota dinâmica
    - Testar: seção ausente exibe ContentError, demais seções renderizam normalmente (Property 13)
    - _Requirements: 8.4, 11.4_

- [x] 19. Implementar Landing Page (`index.astro`)
  - Criar `src/pages/index.astro` com título do livro, descrição introdutória e call-to-action
  - Listar todos os capítulos disponíveis com título e descrição
  - Implementar lógica client-side: exibir "Continuar leitura" (com link para `lastVisited`) se houver progresso salvo, ou "Começar a leitura" (primeiro capítulo) caso contrário
  - Aplicar design diferenciado: tipografia de display, ilustração/imagem de capa, paleta primária
  - [ ]* 19.1 Escrever property test para landing page e progresso
    - **Property 20: Landing page reflete estado de progresso**
    - **Validates: Requirements 13.3**
  - [ ]* 19.2 Escrever property test para listagem de capítulos
    - **Property 21: Landing page lista todos os capítulos disponíveis**
    - **Validates: Requirements 13.2**
  - [ ]* 19.3 Escrever testes unitários para Landing Page
    - Testar: CTA correto com e sem progresso, listagem completa de capítulos
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [x] 20. Adicionar conteúdo inicial de exemplo (Markdown/MDX)
  - Criar `content/chapters/01-introducao/index.md` e pelo menos uma seção `.mdx` com frontmatter válido
  - Criar `content/chapters/02-criacao-de-dinheiro/index.md` e seção com `simulation: "MoneyCreation"` e `diagram: "money-flow"`
  - Criar `content/glossary/terms.md` com pelo menos 5 termos financeiros (Reserva Fracionária, Multiplicador Monetário, etc.)
  - Validar que o build gera rotas corretas e o Navigation_Menu exibe todos os capítulos/seções
  - _Requirements: 8.1, 8.2, 8.3, 8.5_

- [x] 21. Checkpoint — Garantir que todos os testes passam e o build local funciona
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

- [x] 22. Implementar CI/CD pipeline (GitHub Actions)
  - Criar `.github/workflows/deploy.yml` com trigger em push na branch principal
  - Configurar steps: checkout, setup Node, `npm ci`, `astro build`, deploy para GitHub Pages
  - Garantir que falha no build interrompe o deploy sem sobrescrever versão anterior
  - Configurar geração automática de `sitemap.xml` via `@astrojs/sitemap`
  - [ ]* 22.1 Escrever property test para sitemap
    - **Property 17: Sitemap lista todas as URLs públicas**
    - **Validates: Requirements 11.3**
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 11.3_

- [x] 23. Checkpoint final — Garantir que todos os testes passam e o pipeline está configurado
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

## Notes

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada tarefa referencia os requisitos específicos para rastreabilidade
- Os checkpoints garantem validação incremental a cada fase
- Property tests validam propriedades universais de corretude (fast-check, mínimo 100 iterações)
- Testes unitários validam exemplos específicos e casos de borda
- O build Astro falha em frontmatter inválido (campos obrigatórios ausentes), mas não em conteúdo ausente em runtime
