# Plano de Implementação: chapter-categories

## Visão Geral

Agrupar os 47 capítulos por categoria (`part`) na navegação lateral e na página inicial, estendendo `contentLoader.ts`, `NavigationMenu.astro` e `index.astro` sem quebrar compatibilidade retroativa.

## Tarefas

- [x] 1. Estender `contentLoader.ts` — campo `part` e função `generateCategoryNavItems`
  - [x] 1.1 Adicionar campo `part?: string` à interface `ChapterMeta` e ao retorno de `parseFrontmatter`
    - Ler o campo `part` no loop de parsing existente (mesmo padrão dos outros campos opcionais)
    - Preservar o valor exato sem transformação; retornar `undefined` quando ausente ou vazio
    - _Requisitos: 1.1, 1.3, 1.4_

  - [ ]* 1.2 Escrever teste de propriedade para round-trip do campo `part`
    - **Propriedade 1: Round-trip do campo `part`**
    - **Valida: Requisitos 1.1, 1.4**

  - [x] 1.3 Implementar `toCategorySlug(part: string): string` (utilitário interno)
    - Converter para kebab-case: lowercase, remover acentos, substituir espaços e caracteres especiais por `-`, colapsar hífens múltiplos
    - _Requisitos: 2.6_

  - [x] 1.4 Implementar e exportar `generateCategoryNavItems` e a interface `CategoryNavItem`
    - Agrupar capítulos por `part` mantendo ordem de primeira aparição (Map)
    - Capítulos sem `part` (ou `part` vazio) vão para grupo `{ title: '', slug: 'sem-categoria' }` ao final
    - Ordenar grupos pelo `order` mínimo do grupo; ordenar `children` por `order` crescente
    - Cada `CategoryNavItem`: `{ title, slug, url: '#', children: NavItem[] }`
    - _Requisitos: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ]* 1.5 Escrever testes unitários para `generateCategoryNavItems` e `toCategorySlug`
    - Lista vazia → `[]`
    - Todos sem `part` → um único grupo ao final com `title: ''`
    - Todos na mesma `part` → um único `CategoryNavItem`
    - `toCategorySlug` com acentos e parênteses
    - _Requisitos: 2.1, 2.2, 2.5_

  - [ ]* 1.6 Escrever testes de propriedade para `generateCategoryNavItems`
    - **Propriedade 2: Invariante de agrupamento e forma do CategoryNavItem**
    - **Valida: Requisitos 2.1, 2.2, 2.6**
    - **Propriedade 3: Ordenação dos grupos por ordem do primeiro capítulo**
    - **Valida: Requisito 2.3**
    - **Propriedade 4: Ordenação dos capítulos dentro de cada grupo**
    - **Valida: Requisito 2.4**
    - **Propriedade 10: URLs de capítulos e seções não são alteradas**
    - **Valida: Requisito 8.4**

- [x] 2. Checkpoint — garantir que todos os testes passam antes de prosseguir
  - Garantir que todos os testes passam. Perguntar ao usuário se houver dúvidas.

- [x] 3. Atualizar `NavigationMenu.astro` — renderização de grupos colapsáveis
  - [x] 3.1 Adicionar lógica de detecção de `CategoryNavItem` e renderizar estrutura HTML dos grupos
    - Detectar categoria: item tem `children` e pelo menos um filho tem `children` próprios
    - Renderizar `<li class="nav-category" data-category-slug="...">` com `<button>` (`aria-expanded`, `aria-controls`, `aria-label`) e `<ul id="nav-cat-...">` para os capítulos filhos
    - Manter a renderização existente de capítulos e seções dentro de cada grupo
    - Preservar `data-visited-slug` nos itens de seção dentro dos grupos
    - _Requisitos: 3.1, 3.2, 3.3, 3.4, 4.1, 4.3, 4.4, 4.8, 7.1, 7.3, 7.4, 8.1, 8.3_

  - [x] 3.2 Adicionar estilos CSS para grupos de categoria
    - Classes: `nav-category`, `nav-category-btn`, `nav-category-label`, `nav-category-chevron`, `nav-category--collapsed`, `nav-category--active`
    - `Category_Label` visualmente distinto dos itens de capítulo (fonte, cor, tamanho)
    - Destaque da categoria ativa visualmente diferente do destaque de capítulo ativo
    - _Requisitos: 3.3, 5.1, 5.2_

  - [x] 3.3 Adicionar script client-side de colapso/expansão com persistência em localStorage
    - Na inicialização: ler `ibbook_nav_categories`; expandir a categoria do capítulo ativo (sobrepõe estado persistido); aplicar estados aos demais grupos
    - No clique: alternar `aria-expanded`, toggle de `nav-category--collapsed` no `<li>`, persistir no localStorage
    - `try/catch` silencioso para localStorage indisponível ou JSON corrompido
    - `updateVisitedIndicators()` permanece inalterada
    - _Requisitos: 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 8.2, 8.3_

  - [ ]* 3.4 Escrever testes unitários estruturais para `NavigationMenu.astro`
    - Source contém `aria-expanded` e `aria-controls`
    - Source contém `ibbook_nav_categories`
    - Source contém `updateVisitedIndicators`
    - Chave `ibbook_progress` não foi alterada
    - _Requisitos: 4.6, 4.8, 7.4, 8.2, 8.3_

  - [ ]* 3.5 Escrever testes de propriedade para comportamentos do NavigationMenu
    - **Propriedade 5: Compatibilidade retroativa com `NavItem[]` simples**
    - **Valida: Requisito 3.5**
    - **Propriedade 6: Toggle de colapso é idempotente em dois cliques**
    - **Valida: Requisito 4.2**
    - **Propriedade 7: Categoria do capítulo ativo é auto-expandida**
    - **Valida: Requisito 4.5**
    - **Propriedade 8: Category_Label da categoria ativa recebe destaque**
    - **Valida: Requisitos 5.1, 5.3**
    - **Propriedade 9: Indicadores de seção visitada preservados dentro de categorias**
    - **Valida: Requisitos 8.1, 8.3**

- [x] 4. Checkpoint — garantir que todos os testes passam antes de prosseguir
  - Garantir que todos os testes passam. Perguntar ao usuário se houver dúvidas.

- [x] 5. Atualizar `index.astro` — lista de capítulos agrupada por categoria
  - [x] 5.1 Importar `generateCategoryNavItems` e substituir a lista flat por estrutura agrupada
    - Passar `chapters` para `generateCategoryNavItems` para obter os grupos
    - Substituir `<ol class="chapters-list">` flat por iteração sobre grupos: renderizar `<h3 class="category-label">` antes de cada grupo (omitir quando `title` vazio), seguido dos capítulos do grupo
    - Preservar a numeração sequencial global dos capítulos e a ordenação existente
    - _Requisitos: 6.1, 6.2, 6.3, 6.4_

  - [x] 5.2 Adicionar estilos CSS para `category-label` na landing page
    - `category-label` visualmente distinto dos títulos de capítulo (`chapter-title`)
    - _Requisito: 6.3_

- [x] 6. Checkpoint final — garantir que todos os testes passam
  - Garantir que todos os testes passam, incluindo `preservation.test.ts`. Perguntar ao usuário se houver dúvidas.

## Notas

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada tarefa referencia requisitos específicos para rastreabilidade
- Os testes de preservação existentes (`preservation.test.ts`) devem continuar passando sem modificação
- Todos os testes de propriedade usam `fast-check` com mínimo de 100 iterações
- Arquivo de testes: `src/tests/chapterCategories.test.ts`
