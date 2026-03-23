# Documento de Requisitos

## Introdução

O livro possui 47 capítulos (00 a 46) listados de forma linear na barra de navegação lateral. Com esse volume, a navegação se torna difícil — o usuário precisa rolar muito para encontrar um capítulo específico e não consegue perceber a estrutura temática do conteúdo.

Os capítulos já possuem um campo `part` no frontmatter de seus arquivos `index.md` (ex: `"Parte 2 — Cadastro e Onboarding (KYC)"`), mas esse campo não é utilizado na navegação. Esta funcionalidade agrupa os capítulos por categoria (parte) na navegação lateral, tornando a estrutura do livro visível e a navegação mais eficiente.

As categorias existentes nos frontmatters são:

- Parte 1 — Fundamentos do Banco (caps. 00–03)
- Parte 2 — Cadastro e Onboarding (KYC) (caps. 04–06)
- Parte 3 — Contas Bancárias (caps. 07–09)
- Parte 4 — Ledger e Contabilidade Operacional (caps. 10–12)
- Parte 5 — Pagamentos e Transferências (caps. 13–15)
- Parte 6 — Crédito (caps. 16–19)
- Parte 7 — Tarifas e Receita (caps. 20–22)
- Parte 8 — Tesouraria e Liquidez (caps. 23–25)
- Parte 9 — ALM e Funding (caps. 26–29)
- Parte 10 — Risco, Compliance e Regulação (caps. 30–33)
- Parte 11 — Contabilidade (caps. 34–36)
- Parte 12 — Investimentos (caps. 37–39)
- Parte 13 — Problemas Reais (caps. 40–44)
- Parte Final — Evolução (caps. 45–46)

## Glossário

- **Navigation_Menu**: Componente `NavigationMenu.astro` que renderiza a barra de navegação lateral do livro.
- **Category_Group**: Agrupamento visual de capítulos relacionados sob um rótulo de categoria (parte) na navegação.
- **Category_Label**: Texto do rótulo que identifica uma categoria na navegação (ex: "Parte 2 — Cadastro e Onboarding (KYC)").
- **Chapter**: Unidade de conteúdo do livro, representada por uma pasta `NN-slug/` com um `index.md` e arquivos `.mdx`.
- **Part_Field**: Campo `part` no frontmatter do `index.md` de um capítulo, que define a qual categoria o capítulo pertence.
- **Content_Loader**: Utilitário `src/utils/contentLoader.ts` responsável por carregar e transformar metadados dos capítulos.
- **NavItem**: Estrutura de dados TypeScript que representa um item na navegação, com campos `title`, `slug`, `url` e `children`.
- **CategoryNavItem**: Extensão de `NavItem` que representa uma categoria (parte) na navegação, agrupando capítulos filhos.
- **Landing_Page**: Página inicial (`src/pages/index.astro`) que exibe a lista de capítulos do livro.
- **Collapse_State**: Estado de expansão/colapso de um Category_Group na navegação, persistido em localStorage.

---

## Requisitos

### Requisito 1: Leitura do campo `part` no carregamento de conteúdo

**User Story:** Como desenvolvedor, quero que o Content_Loader leia o campo `part` do frontmatter de cada capítulo, para que a informação de categoria esteja disponível para a navegação.

#### Critérios de Aceitação

1. THE Content_Loader SHALL ler o campo `part` do frontmatter do arquivo `index.md` de cada capítulo.
2. WHEN o campo `part` estiver ausente no frontmatter, THE Content_Loader SHALL tratar o capítulo como pertencente a uma categoria padrão sem rótulo.
3. THE ChapterMeta SHALL incluir um campo `part` opcional do tipo `string`.
4. THE Content_Loader SHALL preservar o valor exato do campo `part` sem transformações.

---

### Requisito 2: Geração de CategoryNavItems agrupados por categoria

**User Story:** Como desenvolvedor, quero que o Content_Loader gere uma estrutura de navegação agrupada por categoria, para que o Navigation_Menu possa renderizar os capítulos em grupos.

#### Critérios de Aceitação

1. THE Content_Loader SHALL exportar uma função `generateCategoryNavItems` que recebe a lista de capítulos e retorna uma lista de CategoryNavItems.
2. WHEN dois ou mais capítulos possuem o mesmo valor de `part`, THE Content_Loader SHALL agrupá-los sob um único CategoryNavItem com esse rótulo.
3. THE Content_Loader SHALL ordenar os CategoryNavItems pela ordem do primeiro capítulo de cada categoria.
4. THE Content_Loader SHALL ordenar os capítulos dentro de cada CategoryNavItem pela ordem (`order`) crescente.
5. WHEN um capítulo não possui campo `part`, THE Content_Loader SHALL incluí-lo em um CategoryNavItem com `title` vazio e posicioná-lo ao final da lista.
6. THE CategoryNavItem SHALL conter os campos: `title` (Category_Label), `slug` (derivado do título da categoria em kebab-case), `url` (vazio ou `#`), e `children` (lista de NavItems dos capítulos).

---

### Requisito 3: Renderização de grupos de categoria na navegação lateral

**User Story:** Como leitor, quero ver os capítulos agrupados por categoria na navegação lateral, para que eu possa entender a estrutura do livro e navegar mais facilmente.

#### Critérios de Aceitação

1. THE Navigation_Menu SHALL renderizar um Category_Label para cada CategoryNavItem recebido.
2. THE Navigation_Menu SHALL renderizar os capítulos de cada categoria aninhados abaixo do Category_Label correspondente.
3. THE Category_Label SHALL ser visualmente distinto dos itens de capítulo (ex: fonte diferente, cor de destaque, tamanho menor).
4. WHEN a navegação contém CategoryNavItems, THE Navigation_Menu SHALL manter a hierarquia: Category_Label → capítulo → seções.
5. THE Navigation_Menu SHALL aceitar tanto `NavItem[]` simples quanto `CategoryNavItem[]` como entrada, mantendo compatibilidade retroativa.

---

### Requisito 4: Colapso e expansão de categorias

**User Story:** Como leitor, quero poder colapsar e expandir categorias na navegação, para que eu possa ocultar partes do livro que não estou lendo no momento e reduzir a rolagem.

#### Critérios de Aceitação

1. THE Navigation_Menu SHALL renderizar cada Category_Group com um controle de colapso/expansão (botão ou elemento clicável).
2. WHEN o leitor clica no controle de uma categoria, THE Navigation_Menu SHALL alternar o Collapse_State dessa categoria entre expandido e colapsado.
3. WHILE uma categoria está colapsada, THE Navigation_Menu SHALL ocultar os capítulos filhos dessa categoria.
4. WHILE uma categoria está expandida, THE Navigation_Menu SHALL exibir os capítulos filhos dessa categoria.
5. THE Navigation_Menu SHALL expandir automaticamente a categoria que contém o capítulo atualmente ativo.
6. IF o localStorage estiver disponível, THE Navigation_Menu SHALL persistir o Collapse_State de cada categoria usando a chave `ibbook_nav_categories`.
7. IF o localStorage não estiver disponível, THE Navigation_Menu SHALL manter o Collapse_State apenas em memória durante a sessão, sem lançar erros.
8. THE controle de colapso/expansão SHALL ter `aria-expanded` refletindo o estado atual e `aria-controls` apontando para o elemento da lista de capítulos.

---

### Requisito 5: Indicação visual da categoria ativa

**User Story:** Como leitor, quero que a categoria do capítulo que estou lendo seja visualmente destacada na navegação, para que eu saiba em qual parte do livro estou.

#### Critérios de Aceitação

1. WHEN o capítulo ativo pertence a uma categoria, THE Navigation_Menu SHALL aplicar um estilo de destaque ao Category_Label dessa categoria.
2. THE destaque da categoria ativa SHALL ser visualmente diferente do destaque de um item de capítulo ativo.
3. WHEN nenhum capítulo está ativo, THE Navigation_Menu SHALL não aplicar destaque a nenhum Category_Label.

---

### Requisito 6: Exibição de categorias na página inicial

**User Story:** Como leitor, quero ver os capítulos agrupados por categoria na página inicial, para que eu tenha uma visão clara da estrutura do livro antes de começar a leitura.

#### Critérios de Aceitação

1. THE Landing_Page SHALL exibir os capítulos agrupados por categoria na seção "Capítulos".
2. THE Landing_Page SHALL exibir o Category_Label de cada grupo acima dos capítulos correspondentes.
3. THE Category_Label na Landing_Page SHALL ser visualmente distinto dos títulos de capítulo.
4. THE Landing_Page SHALL preservar a ordenação existente dos capítulos dentro de cada categoria.

---

### Requisito 7: Acessibilidade dos grupos de categoria

**User Story:** Como leitor que usa tecnologia assistiva, quero que os grupos de categoria sejam acessíveis via teclado e leitores de tela, para que eu possa navegar pelo livro sem barreiras.

#### Critérios de Aceitação

1. THE Category_Label SHALL ser implementado como elemento `<button>` ou elemento com `role="button"` quando for interativo (colapsável).
2. THE controle de colapso SHALL ser ativável via tecla `Enter` e `Space`.
3. THE lista de capítulos dentro de uma categoria SHALL ter `role="list"` e estar associada ao Category_Label via `aria-controls`.
4. THE Navigation_Menu SHALL anunciar mudanças de estado de colapso/expansão para leitores de tela via `aria-expanded`.
5. THE Category_Label SHALL ter um `aria-label` descritivo em pt-BR quando o texto visível não for suficientemente claro.

---

### Requisito 8: Compatibilidade com o sistema de progresso existente

**User Story:** Como leitor, quero que o agrupamento por categorias não afete o rastreamento de progresso existente, para que meu histórico de leitura seja preservado.

#### Critérios de Aceitação

1. THE Navigation_Menu SHALL continuar exibindo os ícones de seção visitada (✓) nos itens de seção dentro de categorias.
2. THE sistema de progresso SHALL continuar usando a chave `ibbook_progress` no localStorage sem alterações.
3. WHEN o Navigation_Menu é renderizado com categorias, THE Navigation_Menu SHALL continuar executando a função `updateVisitedIndicators` para marcar seções visitadas.
4. THE introdução de categorias SHALL não alterar as URLs dos capítulos e seções existentes.
