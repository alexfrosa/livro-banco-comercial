# Design Document: Melhorias de Conteúdo e Referências

## Overview

O trabalho é dividido em duas fases sequenciais:

1. **Fase 1 — Referências**: expandir `content/references.yaml` com ~35 entradas e usar `<Ref />` inline nos capítulos
2. **Fase 2 — Conteúdo**: corrigir e expandir os capítulos identificados na avaliação especializada

A infraestrutura de referências (`referencesLoader.ts`, `Ref.astro`, `referencias.astro`) já está implementada e funcionando. Este spec apenas popula os dados e os usa.

---

## Fase 1: Referências a cadastrar

### Categoria: CMN

| id | Norma | O que dispõe |
|---|---|---|
| `resolucao-cmn-4966` | Resolução CMN 4.966/2021 | IFRS 9 — instrumentos financeiros e ECL *(já existe)* |
| `resolucao-cmn-4557` | Resolução CMN 4.557/2017 | Estrutura de gerenciamento de riscos e capital *(já existe)* |
| `resolucao-cmn-2682` | Resolução CMN 2.682/1999 | Classificação de risco de crédito e PDD (AA–H) |
| `resolucao-cmn-4677` | Resolução CMN 4.677/2018 | Limite de exposição por cliente (concentração de risco) |
| `resolucao-cmn-3568` | Resolução CMN 3.568/2008 | Mercado de câmbio |
| `resolucao-cmn-4656` | Resolução CMN 4.656/2018 | Sociedade de Crédito Direto (SCD) e Sociedade de Empréstimo entre Pessoas (SEP) — fintechs de crédito |
| `resolucao-cmn-4949` | Resolução CMN 4.949/2021 | Conta de pagamento pré-paga e pós-paga |

### Categoria: BACEN

| id | Norma | O que dispõe |
|---|---|---|
| `circular-bacen-3978` | Circular BACEN 3.978/2020 | PLD/FT *(já existe)* |
| `resolucao-bcb-277` | Resolução BCB 277/2022 | *(já existe — adicionar description)* |
| `resolucao-bcb-1` | Resolução BCB 1/2020 | Consolidação das normas do SPB |
| `resolucao-bcb-80` | Resolução BCB 80/2021 | Regulamento do Pix |
| `resolucao-bcb-150` | Resolução BCB 150/2021 | Open Finance — compartilhamento de dados |
| `resolucao-bcb-403` | Resolução BCB 403/2023 | Pix Garantido |
| `instrucao-normativa-bcb-184` | Instrução Normativa BCB 184/2021 | DICT — Diretório de Identificadores de Contas Transacionais |
| `resolucao-bcb-44` | Resolução BCB 44/2021 | KYC — política de conhecimento do cliente |
| `circular-bacen-3461` | Circular BACEN 3.461/2009 | Identificação de beneficiários finais (PJ) |
| `resolucao-bcb-229` | Resolução BCB 229/2022 | LCR — Liquidity Coverage Ratio |
| `resolucao-bcb-230` | Resolução BCB 230/2022 | NSFR — Net Stable Funding Ratio |
| `resolucao-bcb-197` | Resolução BCB 197/2022 | COSIF — plano contábil das instituições financeiras |
| `resolucao-bcb-96` | Resolução BCB 96/2021 | SCR — Sistema de Informações de Crédito |
| `resolucao-bcb-32` | Resolução BCB 32/2020 | Portabilidade de crédito |
| `resolucao-bcb-6` | Resolução BCB 6/2020 | Tarifas bancárias — serviços essenciais gratuitos |

### Categoria: Lei Federal

| id | Norma | O que dispõe |
|---|---|---|
| `lei-4595-1964` | Lei 4.595/1964 | Lei do Sistema Financeiro Nacional *(já existe)* |
| `lei-12865-2013` | Lei 12.865/2013 | Arranjos de pagamento e instituições de pagamento *(já existe)* |
| `lei-9613-1998` | Lei 9.613/1998 | Lei de Lavagem de Dinheiro |
| `lei-13709-2018` | Lei 13.709/2018 | LGPD — Lei Geral de Proteção de Dados |
| `lei-14478-2022` | Lei 14.478/2022 | Regulação de criptoativos no Brasil |
| `lei-10214-2001` | Lei 10.214/2001 | Sistema de Pagamentos Brasileiro (SPB) |
| `lei-7492-1986` | Lei 7.492/1986 | Lei dos Crimes contra o Sistema Financeiro Nacional |
| `lei-complementar-105-2001` | Lei Complementar 105/2001 | Sigilo bancário |

### Categoria: Medida Provisória

| id | Norma | O que dispõe |
|---|---|---|
| `mp-2158-35-2001` | MP 2.158-35/2001 | *(já existe)* |

### Categoria: Acordo Internacional

| id | Norma | O que dispõe |
|---|---|---|
| `basileia-iii` | Basileia III (BIS, 2010) | Framework de capital e liquidez para bancos |
| `gafi-40-recomendacoes` | 40 Recomendações do GAFI | Padrões internacionais de PLD/CFT |

---

## Fase 2: Correções de conteúdo por capítulo

### cap. 01 — O que é um banco

Adicionar ao final da seção "O banco como criador de dinheiro":
- Nota sobre limitações do multiplicador teórico
- Parágrafo sobre endogenous money (visão moderna)

### cap. 02 — Regulação

Adicionar nova seção "Open Finance e DREX" após a seção de Basileia:
- Open Finance: o que é, impacto no compartilhamento de dados, Resolução BCB 150
- DREX: o que é, status do piloto, impacto potencial
- Expandir seção de Basileia para mencionar os três buffers de capital

### cap. 04 — KYC

Adicionar `<Ref id="circular-bacen-3978" />` e `<Ref id="resolucao-bcb-44" />` nas menções às normas de KYC.

### cap. 13 — Pagamentos

Adicionar:
- Subseção "Pix Garantido" na seção de modalidades do Pix
- Subseção "Open Finance e iniciação de pagamento" 
- Expandir seção do MED com prazos (90 dias para fraude, 7 dias para erro do usuário)

### cap. 16 — Crédito

Adicionar:
- Parágrafo sobre crédito consignado na seção de produtos de crédito
- Nota sobre migração da Res. CMN 2.682 para IFRS 9 / Res. CMN 4.966 na seção de PDD
- Parágrafo sobre portabilidade de crédito

### cap. 31 — AML/PLD

Adicionar:
- Menção ao GAFI e às 40 Recomendações
- Criptoativos como veículo emergente de lavagem

### cap. 37 — Investimentos

Adicionar:
- Explicação do come-cotas
- Nota sobre mudança de 2023 na tributação de fundos fechados

### cap. 41 — Fraudes

Adicionar:
- Subseção sobre deepfakes como ameaça à biometria

---

## Correctness Properties

### Property 1: Todos os IDs usados em `<Ref />` existem no registry
Para qualquer arquivo MDX que use `<Ref id="X" />`, o id `X` deve existir em `content/references.yaml`. Validado pelo build (erro de build se não existir).

### Property 2: Nenhum ID duplicado no registry
O registry não deve ter dois itens com o mesmo `id`. Validado por `parseReferences`.

### Property 3: Todos os campos obrigatórios preenchidos
Cada entrada do registry deve ter `id`, `title`, `issuer`, `category`, `url` não-vazios.
