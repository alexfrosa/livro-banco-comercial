# Implementation Plan

- [x] 1. Escrever teste de exploração da condição de bug
  - **Property 1: Bug Condition** - Astro desatualizado, link home ausente e título ausente no header
  - **CRITICAL**: Este teste DEVE FALHAR no código não corrigido — a falha confirma que os bugs existem
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: Este teste codifica o comportamento esperado — ele validará a correção quando passar após a implementação
  - **GOAL**: Expor contraexemplos que demonstram os três bugs
  - **Scoped PBT Approach**: Para bugs determinísticos, escopar a propriedade aos casos concretos de falha para garantir reprodutibilidade
  - Bug 1: Verificar que `package.json` declara `"astro": "^4.0.0"` (deve falhar — versão desatualizada)
  - Bug 2: Renderizar `NavigationMenu` com `items=[]` e `currentUrl="/"` e verificar que nenhum `<a href="/">` está presente (deve falhar — link home ausente)
  - Bug 3: Renderizar `BaseLayout` e verificar que `.site-header` não contém texto de título além do `ThemeToggle` (deve falhar — título ausente)
  - Executar o teste no código NÃO corrigido
  - **EXPECTED OUTCOME**: Teste FALHA (isso é correto — prova que os bugs existem)
  - Documentar contraexemplos encontrados para entender a causa raiz
  - Marcar tarefa como completa quando o teste estiver escrito, executado e a falha documentada
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Escrever testes de preservação (ANTES de implementar a correção)
  - **Property 2: Preservation** - Comportamentos existentes inalterados
  - **IMPORTANT**: Seguir a metodologia observation-first
  - Observar: `NavigationMenu` com `items` reais navega para URLs corretas no código não corrigido
  - Observar: `ThemeToggle` está presente e funcional no header no código não corrigido
  - Observar: menu hambúrguer mobile funciona corretamente no código não corrigido
  - Escrever testes baseados em propriedades: para qualquer lista de `navItems`, os itens existentes continuam navegando para suas URLs corretas (de Preservation Requirements no design)
  - Escrever testes baseados em propriedades: para qualquer prop `title`, o `ThemeToggle` continua presente no header
  - Verificar que os testes PASSAM no código não corrigido
  - **EXPECTED OUTCOME**: Testes PASSAM (confirma o comportamento de baseline a preservar)
  - Marcar tarefa como completa quando os testes estiverem escritos, executados e passando no código não corrigido
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. Corrigir os três problemas de UI

  - [x] 3.1 Atualizar Astro e integrações no package.json
    - Atualizar `"astro": "^4.0.0"` → `"astro": "^6.0.0"` em `package.json`
    - Atualizar `"@astrojs/mdx": "^3.0.0"` → `"^4.0.0"` em `package.json`
    - Atualizar `"@astrojs/preact": "^3.0.0"` → `"^4.0.0"` em `package.json`
    - Atualizar `"@astrojs/sitemap": "^3.0.0"` → versão compatível com Astro 6 em `package.json`
    - Verificar `astro.config.mjs` para breaking changes na API `defineConfig` entre 4.x e 6.x
    - Executar `npm install` para instalar as versões atualizadas
    - _Bug_Condition: isBugCondition({ context: 'install' }) onde astroVersionInPackageJson MATCHES '^4\\.0\\.0'_
    - _Expected_Behavior: npm install instala astro@6.x com integrações compatíveis_
    - _Preservation: conteúdo MDX continua renderizando corretamente após atualização_
    - _Requirements: 2.1, 3.1_

  - [x] 3.2 Adicionar link "Home" no NavigationMenu
    - Abrir `src/components/NavigationMenu.astro`
    - Inserir item fixo `<li class="nav-chapter nav-home">` com `<a href="/">` antes do `{items.map(...)}`
    - Aplicar `aria-current="page"` quando `currentUrl === '/'`
    - Reutilizar classes CSS existentes (`nav-chapter-link`, `nav-active`) para consistência visual
    - _Bug_Condition: isBugCondition({ context: 'navigation' }) onde navPanelRendered = true AND NOT homeEntryPresentInNavPanel_
    - _Expected_Behavior: NavigationMenu exibe link "Home" como primeiro item apontando para "/"_
    - _Preservation: itens existentes do menu continuam navegando para URLs corretas_
    - _Requirements: 2.2, 3.2, 3.4, 3.5_

  - [x] 3.3 Adicionar título na barra superior do BaseLayout
    - Abrir `src/layouts/BaseLayout.astro`
    - Adicionar `<a href="/" class="site-title">Interactive Banking Book</a>` dentro de `<header class="site-header">`
    - Alterar `justify-content: flex-end` → `justify-content: space-between` no CSS do `.site-header`
    - _Bug_Condition: isBugCondition({ context: 'page_view' }) onde siteHeaderRendered = true AND NOT titlePresentInSiteHeader_
    - _Expected_Behavior: header exibe título do site visível ao lado do ThemeToggle_
    - _Preservation: ThemeToggle continua presente e funcional; layout mobile não quebra_
    - _Requirements: 2.3, 3.3, 3.4, 3.5_

  - [x] 3.4 Verificar que o teste de exploração da condição de bug agora passa
    - **Property 1: Expected Behavior** - Astro 6.x instalado, link home presente, título no header
    - **IMPORTANT**: Re-executar o MESMO teste da tarefa 1 — NÃO escrever um novo teste
    - O teste da tarefa 1 codifica o comportamento esperado
    - Quando este teste passar, confirma que o comportamento esperado foi satisfeito
    - Executar o teste de exploração da condição de bug do passo 1
    - **EXPECTED OUTCOME**: Teste PASSA (confirma que os bugs foram corrigidos)
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.5 Verificar que os testes de preservação ainda passam
    - **Property 2: Preservation** - Comportamentos existentes inalterados
    - **IMPORTANT**: Re-executar os MESMOS testes da tarefa 2 — NÃO escrever novos testes
    - Executar os testes de preservação do passo 2
    - **EXPECTED OUTCOME**: Testes PASSAM (confirma que não há regressões)
    - Confirmar que todos os testes ainda passam após a correção (sem regressões)

- [x] 4. Checkpoint — Garantir que todos os testes passam
  - Garantir que todos os testes passam; perguntar ao usuário se surgirem dúvidas.
