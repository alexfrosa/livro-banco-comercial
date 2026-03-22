# Plano de Implementação: Seção de Referências

## Visão Geral

Implementação do sistema de referências regulatórias em três camadas: utilitário TypeScript puro (`referencesLoader.ts`), página estática (`referencias.astro`) e componente inline (`Ref.astro`). As tarefas seguem a ordem de dependência: dados → lógica pura + testes → componentes → página → integração.

## Tasks

- [x] 1. Criar o Reference_Registry com entradas iniciais
  - Criar `content/references.yaml` com pelo menos uma referência de cada categoria obrigatória: CMN, BACEN, Lei Federal e Medida Provisória
  - Cada entrada deve conter os campos obrigatórios: `id`, `title`, `issuer`, `category`, `url`
  - Incluir pelo menos duas entradas com `description` e `publishedAt` para validar campos opcionais
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 5.4_

- [x] 2. Implementar `src/utils/referencesLoader.ts`
  - Definir e exportar os tipos `ReferenceCategory` e `ReferenceEntry`
  - Implementar `parseReferences(raw: unknown[]): ReferenceEntry[]` com validação de campos obrigatórios e detecção de IDs duplicados
  - Implementar `lookupReference(entries: ReferenceEntry[], id: string): ReferenceEntry | null`
  - Implementar `groupByCategory(entries: ReferenceEntry[]): Map<string, ReferenceEntry[]>` com entradas ordenadas por título dentro de cada grupo
  - Implementar `referenceAnchor(id: string): string` retornando `"#ref-{id}"`
  - Implementar `referenceHref(id: string, baseUrl?: string): string` retornando `"{baseUrl}/referencias#ref-{id}"`
  - Mensagens de erro devem seguir o formato definido no design (prefixo `[references]`)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.4, 3.2, 5.1, 5.3_

- [x] 3. Escrever testes para `referencesLoader.ts`
  - [x] 3.1 Escrever testes unitários (exemplos e casos de borda)
    - `parseReferences` com array válido retorna entradas corretas
    - `parseReferences` com ID duplicado lança erro contendo o ID conflitante
    - `parseReferences` com array vazio retorna `[]`
    - `parseReferences` aceita referência sem `description` e sem `publishedAt`
    - `parseReferences` lança erro para `publishedAt` com formato inválido
    - `lookupReference` com ID existente retorna a entrada correta
    - `lookupReference` com ID inexistente retorna `null`
    - `groupByCategory` com 3 categorias retorna 3 grupos
    - `referenceAnchor("resolucao-cmn-4966")` retorna `"#ref-resolucao-cmn-4966"`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.4, 3.2, 3.3_
  - [ ]* 3.2 Escrever property test: parsing preserva todos os campos
    - **Property 1: Parsing de referências válidas preserva todos os campos**
    - **Validates: Requirements 1.1, 1.2, 1.3**
  - [ ]* 3.3 Escrever property test: IDs duplicados causam erro
    - **Property 2: IDs duplicados causam erro de build**
    - **Validates: Requirements 1.4**
  - [ ]* 3.4 Escrever property test: agrupamento por categoria é completo e particionado
    - **Property 3: Agrupamento por categoria é completo e particionado**
    - **Validates: Requirements 2.2**
  - [ ]* 3.5 Escrever property test: âncoras são únicas e no formato correto
    - **Property 4: Âncoras são únicas e seguem o formato correto**
    - **Validates: Requirements 2.4**
  - [ ]* 3.6 Escrever property test: lookup de ID válido retorna a referência correta
    - **Property 6: Lookup de ID válido retorna a referência correta**
    - **Validates: Requirements 3.1, 3.4**
  - [ ]* 3.7 Escrever property test: lookup de ID inválido retorna null
    - **Property 7: Lookup de ID inválido retorna null**
    - **Validates: Requirements 3.3**
  - [ ]* 3.8 Escrever property test: referenceHref aponta para a âncora correta
    - **Property 8: href do Inline_Reference_Link aponta para a âncora correta**
    - **Validates: Requirements 3.2**
  - [ ]* 3.9 Escrever property test: aria-label inline segue o formato correto
    - **Property 9: aria-label do Inline_Reference_Link segue o formato correto**
    - **Validates: Requirements 4.1**
  - [ ]* 3.10 Escrever property test: aria-label externo segue o formato correto
    - **Property 10: aria-label dos links externos segue o formato correto**
    - **Validates: Requirements 4.3**
  - [ ]* 3.11 Escrever property test: atualização de URL é refletida no loader
    - **Property 11: Atualização de URL no registry é refletida no loader**
    - **Validates: Requirements 5.3**

- [x] 4. Checkpoint — Garantir que todos os testes de `referencesLoader` passam
  - Executar `npm run test` e confirmar que todos os testes da task 3 passam sem erros

- [x] 5. Implementar `src/components/Ref.astro`
  - Aceitar prop `id: string`
  - Carregar o registry via `referencesLoader` em build time e fazer lookup pelo `id`
  - Lançar erro de build com mensagem `[references] ID de referência não encontrado: "{id}" em {arquivo}` se o ID não existir
  - Renderizar `<a href="{referenceHref(id)}" class="ref-link" aria-label="Ver referência: {title}">{title}</a>`
  - Aplicar estilo visual distinto de links de navegação e links externos (classe `ref-link`)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1_

- [x] 6. Implementar `src/pages/referencias.astro`
  - Carregar e validar o registry via `referencesLoader` em build time
  - Agrupar referências por categoria com `groupByCategory`
  - Renderizar cada categoria como `<section>` com heading e cada referência como `<article>` com âncora `id="ref-{id}"`
  - Para cada referência exibir: título (heading), órgão emissor, descrição (quando presente), link externo com `target="_blank"` e `rel="noopener noreferrer"`
  - Link externo deve ter `aria-label="{title} (abre em nova aba)"`
  - Passar `navItems` ao `BaseLayout` incluindo o item de navegação para `/referencias`
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 4.2, 4.3, 4.4_

- [x] 7. Integrar item de navegação `/referencias` ao NavigationMenu
  - Em `referencias.astro`, construir o `NavItem` para a página de referências e concatená-lo ao array de `navItems` gerado pelo `contentLoader`
  - Garantir que o item aparece no menu em todas as páginas do livro (incluindo `[...slug].astro` e `index.astro`)
  - Atualizar `[...slug].astro` e `index.astro` para incluir o item de referências no `navItems`
  - _Requirements: 2.6_

- [x] 8. Escrever testes estruturais de componente
  - Verificar que `referencias.astro` contém elementos `<section>` e `<article>` no source (Req 4.2)
  - Verificar que `referencias.astro` contém `target="_blank"` nos links externos (Req 2.5)
  - Verificar que `Ref.astro` contém o padrão `aria-label` correto no source (Req 4.1)
  - Verificar que `referencias.astro` contém `aria-label` com `(abre em nova aba)` (Req 4.3)
  - _Requirements: 2.5, 4.1, 4.2, 4.3_

- [x] 9. Validar sitemap e acessibilidade
  - Confirmar que `@astrojs/sitemap` está configurado em `astro.config.mjs` (já deve estar)
  - Verificar que a URL `/referencias` aparece no `sitemap.xml` gerado após build
  - Confirmar que todos os links interativos na References_Page têm `min-height: 44px` para touch targets
  - _Requirements: 2.7, 4.4_
