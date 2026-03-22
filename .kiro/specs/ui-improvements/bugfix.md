# Bugfix Requirements Document

## Introduction

Este documento cobre três problemas de UI/manutenção no projeto `interactive-banking-book` (site Astro):

1. **Versão desatualizada do Astro** — o `package.json` declara `"astro": "^4.0.0"`, mas a versão estável mais recente é a 6.x. A dependência deve ser atualizada junto com os pacotes de integração compatíveis.
2. **Menu lateral sem link para a home** — o `NavigationMenu` lista apenas capítulos e seções, sem nenhuma entrada que leve o usuário de volta à página inicial (`/`).
3. **Barra superior sem título** — o `<header class="site-header">` em `BaseLayout.astro` contém apenas o `ThemeToggle`, sem exibir o título do site ou da página atual.

---

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN o projeto é instalado com `npm install` THEN o sistema instala o Astro na versão 4.x em vez da versão estável mais recente (6.x)

1.2 WHEN o usuário está navegando em qualquer capítulo ou seção THEN o sistema não exibe nenhum link de retorno à home no menu lateral

1.3 WHEN o usuário visualiza qualquer página do site THEN o sistema exibe a barra superior sem título, mostrando apenas o botão de alternância de tema

### Expected Behavior (Correct)

2.1 WHEN o projeto é instalado com `npm install` THEN o sistema SHALL instalar o Astro na versão estável mais recente (6.x) com todas as integrações compatíveis atualizadas

2.2 WHEN o usuário está navegando em qualquer capítulo ou seção THEN o sistema SHALL exibir um link "Home" (ou equivalente) no topo do menu lateral que navega para `/`

2.3 WHEN o usuário visualiza qualquer página do site THEN o sistema SHALL exibir o título do site na barra superior, ao lado do botão de alternância de tema

### Unchanged Behavior (Regression Prevention)

3.1 WHEN o usuário acessa qualquer capítulo ou seção existente THEN o sistema SHALL CONTINUE TO renderizar o conteúdo MDX corretamente

3.2 WHEN o usuário clica em um item do menu lateral THEN o sistema SHALL CONTINUE TO navegar para a URL correta do capítulo ou seção

3.3 WHEN o usuário alterna o tema (claro/escuro) THEN o sistema SHALL CONTINUE TO aplicar o tema corretamente sem recarregar a página

3.4 WHEN o usuário acessa o site em dispositivo móvel THEN o sistema SHALL CONTINUE TO exibir o menu hambúrguer colapsável corretamente

3.5 WHEN o usuário acessa o site em desktop THEN o sistema SHALL CONTINUE TO exibir o menu lateral fixo (sticky sidebar) corretamente
