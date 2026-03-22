# chapter-link-404 — Implementation Tasks

## Tasks

- [ ] 1. Escrever testes exploratórios (código não corrigido)
  - [ ] 1.1 Criar arquivo de testes `src/utils/contentLoader.test.ts`
  - [ ] 1.2 Escrever teste unitário: capítulo com uma seção → url do capítulo deve ser `/{chapterSlug}/{sectionSlug}` (falha no código original, confirmando o bug)
  - [ ] 1.3 Escrever teste unitário: capítulo com múltiplas seções → url deve apontar para seção de menor `order` (falha no código original)
  - [ ] 1.4 Escrever teste unitário: capítulo sem seções → url deve ser `/{chapterSlug}` (passa no código original — fallback)
  - [ ] 1.5 Executar testes e confirmar que 1.2 e 1.3 falham, validando a causa raiz

- [ ] 2. Corrigir `generateNavItems` em `src/utils/contentLoader.ts`
  - [ ] 2.1 Quando `sortedSections.length > 0`, usar `generateSectionUrl(chapter.slug, sortedSections[0].slug)` como URL do capítulo
  - [ ] 2.2 Quando `sortedSections.length === 0`, manter `/${chapter.slug}` como fallback
  - [ ] 2.3 Executar os testes exploratórios e confirmar que todos passam após a correção

- [ ] 3. Escrever testes de preservação
  - [ ] 3.1 Escrever teste: URLs de seções filhas (`children`) não são alteradas pela correção
  - [ ] 3.2 Escrever teste: ordenação de capítulos e seções por `order` ascendente é preservada
  - [ ] 3.3 Escrever teste baseado em propriedade: para qualquer capítulo com seções, `navItem.url === generateSectionUrl(slug, sortedSections[0].slug)`
  - [ ] 3.4 Escrever teste baseado em propriedade: para qualquer seção filha, `child.url === generateSectionUrl(chapterSlug, sectionSlug)`
  - [ ] 3.5 Executar todos os testes e confirmar que passam
