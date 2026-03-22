# Bugfix Requirements Document

## Introduction

Ao clicar no link de um capítulo no menu lateral (`NavigationMenu.astro`), o usuário recebe um erro 404. Isso ocorre porque `generateNavItems` em `src/utils/contentLoader.ts` gera a URL do capítulo como `/{chapterSlug}` (ex: `/04-kyc-conceitos`), mas o roteador do Astro em `src/pages/[...slug].astro` só gera rotas estáticas no formato `/{chapterSlug}/{sectionSlug}`. Não existe rota para o slug do capítulo isolado, resultando em página não encontrada.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN o usuário clica no link de um capítulo no menu lateral THEN o sistema retorna 404 (página não encontrada)
1.2 WHEN `generateNavItems` é chamada com um capítulo que possui seções THEN o sistema gera a URL do capítulo como `/{chapterSlug}`, que não corresponde a nenhuma rota estática gerada

### Expected Behavior (Correct)

2.1 WHEN o usuário clica no link de um capítulo no menu lateral THEN o sistema SHALL navegar para a primeira seção daquele capítulo sem erro
2.2 WHEN `generateNavItems` é chamada com um capítulo que possui seções THEN o sistema SHALL gerar a URL do capítulo como `/{chapterSlug}/{firstSectionSlug}`, usando `generateSectionUrl(chapter.slug, chapter.sections[0].slug)`

### Unchanged Behavior (Regression Prevention)

3.1 WHEN o usuário clica no link de uma seção individual no menu lateral THEN o sistema SHALL CONTINUE TO navegar corretamente para `/{chapterSlug}/{sectionSlug}`
3.2 WHEN `generateNavItems` é chamada THEN o sistema SHALL CONTINUE TO retornar os itens de navegação ordenados por `order` ascendente para capítulos e seções
3.3 WHEN `generateNavItems` é chamada com um capítulo sem seções THEN o sistema SHALL CONTINUE TO gerar um item de navegação para o capítulo (comportamento de fallback preservado)
