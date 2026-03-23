# Implementation Plan: Chapter Consolidation

## Overview

Reorganizar os 78 capítulos originais (00–77) em 29 capítulos consolidados agrupados em 12 Partes temáticas, sem perda de conteúdo. Inclui criação do capítulo 13 (novo), migração de progresso no localStorage, atualização de código e testes.

## Tasks

- [x] 1. Corrigir design.md com o mapeamento aprovado (12 partes, 29 capítulos)
  - Substituir a tabela de mapeamento do design.md (que usa 17 partes) pelo mapeamento aprovado com 12 partes e 29 capítulos conforme especificado pelo usuário
  - Atualizar os exemplos de `CHAPTER_SLUG_MAP` no design para refletir os slugs corretos (ex.: `02-regulacao-e-arquitetura`, `03-kyc-onboarding-ledger`, etc.)
  - Atualizar a tabela de cobertura de testes para referenciar os novos slugs
  - _Requirements: 1.1, 2.1, 2.3, 2.4_

- [x] 2. Criar `src/utils/chapterSlugMap.ts` com o `CHAPTER_SLUG_MAP` completo
  - [x] 2.1 Criar o arquivo com as entradas da Parte I (caps 01–03) e Parte II (caps 04–05)
    - Parte I: Cap 01 (`01-fundamentos-bancarios`) ← 00+01; Cap 02 (`02-regulacao-e-arquitetura`) ← 02+03; Cap 03 (`03-kyc-onboarding-ledger`) ← 04+05+06+10+11+12
    - Parte II: Cap 04 (`04-contas-bancarias`) ← 07+08+09; Cap 05 (`05-tarifas-bancarias`) ← 20+21+22
    - Exportar `MIGRATION_VERSION = "2"` e `CHAPTER_SLUG_MAP: Record<string, string>`
    - _Requirements: 7.1, 7.2, 7.3_
  - [x] 2.2 Adicionar entradas das Partes III–VI (caps 06–14)
    - Parte III: Cap 06 (`06-pagamentos`) ← 13+14+15; Cap 07 (`07-operacoes-fim-de-dia`) ← 75
    - Parte IV: Cap 08 (`08-cartao-de-credito`) ← 50+51
    - Parte V: Cap 09 (`09-credito`) ← 16+17+18+19; Cap 10 (`10-modalidades-credito`) ← 47+48+49; Cap 11 (`11-credito-avancado`) ← 69
    - Parte VI: Cap 12 (`12-seguros-bancassurance`) ← 61+62; Cap 13 (`13-titulos-capitalizacao`) ← novo; Cap 14 (`14-consorcio`) ← 63+64
    - _Requirements: 7.1, 7.2, 7.3_
  - [x] 2.3 Adicionar entradas das Partes VII–XII (caps 15–29)
    - Parte VII: Cap 15 (`15-investimentos-renda-variavel`) ← 37+38+39+56+57+58; Cap 16 (`16-fundos-previdencia`) ← 52+53+54+55; Cap 17 (`17-suitability-fidc-custodia`) ← 73
    - Parte VIII: Cap 18 (`18-tesouraria-liquidez`) ← 23+24+25; Cap 19 (`19-alm-funding`) ← 26+27+28+29
    - Parte IX: Cap 20 (`20-cambio`) ← 59+60+72
    - Parte X: Cap 21 (`21-gestao-risco`) ← 30+74; Cap 22 (`22-aml-pld-sancoes`) ← 31+32+33+76; Cap 23 (`23-contabilidade-bancaria`) ← 34+35+36+71; Cap 24 (`24-scr-registradoras-compulsorio`) ← 68+70
    - Parte XI: Cap 25 (`25-open-finance`) ← 65+66; Cap 26 (`26-baas-fintechs`) ← 67
    - Parte XII: Cap 27 (`27-falhas-fraudes-reconciliacao`) ← 40+41+42+43+44; Cap 28 (`28-expansao-casos-praticos`) ← 45+46+77; Cap 29 (`29-simulador-integrado`) ← standalone
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 3. Mover e renomear pastas — Partes I e II (caps 01–05)
  - Criar `content/chapters/01-fundamentos-bancarios/` mesclando conteúdo de 00 e 01
  - Criar `content/chapters/02-regulacao-e-arquitetura/` mesclando 02 e 03
  - Criar `content/chapters/03-kyc-onboarding-ledger/` mesclando 04, 05, 06, 10, 11, 12
  - Criar `content/chapters/04-contas-bancarias/` mesclando 07, 08, 09
  - Criar `content/chapters/05-tarifas-bancarias/` mesclando 20, 21, 22
  - Renumerar seções com prefixo `NN-` sequencial dentro de cada capítulo (algoritmo: ordem crescente do capítulo de origem, depois ordem original da seção)
  - _Requirements: 1.1, 1.3, 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4. Mover e renomear pastas — Partes III–VI (caps 06–14)
  - Criar `content/chapters/06-pagamentos/` mesclando 13, 14, 15
  - Criar `content/chapters/07-operacoes-fim-de-dia/` a partir de 75
  - Criar `content/chapters/08-cartao-de-credito/` mesclando 50, 51
  - Criar `content/chapters/09-credito/` mesclando 16, 17, 18, 19
  - Criar `content/chapters/10-modalidades-credito/` mesclando 47, 48, 49
  - Criar `content/chapters/11-credito-avancado/` a partir de 69
  - Criar `content/chapters/12-seguros-bancassurance/` mesclando 61, 62
  - Criar `content/chapters/14-consorcio/` mesclando 63, 64
  - Renumerar seções com prefixo `NN-` sequencial em cada capítulo
  - _Requirements: 1.1, 1.3, 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5. Mover e renomear pastas — Partes VII–XII (caps 15–29)
  - Criar `content/chapters/15-investimentos-renda-variavel/` mesclando 37, 38, 39, 56, 57, 58
  - Criar `content/chapters/16-fundos-previdencia/` mesclando 52, 53, 54, 55
  - Criar `content/chapters/17-suitability-fidc-custodia/` a partir de 73
  - Criar `content/chapters/18-tesouraria-liquidez/` mesclando 23, 24, 25
  - Criar `content/chapters/19-alm-funding/` mesclando 26, 27, 28, 29
  - Criar `content/chapters/20-cambio/` mesclando 59, 60, 72
  - Criar `content/chapters/21-gestao-risco/` mesclando 30, 74
  - Criar `content/chapters/22-aml-pld-sancoes/` mesclando 31, 32, 33, 76
  - Criar `content/chapters/23-contabilidade-bancaria/` mesclando 34, 35, 36, 71
  - Criar `content/chapters/24-scr-registradoras-compulsorio/` mesclando 68, 70
  - Criar `content/chapters/25-open-finance/` mesclando 65, 66
  - Criar `content/chapters/26-baas-fintechs/` a partir de 67
  - Criar `content/chapters/27-falhas-fraudes-reconciliacao/` mesclando 40, 41, 42, 43, 44
  - Criar `content/chapters/28-expansao-casos-praticos/` mesclando 45, 46, 77
  - Criar `content/chapters/29-simulador-integrado/` standalone (sem origem em capítulos existentes — criar estrutura vazia com index.md)
  - Renumerar seções com prefixo `NN-` sequencial em cada capítulo
  - _Requirements: 1.1, 1.3, 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 6. Criar `index.md` de cada capítulo consolidado com frontmatter completo
  - Criar/atualizar o `index.md` dos 29 capítulos com os campos: `title`, `order`, `description`, `part` e `partOrder`
  - Usar o formato exato: `part: "Parte N — Título da Parte"` e `partOrder: N` (1–12)
  - Tabela de referência de `part`/`partOrder` por capítulo:
    - Caps 01–03: `"Parte I — Fundamentos do Banco Comercial"`, partOrder: 1
    - Caps 04–05: `"Parte II — Conta Corrente, Poupança e Tarifas"`, partOrder: 2
    - Caps 06–07: `"Parte III — Pagamentos"`, partOrder: 3
    - Cap 08: `"Parte IV — Cartões de Crédito"`, partOrder: 4
    - Caps 09–11: `"Parte V — Empréstimos e Financiamento"`, partOrder: 5
    - Caps 12–14: `"Parte VI — Seguros, Capitalização e Consórcio"`, partOrder: 6
    - Caps 15–17: `"Parte VII — Investimentos"`, partOrder: 7
    - Caps 18–19: `"Parte VIII — Tesouraria, ALM e Funding"`, partOrder: 8
    - Cap 20: `"Parte IX — Câmbio"`, partOrder: 9
    - Caps 21–24: `"Parte X — Compliance e Contabilidade"`, partOrder: 10
    - Caps 25–26: `"Parte XI — Ecossistema Digital e Regulação"`, partOrder: 11
    - Caps 27–29: `"Parte XII — Cenários Críticos e Simulador"`, partOrder: 12
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 7. Criar conteúdo do capítulo 13 — Títulos de Capitalização
  - Criar `content/chapters/13-titulos-capitalizacao/index.md` com `title: "Capítulo 13 — Títulos de Capitalização"`, `order: 13`, `part: "Parte VI — Seguros, Capitalização e Consórcio"`, `partOrder: 6`
  - Criar `content/chapters/13-titulos-capitalizacao/01-conceitos.mdx` com frontmatter válido (`title`, `order: 1`) e conteúdo original em pt-BR cobrindo: definição de título de capitalização, modalidades (tradicional, instrumento de garantia, filantropia premiável), sorteios, resgate, regulação SUSEP e comparação com poupança
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 8. Renumerar seções MDX dentro de cada capítulo consolidado
  - Para cada capítulo com múltiplos capítulos de origem: verificar que os arquivos `.mdx` estão com prefixo `NN-` sequencial correto e `order` no frontmatter correspondente ao número do prefixo
  - Garantir unicidade de nomes de arquivo dentro de cada capítulo (adicionar sufixo do capítulo de origem quando houver colisão de slug descritivo)
  - Atualizar o campo `order` no frontmatter de cada Content_File para refletir a nova posição sequencial
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 9. Atualizar referências cruzadas nos arquivos MDX
  - Varrer todos os arquivos `.mdx` dos 29 capítulos em busca de padrões `cap. NN`, `Cap. NN`, `capítulo NN` onde NN é número de capítulo antigo (00–77)
  - Substituir pelo novo número de capítulo conforme o mapeamento aprovado
  - Para referências a capítulos antigos sem mapeamento, adicionar comentário `<!-- TODO: verificar referência -->`
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 10. Remover as 78 pastas originais (00–77) de `content/chapters/`
  - Após confirmar que todos os Content_Files foram movidos para os capítulos consolidados, remover as pastas originais `00-*` a `77-*`
  - Verificar que nenhum arquivo ficou órfão antes de remover
  - _Requirements: 1.2_

- [x] 11. Criar `src/utils/progressMigration.ts`
  - Implementar `migrateProgress(): void` — lê `ibbook_progress` do localStorage, converte slugs via `CHAPTER_SLUG_MAP`, persiste resultado e grava `ibbook_progress_version = "2"`
  - Implementar `readProgressStore(): ProgressStore | null` e `writeProgressStore(store: ProgressStore): void`
  - Tratar todos os casos de erro: localStorage indisponível (SecurityError), JSON inválido, slug sem mapeamento, versão já migrada (no-op)
  - Envolver todos os acessos a localStorage em try/catch (Req 6.8)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_

- [x] 12. Atualizar `contentLoader.ts` para expor `part` e `partOrder` no `ChapterMeta`
  - Adicionar campos opcionais `part?: string` e `partOrder?: number` à interface `ChapterMeta`
  - Atualizar a função de leitura de `index.md` para incluir esses campos no objeto retornado
  - Atualizar `generateCategoryNavItems` para ordenar grupos por `partOrder` crescente (em vez de `minOrder`); capítulos sem `partOrder` vão para grupo "Sem Parte" ao final
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 13. Atualizar navegação para agrupar capítulos por Partes
  - Modificar o componente de navegação lateral para renderizar cabeçalhos de grupo usando o campo `part` de cada capítulo
  - Ordenar grupos por `partOrder` e capítulos dentro de cada grupo por `order`
  - Capítulos sem `partOrder` exibidos em grupo "Sem Parte" ao final da lista
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 14. Checkpoint — verificar estrutura de conteúdo
  - Confirmar que existem exatamente 29 pastas em `content/chapters/` com prefixos `01-` a `29-`
  - Confirmar que não existem pastas com prefixos `00-` a `77-`
  - Confirmar que cada pasta tem `index.md` com todos os campos obrigatórios
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

- [x] 15. Atualizar `src/tests/content-structure.test.ts`
  - [x] 15.1 Substituir testes de existência de pastas (caps 47–67) pelos 29 capítulos consolidados (01–29)
    - Verificar existência das 29 pastas `01-*` a `29-*`
    - Verificar ausência de pastas com prefixo `00`–`77`
    - Verificar existência e conteúdo do capítulo 13 (`13-titulos-capitalizacao/`)
    - _Requirements: 1.1, 1.2, 4.1, 8.1_
  - [ ]* 15.2 Escrever property test para frontmatter dos index.md (Property 1)
    - **Property 1: Frontmatter completo nos index.md consolidados**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
    - Usar `fc.subarray(chapterDirs, { minLength: 1 })`, numRuns: 100
    - Verificar `title`, `order`, `description`, `part`, `partOrder` não-vazios; `order` igual ao número da pasta; `partOrder` em [1,12]; `part` no formato `"Parte N — ..."`
  - [ ]* 15.3 Escrever property test para frontmatter dos Content_Files (Property 2)
    - **Property 2: Frontmatter válido nos Content_Files consolidados**
    - **Validates: Requirements 3.1, 3.2, 3.4, 3.5**
    - Verificar `title` e `order` não-vazios; nome do arquivo começa com `NN-`; `order` igual ao número do prefixo; unicidade de `order` e nomes dentro do capítulo
  - [ ]* 15.4 Escrever property test para completude do Slug_Map (Property 4)
    - **Property 4: Completude do Slug_Map**
    - **Validates: Requirements 7.1**
    - Para cada Section_Slug derivado dos capítulos originais 00–77, verificar que existe entrada no `CHAPTER_SLUG_MAP`
  - [ ]* 15.5 Escrever property test para integridade referencial do Slug_Map (Property 5)
    - **Property 5: Integridade referencial do Slug_Map**
    - **Validates: Requirements 7.4**
    - Para cada valor no `CHAPTER_SLUG_MAP`, verificar que o arquivo `.mdx` correspondente existe em `content/chapters/`
  - [ ]* 15.6 Escrever property test para ordenação da navegação por Partes (Property 10)
    - **Property 10: Ordenação hierárquica da navegação por Partes**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4**
    - Verificar que `generateCategoryNavItems()` retorna grupos ordenados por `partOrder` crescente e capítulos dentro de cada grupo ordenados por `order` crescente
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [x] 16. Criar `src/tests/progressMigration.test.ts`
  - [x] 16.1 Escrever testes de exemplo para migração de progresso
    - Testar migração de slug antigo válido → slug novo correto
    - Testar `lastVisited` migrado corretamente
    - Testar no-op quando `ibbook_progress_version` já é `"2"`
    - Testar inicialização de store vazio quando localStorage está ausente/corrompido
    - Usar `happy-dom` para mock de `localStorage`
    - _Requirements: 6.1, 6.2, 6.4, 6.5, 6.6, 6.7, 6.8_
  - [ ]* 16.2 Escrever property test para round-trip de migração (Property 6)
    - **Property 6: Round-trip de migração do Progress_Store**
    - **Validates: Requirements 6.2, 6.5**
    - Para qualquer `ProgressStore` com slugs antigos válidos, após `migrateProgress()` todos os slugs em `visitedSections` devem ser slugs novos válidos
  - [ ]* 16.3 Escrever property test para descarte de slugs sem mapeamento (Property 7)
    - **Property 7: Descarte de slugs sem mapeamento na migração**
    - **Validates: Requirements 6.3, 6.4**
    - Para qualquer `ProgressStore` com slugs não presentes no `CHAPTER_SLUG_MAP`, após migração esses slugs não devem aparecer em `visitedSections`
  - [ ]* 16.4 Escrever property test para idempotência da migração (Property 8)
    - **Property 8: Idempotência da migração**
    - **Validates: Requirements 6.6**
    - Executar `migrateProgress()` duas vezes deve produzir o mesmo estado que executar uma vez
  - [ ]* 16.5 Escrever property test para robustez com entradas inválidas (Property 9)
    - **Property 9: Robustez da migração com entradas inválidas**
    - **Validates: Requirements 6.7, 6.8**
    - Para qualquer valor inválido em localStorage (null, string vazia, JSON malformado), `migrateProgress()` não deve lançar exceção

- [x] 17. Criar `src/tests/preservation.test.ts`
  - [x] 17.1 Escrever teste de exemplo para preservação de Content_Files
    - Verificar que o número total de Content_Files após consolidação é igual ao total original + arquivos do cap. 13
    - Verificar que cada entrada no `CHAPTER_SLUG_MAP` aponta para um arquivo existente
    - _Requirements: 11.1, 11.5_
  - [ ]* 17.2 Escrever property test para preservação total de Content_Files (Property 3)
    - **Property 3: Preservação total de Content_Files**
    - **Validates: Requirements 1.3, 11.2, 11.3, 11.4**
    - Para qualquer entrada no `CHAPTER_SLUG_MAP`, o arquivo referenciado pelo slug novo deve existir e preservar body, imports MDX e campos `simulation`/`diagram`
  - [ ]* 17.3 Escrever property test para ausência de referências a capítulos antigos (Property 11)
    - **Property 11: Ausência de referências a capítulos antigos**
    - **Validates: Requirements 5.2, 5.4**
    - Para qualquer arquivo `.mdx` nos 29 capítulos, não deve existir padrão `[Cc]ap[ítulo\.]*\s+\d+` referenciando número de capítulo antigo sem o comentário `<!-- TODO: verificar referência -->`

- [x] 18. Checkpoint final — garantir que todos os testes passam e o build funciona
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.
  - Verificar que `npm run build` conclui sem erros e gera rotas para todos os 29 capítulos
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 8.8_

## Notes

- Tasks marcadas com `*` são opcionais e podem ser puladas para MVP mais rápido
- Cada task referencia requisitos específicos para rastreabilidade
- O mapeamento canônico está em `src/utils/chapterSlugMap.ts` — Migration_Script e testes devem importar desse módulo
- Capítulo 29 (`29-simulador-integrado`) é standalone: criar estrutura mínima com `index.md` e ao menos um `.mdx`
- Algoritmo de renumeração: ordenar por número do capítulo de origem (crescente), depois por `order` original da seção
