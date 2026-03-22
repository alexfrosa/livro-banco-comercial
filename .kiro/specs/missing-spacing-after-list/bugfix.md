# Bugfix Requirements Document

## Introduction

O reset CSS global (`margin: 0; padding: 0`) remove toda a margem padrão dos elementos `ul` e `ol`, mas o arquivo `global.css` não redefine `margin-bottom` para essas listas. Como resultado, quando uma lista ordenada ou não-ordenada precede um heading ou parágrafo no conteúdo MDX, o elemento seguinte aparece colado ao último item da lista — sem espaço visual entre eles. O bug é visível em múltiplos capítulos do livro, como nos títulos "Solicitação de documentos adicionais" e "Atualização cadastral periódica" que aparecem imediatamente após listas.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN uma lista ordenada (`ol`) é seguida por um heading ou parágrafo no conteúdo MDX THEN o sistema renderiza o heading/parágrafo sem margem superior ou inferior em relação ao último item da lista, resultando em conteúdo visualmente "amontoado"

1.2 WHEN uma lista não-ordenada (`ul`) é seguida por um heading ou parágrafo no conteúdo MDX THEN o sistema renderiza o heading/parágrafo sem margem superior ou inferior em relação ao último item da lista, resultando em conteúdo visualmente "amontoado"

1.3 WHEN qualquer lista (`ul` ou `ol`) aparece no meio do conteúdo de uma seção THEN o sistema não aplica `margin-bottom` à lista, pois o reset CSS global zeroa as margens e nenhuma regra posterior as redefine para `ul`/`ol`

### Expected Behavior (Correct)

2.1 WHEN uma lista ordenada (`ol`) é seguida por um heading ou parágrafo no conteúdo MDX THEN o sistema SHALL aplicar `margin-bottom` à lista equivalente ao espaçamento de parágrafo (`--spacing-paragraph`, mín. 1.2em), criando separação visual adequada entre a lista e o elemento seguinte

2.2 WHEN uma lista não-ordenada (`ul`) é seguida por um heading ou parágrafo no conteúdo MDX THEN o sistema SHALL aplicar `margin-bottom` à lista equivalente ao espaçamento de parágrafo (`--spacing-paragraph`, mín. 1.2em), criando separação visual adequada entre a lista e o elemento seguinte

2.3 WHEN qualquer lista (`ul` ou `ol`) aparece no conteúdo de uma seção THEN o sistema SHALL aplicar `padding-left` adequado para indentar os itens e `margin-bottom` para separar a lista do conteúdo subsequente, respeitando a hierarquia visual do livro

### Unchanged Behavior (Regression Prevention)

3.1 WHEN uma lista aparece como último elemento de uma seção ou bloco de conteúdo THEN o sistema SHALL CONTINUE TO não adicionar margem desnecessária após o último elemento do bloco (comportamento de `last-child`)

3.2 WHEN itens de lista (`li`) contêm parágrafos aninhados THEN o sistema SHALL CONTINUE TO renderizar o espaçamento interno dos itens sem duplicar margens

3.3 WHEN o tema escuro está ativo THEN o sistema SHALL CONTINUE TO renderizar listas com as mesmas regras de espaçamento do tema claro, sem regressão visual

3.4 WHEN listas aparecem dentro de `blockquote` ou `.callout` THEN o sistema SHALL CONTINUE TO respeitar o padding interno desses contêineres sem quebrar o layout

3.5 WHEN o conteúdo é exibido em dispositivos móveis (largura < 768px) THEN o sistema SHALL CONTINUE TO aplicar o espaçamento de lista de forma responsiva, sem overflow ou colapso de layout
