# Bugfix Requirements Document

## Introduction

Auditoria de UX/design identificou seis problemas no menu de navegação, afetando mobile (< 768px) e tablet (768–1024px):

1. O menu abre corretamente ao clicar no botão hambúrguer, mas não possui mecanismo para ser fechado pelo usuário. O botão não alterna para um ícone de "fechar" (X) quando o menu está aberto, e clicar fora do painel ou em um link de seção não fecha o menu. Isso deixa o painel sobreposto ao conteúdo indefinidamente.

2. Os títulos dos itens de seção/capítulo no `nav-panel` são longos e ficam truncados no mobile, não sendo exibidos por completo ao usuário, prejudicando a legibilidade e a navegação.

3. No breakpoint tablet (768–1024px), `.nav-item-title` tem `white-space: nowrap` + `max-width: 140px` fixo, cortando títulos longos com ellipsis, impedindo a leitura completa.

4. O botão hambúrguer (`nav-toggle`) está dentro do componente `NavigationMenu`, que fica abaixo do `site-header`. No mobile, o botão aparece fora do header, quebrando o padrão visual esperado onde controles de navegação ficam no header.

5. Quando o `nav-panel` abre no mobile, não há overlay escurecendo o conteúdo atrás, ao contrário do `GlossaryPanel.astro` que implementa esse comportamento corretamente.

6. Quando o menu mobile está aberto, o usuário consegue rolar a página por baixo do menu. O glossário usa `glossary-body-lock` para travar o scroll, mas o menu mobile não tem esse comportamento.

## Bug Analysis

### Current Behavior (Defect)

1.1 QUANDO o usuário está em viewport mobile (< 768px) e clica no botão hambúrguer para abrir o menu ENTÃO o sistema abre o `nav-panel` mas não exibe nenhum controle visual para fechá-lo (o ícone permanece como hambúrguer)

1.2 QUANDO o menu está aberto no mobile e o usuário clica fora do `nav-panel` ENTÃO o sistema não fecha o menu, deixando-o sobreposto ao conteúdo

1.3 QUANDO o menu está aberto no mobile e o usuário clica em um link de seção/capítulo ENTÃO o sistema navega para a página mas o menu permanece aberto na nova página (ou sobreposto ao conteúdo)

1.4 QUANDO o `nav-panel` está visível no mobile e um item de seção/capítulo possui título longo ENTÃO o sistema exibe o texto truncado (cortado com `overflow: hidden` ou `text-overflow: ellipsis`), impedindo que o usuário leia o título completo

1.5 QUANDO o usuário está em viewport tablet (768–1024px) e um item de seção/capítulo possui título longo ENTÃO o sistema exibe o texto truncado com ellipsis devido a `white-space: nowrap` e `max-width: 140px` fixo no `.nav-item-title`

1.6 QUANDO o usuário está em viewport mobile (< 768px) ENTÃO o sistema exibe o botão hambúrguer (`nav-toggle`) abaixo do `site-header`, fora da área do header, quebrando o padrão visual de apps mobile onde controles de navegação ficam integrados ao header

1.7 QUANDO o usuário abre o menu mobile ENTÃO o sistema exibe o `nav-panel` sem nenhum overlay/backdrop escurecendo o conteúdo principal, não fornecendo feedback visual de que o menu está em primeiro plano

1.8 QUANDO o menu mobile está aberto ENTÃO o sistema permite que o usuário role a página por baixo do menu, pois não há travamento do scroll do `body`

### Expected Behavior (Correct)

2.1 QUANDO o usuário está em viewport mobile e clica no botão hambúrguer com o menu aberto ENTÃO o sistema SHALL fechar o `nav-panel` e alternar o ícone do botão para o estado hambúrguer (três linhas)

2.2 QUANDO o menu está aberto no mobile e o usuário clica fora do `nav-panel` ENTÃO o sistema SHALL fechar o menu e restaurar o `aria-expanded` do botão para `"false"`

2.3 QUANDO o menu está aberto no mobile e o usuário pressiona a tecla Escape ENTÃO o sistema SHALL fechar o menu e devolver o foco ao botão hambúrguer

2.4 QUANDO o botão hambúrguer é ativado e o menu está fechado ENTÃO o sistema SHALL exibir o ícone X (fechar) no botão e atualizar `aria-label` para "Fechar menu de navegação"

2.5 QUANDO o botão hambúrguer é ativado e o menu está aberto ENTÃO o sistema SHALL exibir o ícone hambúrguer (três linhas) no botão e atualizar `aria-label` para "Abrir menu de navegação"

2.6 QUANDO o `nav-panel` está visível no mobile e um item de seção/capítulo possui título longo ENTÃO o sistema SHALL exibir o título completo com quebra de linha (`white-space: normal; word-break: break-word`) para que o texto seja legível sem truncamento

2.7 QUANDO o usuário está em viewport tablet (768–1024px) e um item de seção/capítulo possui título longo ENTÃO o sistema SHALL exibir o título completo com quebra de linha (`white-space: normal; word-break: break-word`), removendo o `max-width` fixo do `.nav-item-title`

2.8 QUANDO o usuário está em viewport mobile (< 768px) ENTÃO o sistema SHALL exibir o botão hambúrguer visualmente integrado ao `site-header`, ao lado do título do site, seguindo o padrão de apps mobile

2.9 QUANDO o usuário abre o menu mobile ENTÃO o sistema SHALL exibir um overlay semitransparente cobrindo o conteúdo principal, dando feedback visual de que o menu está em primeiro plano

2.10 QUANDO o usuário clica no overlay com o menu mobile aberto ENTÃO o sistema SHALL fechar o menu e remover o overlay

2.11 QUANDO o usuário abre o menu mobile ENTÃO o sistema SHALL travar o scroll do `body` (equivalente a `overflow: hidden`), impedindo rolagem por baixo do menu

2.12 QUANDO o usuário fecha o menu mobile ENTÃO o sistema SHALL restaurar o scroll do `body` ao estado anterior

### Unchanged Behavior (Regression Prevention)

3.1 QUANDO o usuário está em viewport desktop (≥ 1025px) ENTÃO o sistema SHALL CONTINUE TO exibir o `nav-panel` sempre visível, sem botão hambúrguer

3.2 QUANDO o usuário está em viewport tablet (768–1024px) ENTÃO o sistema SHALL CONTINUE TO exibir o `nav-panel` sempre visível, sem botão hambúrguer

3.3 QUANDO o usuário clica em um botão de categoria para expandir/recolher ENTÃO o sistema SHALL CONTINUE TO alternar o estado de colapso da categoria normalmente

3.4 QUANDO o usuário navega pelo teclado (Tab/Enter) nos itens do menu ENTÃO o sistema SHALL CONTINUE TO manter o foco gerenciado corretamente dentro do painel

3.5 QUANDO o estado de colapso das categorias é alterado ENTÃO o sistema SHALL CONTINUE TO persistir o estado no `localStorage` sob a chave `ibbook_nav_categories`

3.6 QUANDO o usuário está em viewport desktop (≥ 1025px) ou tablet (768–1024px) e os títulos dos itens de seção/capítulo são longos ENTÃO o sistema SHALL CONTINUE TO exibir os títulos conforme o comportamento atual nessas viewports

3.7 QUANDO o usuário está em qualquer viewport ENTÃO o sistema SHALL CONTINUE TO exibir o `site-header` com o título do site e o `ThemeToggle` lado a lado

3.8 QUANDO o usuário interage com o `GlossaryPanel` ENTÃO o sistema SHALL CONTINUE TO exibir o overlay e travar o scroll do glossário de forma independente, sem ser afetado pelas mudanças no menu mobile

3.9 QUANDO o usuário está em viewport desktop (≥ 1025px) ou tablet (768–1024px) ENTÃO o sistema SHALL CONTINUE TO exibir o menu sempre visível, sem overlay e sem scroll lock
