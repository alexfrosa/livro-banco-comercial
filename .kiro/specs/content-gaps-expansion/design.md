# Design — Expansão de Conteúdo (Content Gaps)

## Visão Geral

Este documento descreve a estrutura técnica e editorial dos 10 novos grupos de capítulos MDX a serem criados no Interactive Banking Book. O escopo é exclusivamente conteúdo estático em `content/chapters/` — nenhuma alteração de código de aplicação é necessária, exceto os testes de propriedade que validam a integridade estrutural do conteúdo.

Os novos capítulos iniciam no número **47** (após o último existente, `46-expansao`) e seguem rigorosamente as convenções já estabelecidas: pasta `NN-kebab-slug/`, arquivo `index.md` de metadados, e seções `.mdx` numeradas.

---

## Arquitetura

### Padrão editorial existente

O livro organiza o conteúdo em grupos temáticos de 2–4 capítulos por produto/tema:

```
NN-conceitos/        → 01-conceitos.mdx
NN+1-jornada/        → 01-jornada.mdx, 02-backoffice.mdx
NN+2-simulacao/      → 01-simulacao.mdx   (quando aplicável)
```

Alguns temas condensam conceitos + jornada em um único grupo de capítulos quando o volume de conteúdo não justifica a separação. Os novos capítulos seguem o mesmo critério.

### Mapeamento de Partes do livro

As Partes existentes são:
- Parte 1–5: fundamentos (banco, regulação, arquitetura, KYC, contas)
- Parte 6: Crédito (caps. 16–19)
- Parte 7–9: Tarifas, Tesouraria, ALM
- Parte 10: Risco, Compliance e Regulação
- Parte 11: Contabilidade (COSIF)
- Parte 12: Investimentos (caps. 37–39)
- Parte 13: Problemas Reais
- Parte Final: Evolução

Os novos capítulos formam **quatro novas Partes**:

| Parte | Tema | Capítulos |
|---|---|---|
| Parte 14 — Modalidades de Crédito | Req 7 | 47–49 |
| Parte 15 — Cartão de Crédito | Req 8 | 50–51 |
| Parte 16 — Produtos de Investimento | Req 2, 1, 3 | 52–58 |
| Parte 17 — Câmbio | Req 4 | 59–60 |
| Parte 18 — Seguros e Consórcio | Req 5, 6 | 61–64 |
| Parte 19 — Open Finance e BaaS | Req 9, 10 | 65–67 |


---

## Componentes e Interfaces

### Estrutura de arquivos por capítulo

Cada entrada abaixo especifica: pasta, `index.md` (frontmatter completo) e seções `.mdx` (frontmatter completo).

---

#### Parte 14 — Modalidades de Crédito (Req 7)

**47-modalidades-credito-conceitos/**

`index.md`:
```yaml
title: "Capítulo 47 — Modalidades de crédito"
order: 47
description: "Crédito pessoal, consignado, cheque especial, imobiliário, veículos, capital de giro e BNDES"
part: "Parte 14 — Modalidades de Crédito"
```

Seções:
- `01-conceitos.mdx` — `title: "Conceitos — Modalidades de crédito"`, `order: 1`, `description: "Panorama das modalidades: pessoal, consignado, cheque especial, imobiliário, veículos e empresarial"`
- `02-financiamento-imobiliario.mdx` — `title: "Financiamento imobiliário — SFH, SFI e FGTS"`, `order: 2`, `description: "Diferença entre SFH e SFI, uso do FGTS, alienação fiduciária e sistemas de amortização"`
- `03-financiamento-veiculos.mdx` — `title: "Financiamento de veículos — CDC e Leasing"`, `order: 3`, `description: "CDC vs. leasing, alienação fiduciária do veículo e registro no DETRAN"`
- `04-capital-de-giro.mdx` — `title: "Capital de giro e linhas de fomento"`, `order: 4`, `description: "Conta garantida, desconto de recebíveis, antecipação de cartão e repasses BNDES"`

**48-jornada-modalidades-credito/**

`index.md`:
```yaml
title: "Capítulo 48 — Jornada das modalidades de crédito"
order: 48
description: "Originação, formalização de garantias e gestão de inadimplência por modalidade"
part: "Parte 14 — Modalidades de Crédito"
```

Seções:
- `01-jornada.mdx` — `title: "Jornada — Contratação por modalidade"`, `order: 1`, `description: "Fluxo do cliente em cada modalidade: do pedido à liberação do crédito"`
- `02-backoffice.mdx` — `title: "Backoffice — Garantias, registros e inadimplência"`, `order: 2`, `description: "Formalização de garantias, registro em cartório/DETRAN, gestão de inadimplência e cobrança"`

**49-simulacao-modalidades-credito/**

`index.md`:
```yaml
title: "Capítulo 49 — Simulação: modalidades de crédito"
order: 49
description: "Compare SAC vs. Price, simule financiamento imobiliário e calcule CET"
part: "Parte 14 — Modalidades de Crédito"
```

Seções:
- `01-simulacao.mdx` — `title: "Simulação — Comparador de modalidades"`, `order: 1`, `description: "Simule e compare parcelas, juros totais e CET entre diferentes modalidades de crédito"`, `simulation: true`

> Referências cruzadas: `01-conceitos.mdx` e `02-financiamento-imobiliario.mdx` referenciam cap. 16 (conceitos de juros e amortização SAC/Price) e cap. 17 (originação de crédito).

---

#### Parte 15 — Cartão de Crédito (Req 8)

**50-cartao-credito-conceitos/**

`index.md`:
```yaml
title: "Capítulo 50 — Cartão de crédito"
order: 50
description: "Ecossistema de quatro partes, ciclo de faturamento, intercâmbio, chargeback e programas de pontos"
part: "Parte 15 — Cartão de Crédito"
```

Seções:
- `01-conceitos.mdx` — `title: "Conceitos — Ecossistema de cartão"`, `order: 1`, `description: "Portador, emissor, adquirente e bandeira: o fluxo financeiro de uma transação"`
- `02-faturamento.mdx` — `title: "Ciclo de faturamento e rotativo"`, `order: 2`, `description: "Data de fechamento, vencimento, pagamento mínimo, rotativo e parcelado"`
- `03-chargeback-pontos.mdx` — `title: "Chargeback e programas de pontos"`, `order: 3`, `description: "Contestação de transações, prazos, responsabilidades e passivo de pontos no balanço"`

**51-jornada-cartao-credito/**

`index.md`:
```yaml
title: "Capítulo 51 — Jornada do cartão de crédito"
order: 51
description: "Emissão, gestão de limite, processamento de fatura e cobrança"
part: "Parte 15 — Cartão de Crédito"
```

Seções:
- `01-jornada.mdx` — `title: "Jornada — Emissão e uso do cartão"`, `order: 1`, `description: "Do pedido de cartão à primeira transação: análise de crédito, emissão e ativação"`
- `02-backoffice.mdx` — `title: "Backoffice — Fatura, cobrança e bloqueio"`, `order: 2`, `description: "Processamento de fatura, cobrança de inadimplentes, bloqueio/desbloqueio e gestão de limite"`

> Referências cruzadas: `01-conceitos.mdx` referencia cap. 16 (crédito) e cap. 13 (pagamentos/Pix como alternativa ao cartão).


---

#### Parte 16 — Produtos de Investimento (Req 2, 1, 3)

**52-fundos-investimento-conceitos/**

`index.md`:
```yaml
title: "Capítulo 52 — Fundos de investimento"
order: 52
description: "Tipos de fundos, estrutura tripartite, cota, patrimônio líquido e come-cotas"
part: "Parte 16 — Produtos de Investimento"
```

Seções:
- `01-conceitos.mdx` — `title: "Conceitos — Tipos e estrutura de fundos"`, `order: 1`, `description: "Renda fixa, multimercado, ações, cambial, FII e FIP: características e estrutura administrador/gestor/custodiante"`
- `02-cota-e-tributacao.mdx` — `title: "Cota, marcação a mercado e come-cotas"`, `order: 2`, `description: "Cálculo do valor da cota, marcação a mercado diária e mecanismo de antecipação semestral de IR"`

**53-jornada-fundos/**

`index.md`:
```yaml
title: "Capítulo 53 — Jornada de fundos de investimento"
order: 53
description: "Suitability, aplicação, resgate e liquidação financeira"
part: "Parte 16 — Produtos de Investimento"
```

Seções:
- `01-jornada.mdx` — `title: "Jornada — Suitability e aplicação em fundos"`, `order: 1`, `description: "Coleta de perfil do investidor, adequação ao produto e fluxo de aplicação"`
- `02-backoffice.mdx` — `title: "Backoffice — Resgate, liquidação e informes"`, `order: 2`, `description: "Processamento de resgates (D+0 a D+30), liquidação financeira e emissão de informes de rendimentos"`

> Referências cruzadas: `01-conceitos.mdx` referencia cap. 37 (CDB, LCI, LCA — produtos de renda fixa que compõem carteiras de fundos) e cap. 38 (jornada de investimentos — custódia e resgate).

---

**54-previdencia-privada-conceitos/**

`index.md`:
```yaml
title: "Capítulo 54 — Previdência privada"
order: 54
description: "PGBL e VGBL, tabelas de tributação, fase de acumulação e fase de benefício"
part: "Parte 16 — Produtos de Investimento"
```

Seções:
- `01-conceitos.mdx` — `title: "Conceitos — PGBL, VGBL e tributação"`, `order: 1`, `description: "Diferença entre PGBL e VGBL, tabelas progressiva e regressiva, e planejamento fiscal"`
- `02-fase-beneficio.mdx` — `title: "Fase de benefício e modalidades de renda"`, `order: 2`, `description: "Renda vitalícia, renda por prazo certo, renda temporária e cálculo atuarial dos benefícios"`

**55-jornada-previdencia/**

`index.md`:
```yaml
title: "Capítulo 55 — Jornada de previdência privada"
order: 55
description: "Cadastro de beneficiários, contribuições, portabilidade e resgate"
part: "Parte 16 — Produtos de Investimento"
```

Seções:
- `01-jornada.mdx` — `title: "Jornada — Contratação e contribuições"`, `order: 1`, `description: "Abertura do plano, cadastro de beneficiários e fluxo de contribuições periódicas"`
- `02-backoffice.mdx` — `title: "Backoffice — Portabilidade, resgate e regulação"`, `order: 2`, `description: "Portabilidade entre planos sem IR, resgate antecipado, SUSEP vs. PREVIC e relação banco-seguradora"`

---

**56-renda-variavel-conceitos/**

`index.md`:
```yaml
title: "Capítulo 56 — Renda variável"
order: 56
description: "Ações, BDRs, ETFs, Home Broker, custódia B3 e eventos corporativos"
part: "Parte 16 — Produtos de Investimento"
```

Seções:
- `01-conceitos.mdx` — `title: "Conceitos — Ações, BDRs e ETFs"`, `order: 1`, `description: "Instrumentos de renda variável, papel do banco como corretora e liquidação D+2 na B3"`
- `02-eventos-corporativos.mdx` — `title: "Eventos corporativos e tributação"`, `order: 2`, `description: "Dividendos, JCP, bonificações, splits, grupamentos e IR sobre ganho de capital"`

**57-jornada-renda-variavel/**

`index.md`:
```yaml
title: "Capítulo 57 — Jornada de renda variável"
order: 57
description: "Home Broker, envio de ordens, custódia B3 e processamento de eventos corporativos"
part: "Parte 16 — Produtos de Investimento"
```

Seções:
- `01-jornada.mdx` — `title: "Jornada — Home Broker e envio de ordens"`, `order: 1`, `description: "Interface de negociação, tipos de ordem (mercado, limitada, stop) e controles de risco para day trade"`
- `02-backoffice.mdx` — `title: "Backoffice — Custódia B3 e eventos corporativos"`, `order: 2`, `description: "Registro de ativos na B3 em nome do investidor, CBLC e processamento de eventos corporativos no backoffice"`

**58-simulacao-renda-variavel/**

`index.md`:
```yaml
title: "Capítulo 58 — Simulação: renda variável"
order: 58
description: "Simule compra e venda de ações, calcule IR e processe eventos corporativos"
part: "Parte 16 — Produtos de Investimento"
```

Seções:
- `01-simulacao.mdx` — `title: "Simulação — Carteira de ações"`, `order: 1`, `description: "Monte uma carteira, simule compra/venda, calcule ganho de capital e IR via DARF"`, `simulation: true`

> Referências cruzadas: cap. 56 referencia cap. 37 (fundos de investimento como alternativa à renda variável direta) e cap. 52 (fundos de ações como veículo de exposição indireta).

---

#### Parte 17 — Câmbio (Req 4)

**59-cambio-conceitos/**

`index.md`:
```yaml
title: "Capítulo 59 — Câmbio"
order: 59
description: "Câmbio turismo e comercial, spread cambial, SWIFT e regulação do BACEN"
part: "Parte 17 — Câmbio"
```

Seções:
- `01-conceitos.mdx` — `title: "Conceitos — Câmbio turismo e comercial"`, `order: 1`, `description: "Diferença entre câmbio turismo (PF) e comercial (empresas), spread cambial e formação de preço"`
- `02-swift-correspondentes.mdx` — `title: "Remessas internacionais e correspondent banking"`, `order: 2`, `description: "Fluxo SWIFT (MT103), contas nostro/vostro e modelo de correspondentes bancários no exterior"`

**60-jornada-cambio/**

`index.md`:
```yaml
title: "Capítulo 60 — Jornada de câmbio"
order: 60
description: "Contrato de câmbio, liquidação, posição cambial e regulação BACEN/SISBACEN"
part: "Parte 17 — Câmbio"
```

Seções:
- `01-jornada.mdx` — `title: "Jornada — Operação de câmbio"`, `order: 1`, `description: "Do pedido do cliente ao contrato de câmbio: documentação, cotação e confirmação"`
- `02-backoffice.mdx` — `title: "Backoffice — Liquidação, posição e regulação"`, `order: 2`, `description: "Liquidação pronto vs. futuro, posição cambial do banco, SISBACEN e RDE (Registro Declaratório Eletrônico)"`

---

#### Parte 18 — Seguros e Consórcio (Req 5, 6)

**61-seguros-conceitos/**

`index.md`:
```yaml
title: "Capítulo 61 — Seguros e bancassurance"
order: 61
description: "Modelo de bancassurance, produtos de seguro e seguro prestamista"
part: "Parte 18 — Seguros e Consórcio"
```

Seções:
- `01-conceitos.mdx` — `title: "Conceitos — Bancassurance e produtos de seguro"`, `order: 1`, `description: "Banco como canal de distribuição, seguradora parceira, comissão e principais produtos (vida, residencial, auto)"`
- `02-seguro-prestamista.mdx` — `title: "Seguro prestamista e regulação SUSEP"`, `order: 2`, `description: "Vinculação ao contrato de crédito, cobertura de morte/invalidez, regras de venda casada e Resolução CNSP"`

**62-jornada-seguros/**

`index.md`:
```yaml
title: "Capítulo 62 — Jornada de seguros"
order: 62
description: "Emissão de apólice, cobrança de prêmio, sinistro e cancelamento"
part: "Parte 18 — Seguros e Consórcio"
```

Seções:
- `01-jornada.mdx` — `title: "Jornada — Contratação de seguro"`, `order: 1`, `description: "Do pedido à emissão da apólice: análise de risco, aceitação e cobrança do prêmio"`
- `02-backoffice.mdx` — `title: "Backoffice — Sinistro, cancelamento e comissão"`, `order: 2`, `description: "Processamento de sinistro, cancelamento de apólice e reconhecimento de receita de comissão pelo banco"`

> Referências cruzadas: `02-seguro-prestamista.mdx` referencia cap. 47 (modalidades de crédito — o seguro prestamista é vinculado a contratos de crédito).

---

**63-consorcio-conceitos/**

`index.md`:
```yaml
title: "Capítulo 63 — Consórcio"
order: 63
description: "Conceito, mecanismos de contemplação, carta de crédito e regulação BACEN"
part: "Parte 18 — Seguros e Consórcio"
```

Seções:
- `01-conceitos.mdx` — `title: "Conceitos — Consórcio e contemplação"`, `order: 1`, `description: "Grupo de consorciados, sorteio, lance (livre, fixo e embutido) e carta de crédito"`

**64-jornada-consorcio/**

`index.md`:
```yaml
title: "Capítulo 64 — Jornada de consórcio"
order: 64
description: "Gestão de grupos, assembleias mensais, inadimplência e encerramento"
part: "Parte 18 — Seguros e Consórcio"
```

Seções:
- `01-jornada.mdx` — `title: "Jornada — Adesão e contemplação"`, `order: 1`, `description: "Do ingresso no grupo à contemplação: fluxo do consorciado e uso da carta de crédito"`
- `02-backoffice.mdx` — `title: "Backoffice — Gestão de grupos e regulação"`, `order: 2`, `description: "Controle de cotas, processamento de assembleias, inadimplência, fundo de reserva e encerramento de grupo"`

---

#### Parte 19 — Open Finance e BaaS (Req 9, 10)

**65-open-finance-conceitos/**

`index.md`:
```yaml
title: "Capítulo 65 — Open Finance"
order: 65
description: "Fases de implementação, consentimento, APIs padronizadas e iniciação de pagamento"
part: "Parte 19 — Open Finance e BaaS"
```

Seções:
- `01-conceitos.mdx` — `title: "Conceitos — Open Finance e consentimento"`, `order: 1`, `description: "Quatro fases do Open Finance brasileiro, modelo de consentimento (12 meses, granularidade, revogação) e OAuth 2.0/FAPI"`
- `02-pisp-agregacao.mdx` — `title: "Iniciação de pagamento e agregação de contas"`, `order: 2`, `description: "PISP: terceiro iniciando Pix em nome do cliente; agregação de saldos e extratos de múltiplos bancos; Open Insurance"`

**66-jornada-open-finance/**

`index.md`:
```yaml
title: "Capítulo 66 — Jornada de Open Finance"
order: 66
description: "Fluxo de consentimento, compartilhamento de dados e iniciação de pagamento"
part: "Parte 19 — Open Finance e BaaS"
```

Seções:
- `01-jornada.mdx` — `title: "Jornada — Consentimento e compartilhamento"`, `order: 1`, `description: "Do pedido de consentimento à entrega de dados: fluxo do cliente e do banco receptor"`
- `02-backoffice.mdx` — `title: "Backoffice — APIs, disponibilidade e conformidade"`, `order: 2`, `description: "Endpoints padronizados, requisito de 99,5% de uptime, monitoramento e obrigações regulatórias do BACEN"`

> Referências cruzadas: `01-conceitos.mdx` referencia cap. 13 (pagamentos/Pix — o PISP é uma extensão do ecossistema Pix).

---

**67-baas-fintechs/**

`index.md`:
```yaml
title: "Capítulo 67 — Banking as a Service e Fintechs"
order: 67
description: "BaaS, embedded finance, licenças BACEN e riscos do modelo"
part: "Parte 19 — Open Finance e BaaS"
```

Seções:
- `01-conceitos.mdx` — `title: "Conceitos — BaaS e embedded finance"`, `order: 1`, `description: "Banco como provedor de infraestrutura via APIs: cartão white-label, contas de pagamento e crédito para marketplaces"`
- `02-licencas-e-riscos.mdx` — `title: "Licenças BACEN e riscos do modelo BaaS"`, `order: 2`, `description: "IP, SCD e SEP: tipos de licença para fintechs; riscos de reputação, operacional e regulatório para o banco parceiro"`

> Referências cruzadas: `01-conceitos.mdx` referencia cap. 65 (Open Finance — BaaS e Open Finance são ecossistemas complementares) e cap. 02 (regulação bancária — licenças do BACEN).


---

## Modelos de Dados

### Frontmatter de `index.md` (capítulo)

```typescript
interface ChapterIndex {
  title: string;       // "Capítulo NN — Título"
  order: number;       // inteiro único, sequencial
  description: string; // resumo de 1 linha
  part: string;        // "Parte NN — Nome da Parte"
}
```

### Frontmatter de seção `.mdx`

```typescript
interface SectionFrontmatter {
  title: string;        // obrigatório
  order: number;        // obrigatório, inteiro dentro do capítulo (1, 2, 3...)
  description: string;  // obrigatório
  simulation?: boolean; // true apenas em seções com Preact island
  diagram?: boolean;    // true quando a seção contém diagrama Mermaid principal
}
```

### Resumo dos 21 novos capítulos

| Nº | Slug | Seções .mdx | Simulação | Parte |
|---|---|---|---|---|
| 47 | modalidades-credito-conceitos | 4 | — | 14 |
| 48 | jornada-modalidades-credito | 2 | — | 14 |
| 49 | simulacao-modalidades-credito | 1 | ✓ | 14 |
| 50 | cartao-credito-conceitos | 3 | — | 15 |
| 51 | jornada-cartao-credito | 2 | — | 15 |
| 52 | fundos-investimento-conceitos | 2 | — | 16 |
| 53 | jornada-fundos | 2 | — | 16 |
| 54 | previdencia-privada-conceitos | 2 | — | 16 |
| 55 | jornada-previdencia | 2 | — | 16 |
| 56 | renda-variavel-conceitos | 2 | — | 16 |
| 57 | jornada-renda-variavel | 2 | — | 16 |
| 58 | simulacao-renda-variavel | 1 | ✓ | 16 |
| 59 | cambio-conceitos | 2 | — | 17 |
| 60 | jornada-cambio | 2 | — | 17 |
| 61 | seguros-conceitos | 2 | — | 18 |
| 62 | jornada-seguros | 2 | — | 18 |
| 63 | consorcio-conceitos | 1 | — | 18 |
| 64 | jornada-consorcio | 2 | — | 18 |
| 65 | open-finance-conceitos | 2 | — | 19 |
| 66 | jornada-open-finance | 2 | — | 19 |
| 67 | baas-fintechs | 2 | — | 19 |

**Total:** 21 pastas, 21 `index.md`, 43 arquivos `.mdx`

### Capítulos com potencial para simulação interativa (Preact island)

- **Cap. 49** — Comparador de modalidades de crédito: SAC vs. Price, cálculo de CET, comparação de parcelas entre modalidades. Componente: `src/components/simulations/CreditModalitiesSimulator.tsx`
- **Cap. 58** — Carteira de ações: compra/venda, cálculo de ganho de capital, IR via DARF, isenção mensal de R$ 20k. Componente: `src/components/simulations/StockPortfolioSimulator.tsx`

Os demais capítulos não têm simulação na primeira versão. Fundos (cap. 53) e Câmbio (cap. 60) são candidatos para versões futuras.

### Mapa de referências cruzadas

| Capítulo novo | Referencia capítulo existente | Motivo |
|---|---|---|
| 47 (modalidades crédito) | 16 (crédito conceitos) | SAC/Price, CET, PDD |
| 47 (modalidades crédito) | 17 (originação crédito) | Fluxo de originação |
| 50 (cartão crédito) | 16 (crédito conceitos) | Crédito rotativo |
| 50 (cartão crédito) | 13 (pagamentos) | Pix como alternativa |
| 52 (fundos) | 37 (investimentos conceitos) | CDB/LCI/LCA em carteiras |
| 52 (fundos) | 38 (jornada investimentos) | Custódia e resgate |
| 56 (renda variável) | 52 (fundos) | Fundos de ações |
| 61 (seguros) | 47 (modalidades crédito) | Seguro prestamista |
| 65 (Open Finance) | 13 (pagamentos) | PISP e Pix |
| 67 (BaaS) | 65 (Open Finance) | Ecossistemas complementares |
| 67 (BaaS) | 02 (regulação) | Licenças BACEN |


---

## Propriedades de Corretude

*Uma propriedade é uma característica ou comportamento que deve ser verdadeiro em todas as execuções válidas de um sistema — essencialmente, uma afirmação formal sobre o que o sistema deve fazer. Propriedades servem como ponte entre especificações legíveis por humanos e garantias de corretude verificáveis por máquina.*

Como o conteúdo é MDX estático (sem lógica de aplicação), as propriedades de corretude focam na **integridade estrutural do conteúdo**: frontmatter válido, numeração consistente, referências cruzadas válidas e ausência de duplicatas. Todas são verificáveis via leitura do sistema de arquivos em tempo de teste.

### Propriedade 1: Frontmatter completo em index.md

*Para qualquer* pasta de capítulo em `content/chapters/`, o arquivo `index.md` deve existir e conter os campos obrigatórios `title`, `order`, `description` e `part` com valores não-vazios.

**Valida: Requisitos 1.3, 2.6, 3.4, 4.4, 4.5, 5.4, 6.4, 7.7, 8.6, 9.4, 10.4** (todos os capítulos devem ter metadados válidos para serem navegáveis)

### Propriedade 2: Numeração sequencial e única

*Para qualquer* conjunto de pastas de capítulos em `content/chapters/`, os valores do campo `order` extraídos dos `index.md` devem ser únicos e formar uma sequência sem lacunas a partir de 0.

**Valida: Convenção de numeração dos requisitos 1–10** (a ordem numérica dos capítulos determina a navegação do livro)

### Propriedade 3: Frontmatter válido em seções .mdx

*Para qualquer* arquivo `.mdx` em qualquer pasta de capítulo, o frontmatter deve existir e conter os campos obrigatórios `title` e `order` com valores não-vazios.

**Valida: Requisitos 1–10** (seções sem frontmatter válido não são renderizadas corretamente pelo Astro)

### Propriedade 4: Referências cruzadas válidas

*Para qualquer* arquivo `.mdx` que contenha uma referência a outro capítulo (padrão `cap. NN` ou `capítulo NN`), a pasta `content/chapters/` deve conter ao menos uma pasta cujo prefixo numérico corresponda ao número referenciado.

**Valida: Mapa de referências cruzadas** (links quebrados degradam a experiência educacional)


---

## Tratamento de Erros

Como o conteúdo é estático, os "erros" são detectados em build-time ou em testes, não em runtime:

- **Frontmatter ausente ou inválido**: o Astro lança erro de build ao tentar renderizar uma rota sem os campos obrigatórios. Mitigação: os testes de propriedade (Propriedades 1 e 3) detectam isso antes do build.
- **Número de capítulo duplicado**: o sistema de navegação exibiria dois capítulos com o mesmo `order`, quebrando a ordenação. Mitigação: Propriedade 2.
- **Referência cruzada quebrada**: o leitor clica em um link e encontra 404. Mitigação: Propriedade 4.
- **Seção `.mdx` com `simulation: true` sem componente correspondente**: o Astro lança erro de build ao tentar importar o componente inexistente. Mitigação: os dois componentes de simulação (`CreditModalitiesSimulator.tsx` e `StockPortfolioSimulator.tsx`) devem ser criados antes das seções que os referenciam.
- **Pasta de capítulo sem `index.md`**: o content loader do Astro ignora a pasta silenciosamente, tornando o capítulo invisível na navegação. Mitigação: Propriedade 1.

---

## Estratégia de Testes

### Abordagem dual

Os testes para este feature são exclusivamente **testes estruturais de conteúdo** — não há lógica de aplicação nova a testar. A abordagem combina:

- **Testes de exemplo (unit)**: verificam casos específicos e condições de borda (ex: capítulo 47 existe, tem exatamente 4 seções)
- **Testes de propriedade (PBT)**: verificam invariantes universais sobre o conjunto completo de capítulos, usando `fast-check` para gerar entradas aleatórias onde aplicável

### Arquivo de testes

`src/tests/content-structure.test.ts`

### Testes de propriedade (fast-check, mínimo 100 iterações cada)

Cada teste de propriedade abaixo implementa exatamente uma das Propriedades de Corretude definidas acima.

**Propriedade 1 — Frontmatter completo em index.md**
```
// Feature: content-gaps-expansion, Property 1: index.md frontmatter completo
// Para qualquer pasta de capítulo, index.md deve ter title, order, description e part
```
Estratégia: enumerar todas as pastas de capítulo via `fs.readdirSync`, ler cada `index.md`, parsear o frontmatter com `gray-matter`, e verificar que os quatro campos existem e são não-vazios. O `fc.property` itera sobre subconjuntos aleatórios da lista de capítulos para garantir cobertura.

**Propriedade 2 — Numeração sequencial e única**
```
// Feature: content-gaps-expansion, Property 2: order único e sequencial
// Para qualquer conjunto de capítulos, os valores de order são únicos e sem lacunas
```
Estratégia: coletar todos os valores de `order` dos `index.md`, verificar que `new Set(orders).size === orders.length` (unicidade) e que `max - min + 1 === orders.length` (sem lacunas).

**Propriedade 3 — Frontmatter válido em seções .mdx**
```
// Feature: content-gaps-expansion, Property 3: frontmatter de seções .mdx
// Para qualquer arquivo .mdx, frontmatter deve ter title e order
```
Estratégia: enumerar todos os arquivos `.mdx` recursivamente, parsear frontmatter com `gray-matter`, verificar `title` e `order` presentes e não-vazios. O `fc.property` itera sobre subconjuntos aleatórios da lista de arquivos.

**Propriedade 4 — Referências cruzadas válidas**
```
// Feature: content-gaps-expansion, Property 4: referências cruzadas válidas
// Para qualquer referência "cap. NN" em .mdx, a pasta correspondente deve existir
```
Estratégia: ler todos os arquivos `.mdx`, extrair referências com regex `/cap\.\s*(\d+)/gi`, verificar que para cada número `N` extraído existe ao menos uma pasta `content/chapters/` cujo nome começa com o prefixo zero-padded correspondente.

### Testes de exemplo (unit)

- Verificar que os 21 novos capítulos (47–67) existem como pastas
- Verificar que cada capítulo novo tem o número correto de seções `.mdx` conforme a tabela de modelos de dados
- Verificar que os dois capítulos com `simulation: true` (49 e 58) têm o campo no frontmatter
- Verificar que nenhum capítulo novo usa um número já existente (47–67 não colidem com 00–46)

### Configuração

```typescript
// fast-check: mínimo 100 runs por propriedade
fc.configureGlobal({ numRuns: 100 });
```

Dependências de teste já presentes no projeto: `vitest`, `fast-check`, `gray-matter` (ou parsing manual de frontmatter YAML).
