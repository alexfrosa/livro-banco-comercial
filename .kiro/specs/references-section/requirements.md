# Documento de Requisitos: Seção de Referências

## Introdução

O livro interativo de banking referencia diversas normas, leis e regulações brasileiras — principalmente do Banco Central do Brasil (BACEN) e do Conselho Monetário Nacional (CMN). Atualmente, essas referências aparecem no texto sem links ou contexto adicional, dificultando que o leitor consulte os documentos originais.

Esta funcionalidade adiciona uma seção de referências ao livro e um mecanismo de linkagem inline: sempre que o texto mencionar uma norma ou lei cadastrada, o sistema exibe um link que leva diretamente à entrada correspondente na seção de referências (e, a partir dela, ao documento oficial externo).

## Glossário

- **Reference**: Uma norma, lei, resolução ou regulação cadastrada no livro, com identificador único, título, descrição e URL do documento oficial
- **Reference_Registry**: Arquivo de dados centralizado (YAML/JSON no Content_Repository) que armazena todas as References cadastradas
- **References_Page**: Página estática do livro que lista todas as References organizadas por categoria
- **Inline_Reference_Link**: Link inserido automaticamente no texto de uma Section sempre que o identificador de uma Reference é mencionado, apontando para a âncora correspondente na References_Page
- **Reference_Anchor**: Âncora HTML na References_Page que identifica unicamente cada Reference, permitindo deep-linking direto a uma entrada específica
- **Reference_Category**: Agrupamento lógico de References por órgão emissor ou tipo (ex: BACEN, CMN, Lei Federal)
- **Content_Author**: Pessoa responsável por adicionar e manter o conteúdo do livro no Content_Repository
- **Reader**: O usuário que acessa e lê o Book

---

## Requisitos

### Requisito 1: Cadastro de Referências no Repositório

**User Story:** Como Content_Author, quero cadastrar normas e leis em um arquivo centralizado no repositório, para que as referências sejam mantidas como código e versionadas junto ao conteúdo.

#### Critérios de Aceitação

1. THE Reference_Registry SHALL armazenar cada Reference com os campos obrigatórios: identificador único (`id`), título (`title`), órgão emissor (`issuer`), categoria (`category`), e URL do documento oficial (`url`)
2. THE Reference_Registry SHALL suportar um campo opcional de descrição (`description`) por Reference, com texto explicativo sobre o conteúdo da norma
3. THE Reference_Registry SHALL suportar um campo opcional de data de publicação (`publishedAt`) por Reference, no formato ISO 8601 (YYYY-MM-DD)
4. IF o Content_Author adicionar uma Reference com `id` duplicado ao Reference_Registry, THEN THE Book SHALL falhar o build com uma mensagem de erro indicando o `id` conflitante
5. THE Reference_Registry SHALL ser um arquivo no formato YAML ou JSON localizado no diretório de conteúdo do Content_Repository, sem necessidade de alteração de código-fonte da aplicação para adicionar novas References

---

### Requisito 2: Página de Referências

**User Story:** Como Reader, quero acessar uma página dedicada com todas as normas e leis referenciadas no livro, para que eu possa consultar os documentos originais e entender o embasamento regulatório do conteúdo.

#### Critérios de Aceitação

1. THE References_Page SHALL ser gerada estaticamente em build time a partir do Reference_Registry e acessível via URL semântica (ex: `/referencias`)
2. THE References_Page SHALL listar todas as References agrupadas por Reference_Category, com cada grupo exibindo o nome da categoria como título de seção
3. WHEN o Reader acessa a References_Page, THE Book SHALL exibir para cada Reference: o título, o órgão emissor, a descrição (quando presente) e um link externo para o documento oficial
4. THE References_Page SHALL exibir cada Reference com uma Reference_Anchor única no formato `#ref-{id}`, permitindo deep-linking direto a uma entrada específica
5. WHEN o Reader clica no link externo de uma Reference, THE Book SHALL abrir o documento oficial em uma nova aba do navegador, sem navegar para fora do livro
6. THE References_Page SHALL ser incluída no Navigation_Menu do livro como item de navegação acessível
7. THE References_Page SHALL ser incluída no sitemap.xml gerado pelo CI_CD_Pipeline

---

### Requisito 3: Links Inline para Referências no Texto

**User Story:** Como Reader, quero que as menções a normas e leis no texto sejam automaticamente linkadas para a seção de referências, para que eu possa consultar o documento original sem perder o contexto de leitura.

#### Critérios de Aceitação

1. WHEN o Content_Author insere um componente de referência inline em um arquivo MDX (ex: `<Ref id="resolucao-cmn-4966" />`), THE Book SHALL renderizar um link visualmente destacado com o título da Reference correspondente
2. WHEN o Reader clica em um Inline_Reference_Link, THE Book SHALL navegar para a Reference_Anchor correspondente na References_Page
3. IF o Content_Author usar um `id` em um componente de referência inline que não existe no Reference_Registry, THEN THE Book SHALL falhar o build com uma mensagem de erro indicando o `id` não encontrado e o arquivo MDX onde ocorre
4. THE Inline_Reference_Link SHALL exibir o título da Reference como texto do link, sem exigir que o Content_Author repita o título no MDX
5. THE Inline_Reference_Link SHALL ser visualmente diferenciado de links de navegação interna e links externos, utilizando estilo visual consistente em todo o livro

---

### Requisito 4: Acessibilidade das Referências

**User Story:** Como Reader que utiliza teclado ou leitor de tela, quero que os links de referência e a página de referências sejam totalmente acessíveis, para que eu possa consultar as normas sem depender de mouse.

#### Acceptance Criteria

1. THE Inline_Reference_Link SHALL conter um atributo `aria-label` descritivo no formato "Ver referência: {título da Reference}", permitindo que leitores de tela identifiquem o destino do link
2. THE References_Page SHALL utilizar marcação semântica com elementos `<section>` por Reference_Category e `<article>` por Reference, com headings hierárquicos adequados
3. THE References_Page SHALL garantir que todos os links externos para documentos oficiais contenham o atributo `aria-label` indicando que o link abre em nova aba, no formato "{título} (abre em nova aba)"
4. WHEN o Reader navega pela References_Page via teclado, THE Book SHALL garantir que todos os links e elementos interativos sejam alcançáveis via Tab e ativáveis via Enter

---

### Requisito 5: Extensibilidade e Manutenção

**User Story:** Como Content_Author, quero adicionar e atualizar referências sem modificar código-fonte, para que a manutenção do acervo regulatório seja simples e não exija conhecimento técnico de programação.

#### Acceptance Criteria

1. THE Reference_Registry SHALL ser o único ponto de verdade para dados de References — nenhuma Reference SHALL ser hardcoded no código-fonte da aplicação
2. WHEN o Content_Author adiciona uma nova Reference ao Reference_Registry e faz commit, THE Book SHALL incluir a nova Reference na References_Page e torná-la disponível para uso como Inline_Reference_Link após o próximo build e deploy
3. WHEN o Content_Author atualiza o campo `url` de uma Reference no Reference_Registry, THE Book SHALL refletir a URL atualizada em todos os Inline_Reference_Links e na References_Page após o próximo build
4. THE Reference_Registry SHALL suportar no mínimo as seguintes categorias de References: resoluções do CMN, circulares e resoluções do BACEN, leis federais e medidas provisórias
