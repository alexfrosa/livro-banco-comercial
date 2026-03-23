# Requirements Document

## Introduction

Esta feature consolida os 78 capítulos atuais (00–77) do livro interativo de banco comercial em 29 capítulos organizados em 12 partes temáticas, sem perda de conteúdo. Inclui também a criação de 1 capítulo novo (Cap. 13 — Títulos de capitalização). A consolidação envolve renomear pastas, mesclar arquivos MDX, atualizar frontmatter, corrigir referências cruzadas, migrar o progress tracking no localStorage e atualizar os testes de estrutura.

## Glossário

- **Chapter_Consolidator**: processo (manual ou automatizado) responsável por mover, renomear e mesclar os arquivos de capítulo
- **Content_File**: arquivo `.mdx` de seção dentro de uma pasta de capítulo
- **Index_File**: arquivo `index.md` de metadados de capítulo (frontmatter: `title`, `order`, `description`, `part`, `partOrder`)
- **Frontmatter**: bloco YAML delimitado por `---` no início de arquivos `.md` e `.mdx`
- **Cross_Reference**: menção textual a outro capítulo dentro de um arquivo `.mdx` (ex.: "consulte o cap. 13")
- **Progress_Store**: objeto JSON persistido em `localStorage` sob a chave `ibbook_progress`, com campos `visitedSections` (array de slugs) e `lastVisited` (string ou null)
- **Section_Slug**: identificador de seção no formato `<chapter-slug>/<section-file-slug>` usado no Progress_Store
- **Part**: agrupamento temático de capítulos, identificado pelo campo `part` no Index_File
- **partOrder**: campo numérico no Index_File que define a ordem de exibição da Parte na navegação
- **Migration_Script**: utilitário TypeScript em `src/utils/` que converte Section_Slugs antigos para novos no Progress_Store
- **Slug_Map**: estrutura de dados que mapeia cada Section_Slug antigo para o Section_Slug novo correspondente

---

## Requisitos

### Requisito 1 — Estrutura de pastas dos 29 capítulos consolidados

**User Story:** Como mantenedor do livro, quero que os 78 capítulos atuais sejam reorganizados em 29 pastas numeradas de 01 a 29, para que a estrutura de diretórios reflita a nova organização temática.

#### Critérios de Aceitação

1. THE Chapter_Consolidator SHALL criar exatamente 29 pastas em `content/chapters/`, nomeadas `01-<slug>` a `29-<slug>`, com zero-padding de dois dígitos.
2. WHEN a consolidação for concluída, THE Chapter_Consolidator SHALL remover todas as 78 pastas originais (00–77) de `content/chapters/`.
3. THE Chapter_Consolidator SHALL preservar todos os Content_Files existentes, movendo-os para a pasta do capítulo consolidado correspondente conforme o mapeamento aprovado.
4. IF uma pasta de capítulo de destino já existir, THEN THE Chapter_Consolidator SHALL mesclar os Content_Files nela sem sobrescrever arquivos com nomes idênticos.
5. THE Chapter_Consolidator SHALL criar a pasta `content/chapters/13-titulos-capitalizacao/` como capítulo novo, sem origem em capítulos existentes.

---

### Requisito 2 — Index_Files dos capítulos consolidados

**User Story:** Como mantenedor do livro, quero que cada capítulo consolidado tenha um `index.md` com frontmatter completo e correto, para que a navegação e a ordenação funcionem corretamente.

#### Critérios de Aceitação

1. THE Chapter_Consolidator SHALL criar ou atualizar o Index_File de cada um dos 29 capítulos com os campos `title`, `order`, `description`, `part` e `partOrder`.
2. THE Chapter_Consolidator SHALL atribuir ao campo `order` o número inteiro correspondente ao novo número do capítulo (1 a 29).
3. THE Chapter_Consolidator SHALL atribuir ao campo `partOrder` um inteiro de 1 a 12 correspondente à Parte temática do capítulo, conforme a tabela de mapeamento.
4. THE Chapter_Consolidator SHALL atribuir ao campo `part` uma string no formato `"Parte <N> — <Título da Parte>"` consistente com os demais capítulos da mesma Parte.
5. IF o capítulo consolidado originar-se de múltiplos capítulos antigos, THEN THE Chapter_Consolidator SHALL compor o campo `description` do Index_File combinando os temas dos capítulos de origem.

---

### Requisito 3 — Renumeração e reordenação dos Content_Files

**User Story:** Como mantenedor do livro, quero que os arquivos `.mdx` dentro de cada capítulo consolidado sejam renumerados sequencialmente, para que a ordem de leitura dentro do capítulo seja coerente.

#### Critérios de Aceitação

1. THE Chapter_Consolidator SHALL renomear os Content_Files de cada capítulo consolidado com prefixo sequencial `NN-` (01, 02, 03…), preservando o slug descritivo original.
2. THE Chapter_Consolidator SHALL atualizar o campo `order` no Frontmatter de cada Content_File para refletir sua nova posição sequencial dentro do capítulo consolidado.
3. WHEN múltiplos capítulos antigos forem mesclados em um único capítulo novo, THE Chapter_Consolidator SHALL ordenar os Content_Files resultantes primeiro pela ordem do capítulo de origem, depois pela ordem original da seção.
4. THE Chapter_Consolidator SHALL garantir que não existam dois Content_Files com o mesmo valor de `order` dentro de um mesmo capítulo consolidado.
5. THE Chapter_Consolidator SHALL garantir que não existam dois Content_Files com o mesmo nome de arquivo dentro de um mesmo capítulo consolidado.

---

### Requisito 4 — Capítulo novo: Títulos de Capitalização (Cap. 13)

**User Story:** Como leitor do livro, quero um capítulo dedicado a títulos de capitalização, para que eu entenda esse produto bancário que não estava coberto anteriormente.

#### Critérios de Aceitação

1. THE Chapter_Consolidator SHALL criar a pasta `content/chapters/13-titulos-capitalizacao/` com um Index_File contendo `title: "Capítulo 13 — Títulos de Capitalização"`, `order: 13`, `part: "Parte VI — Seguros, Capitalização e Consórcio"` e `partOrder: 6`.
2. THE Chapter_Consolidator SHALL criar ao menos um Content_File em `content/chapters/13-titulos-capitalizacao/` com Frontmatter válido (`title` e `order` obrigatórios).
3. THE Content_File do capítulo 13 SHALL conter conteúdo original em pt-BR cobrindo: definição de título de capitalização, modalidades (tradicional, instrumento de garantia, filantropia premiável), sorteios, resgate, regulação SUSEP e comparação com poupança.
4. WHEN o capítulo 13 for renderizado, THE livro SHALL exibi-lo entre o capítulo 12 (Seguros) e o capítulo 14 (Consórcio) na navegação.

---

### Requisito 5 — Atualização de referências cruzadas

**User Story:** Como leitor do livro, quero que as referências a outros capítulos dentro do conteúdo apontem para os novos números de capítulo, para que eu não seja direcionado a capítulos inexistentes.

#### Critérios de Aceitação

1. THE Chapter_Consolidator SHALL identificar todas as ocorrências de referências textuais no formato `cap. NN`, `Cap. NN` ou `capítulo NN` nos Content_Files.
2. WHEN uma referência textual apontar para um número de capítulo antigo (00–77), THE Chapter_Consolidator SHALL substituí-la pelo novo número de capítulo correspondente conforme o mapeamento aprovado.
3. THE Chapter_Consolidator SHALL preservar o texto ao redor da referência, alterando apenas o número do capítulo.
4. IF um capítulo antigo referenciado não tiver mapeamento para um capítulo novo (capítulo removido ou não mapeado), THEN THE Chapter_Consolidator SHALL sinalizar a referência com um comentário `<!-- TODO: verificar referência -->` no arquivo.
5. THE Chapter_Consolidator SHALL processar referências cruzadas em todos os 29 capítulos consolidados, incluindo o capítulo 13 novo.

---

### Requisito 6 — Migração do Progress_Store no localStorage

**User Story:** Como leitor que já tem progresso salvo, quero que meu progresso de leitura seja migrado automaticamente para os novos slugs, para que eu não perca o histórico de leitura após a consolidação.

#### Critérios de Aceitação

1. THE Migration_Script SHALL ler o Progress_Store existente em `localStorage` sob a chave `ibbook_progress` ao carregar a página pela primeira vez após a consolidação.
2. THE Migration_Script SHALL converter cada Section_Slug antigo presente em `visitedSections` para o Section_Slug novo correspondente usando o Slug_Map.
3. WHEN um Section_Slug antigo não tiver correspondência no Slug_Map, THE Migration_Script SHALL descartar esse slug sem lançar erro.
4. THE Migration_Script SHALL atualizar o campo `lastVisited` para o Section_Slug novo correspondente, ou para `null` se o slug antigo não tiver mapeamento.
5. THE Migration_Script SHALL persistir o Progress_Store migrado de volta em `localStorage` sob a mesma chave `ibbook_progress`.
6. THE Migration_Script SHALL executar a migração no máximo uma vez por navegador, usando uma chave de versão `ibbook_progress_version` no localStorage para controle de idempotência.
7. IF o Progress_Store estiver ausente ou corrompido (JSON inválido), THEN THE Migration_Script SHALL inicializar um Progress_Store vazio sem lançar erro.
8. THE Migration_Script SHALL funcionar em modo degradado (sem lançar exceção) quando o `localStorage` estiver indisponível (modo privado, SecurityError).

---

### Requisito 7 — Slug_Map completo e correto

**User Story:** Como desenvolvedor, quero um Slug_Map que cubra todos os Section_Slugs antigos, para que a migração de progresso e os testes possam verificar a completude do mapeamento.

#### Critérios de Aceitação

1. THE Slug_Map SHALL conter uma entrada para cada Section_Slug antigo derivado dos 78 capítulos originais (00–77).
2. THE Slug_Map SHALL mapear cada Section_Slug antigo para o Section_Slug novo no formato `<novo-chapter-slug>/<section-file-slug>`.
3. THE Slug_Map SHALL ser exportado como constante TypeScript tipada (`Record<string, string>`) a partir de `src/utils/chapterSlugMap.ts`.
4. FOR ALL Section_Slugs antigos no Slug_Map, o Section_Slug novo correspondente SHALL referenciar um Content_File que existe em `content/chapters/`.
5. THE Slug_Map SHALL ser a única fonte de verdade para o mapeamento de slugs — Migration_Script e testes SHALL importá-lo do mesmo módulo.

---

### Requisito 8 — Atualização dos testes de estrutura de conteúdo

**User Story:** Como desenvolvedor, quero que os testes de estrutura de conteúdo validem os 29 capítulos consolidados, para que regressões estruturais sejam detectadas automaticamente.

#### Critérios de Aceitação

1. THE Chapter_Consolidator SHALL atualizar `src/tests/content-structure.test.ts` para validar a existência das pastas dos capítulos 01 a 29 em vez dos capítulos 47–67.
2. THE testes SHALL verificar que cada um dos 29 capítulos possui um Index_File com `title`, `order`, `description`, `part` e `partOrder` não-vazios.
3. THE testes SHALL verificar que o campo `order` em cada Index_File corresponde ao número do capítulo (1 a 29).
4. THE testes SHALL verificar que o campo `partOrder` em cada Index_File está no intervalo [1, 12].
5. THE testes SHALL verificar que todos os Content_Files dos 29 capítulos possuem `title` e `order` não-vazios no Frontmatter.
6. THE testes SHALL incluir ao menos um teste property-based (fast-check, mínimo 100 runs) que valide o Frontmatter de um subconjunto aleatório de capítulos consolidados.
7. THE testes SHALL incluir um teste que verifica que o Slug_Map cobre todos os Section_Slugs derivados dos capítulos originais 00–77.
8. WHEN os testes forem executados com `npm run test`, THE suite SHALL passar sem erros após a consolidação.

---

### Requisito 9 — Integridade do build Astro após consolidação

**User Story:** Como mantenedor do livro, quero que o build do Astro continue funcionando após a consolidação, para que o site seja publicado corretamente no GitHub Pages.

#### Critérios de Aceitação

1. WHEN `npm run build` for executado após a consolidação, THE Astro_Builder SHALL concluir sem erros.
2. THE Astro_Builder SHALL gerar rotas estáticas para todas as seções dos 29 capítulos consolidados.
3. THE Astro_Builder SHALL gerar a rota estática para o capítulo 13 (Títulos de Capitalização) com ao menos uma seção.
4. THE Astro_Builder SHALL gerar o sitemap incluindo as URLs de todos os 29 capítulos.
5. IF algum Content_File tiver Frontmatter inválido (ausência de `title` ou `order`), THEN THE Astro_Builder SHALL ignorar esse arquivo e continuar o build sem falha, conforme o comportamento existente em `[...slug].astro`.

---

### Requisito 10 — Navegação por Partes na interface

**User Story:** Como leitor do livro, quero que a navegação lateral exiba os capítulos agrupados pelas 12 Partes temáticas, para que eu possa localizar rapidamente o tema que desejo estudar.

#### Critérios de Aceitação

1. THE NavigationMenu SHALL agrupar os capítulos por Parte usando o campo `part` do Index_File, exibindo o título da Parte como cabeçalho de grupo.
2. THE NavigationMenu SHALL ordenar as Partes pelo campo `partOrder` do Index_File em ordem crescente.
3. THE NavigationMenu SHALL ordenar os capítulos dentro de cada Parte pelo campo `order` do Index_File em ordem crescente.
4. WHILE o campo `partOrder` não estiver presente no Index_File de um capítulo, THE NavigationMenu SHALL exibir esse capítulo em um grupo "Sem Parte" ao final da lista.
5. THE contentLoader SHALL expor o campo `partOrder` no tipo `ChapterMeta` para que o NavigationMenu possa utilizá-lo.

---

### Requisito 11 — Preservação total do conteúdo existente

**User Story:** Como leitor do livro, quero que nenhum conteúdo dos 78 capítulos originais seja perdido durante a consolidação, para que todo o conhecimento permaneça acessível.

#### Critérios de Aceitação

1. THE Chapter_Consolidator SHALL garantir que o número total de Content_Files após a consolidação seja igual ao número total de Content_Files antes da consolidação, acrescido dos arquivos do capítulo 13 novo.
2. FOR ALL Content_Files existentes antes da consolidação, o conteúdo textual (body) SHALL ser preservado integralmente no Content_File correspondente após a consolidação.
3. THE Chapter_Consolidator SHALL preservar todos os componentes MDX importados (simulações, diagramas) referenciados nos Content_Files originais.
4. THE Chapter_Consolidator SHALL preservar os campos `simulation` e `diagram` no Frontmatter dos Content_Files que os possuíam originalmente.
5. THE testes SHALL incluir um teste de preservação que verifica que nenhum Content_File original foi perdido, comparando a lista de arquivos antes e depois da consolidação via Slug_Map.
