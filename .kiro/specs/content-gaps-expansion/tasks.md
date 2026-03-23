# Plano de Implementação — Expansão de Conteúdo (Content Gaps)

## Visão Geral

Criação de 21 novos capítulos (47–67) em 6 novas Partes (14–19), totalizando 43 arquivos `.mdx`, 21 `index.md`, 2 componentes de simulação Preact e 1 arquivo de testes de propriedade. A ordem de implementação segue as dependências de conteúdo definidas nos requisitos.

## Tasks

- [x] 1. Parte 14 — Modalidades de Crédito (Req 7)
  - [x] 1.1 Criar capítulo 47 — `47-modalidades-credito-conceitos/`
    - Criar `content/chapters/47-modalidades-credito-conceitos/index.md` com frontmatter: `title`, `order: 47`, `description`, `part: "Parte 14 — Modalidades de Crédito"`
    - Criar `01-conceitos.mdx` — panorama das modalidades: pessoal, consignado, cheque especial (teto 8% a.m.), imobiliário, veículos e empresarial
    - Criar `02-financiamento-imobiliario.mdx` — SFH vs. SFI, uso do FGTS, alienação fiduciária, referência cruzada a cap. 16 (SAC/Price) e cap. 17 (originação)
    - Criar `03-financiamento-veiculos.mdx` — CDC vs. Leasing, alienação fiduciária do veículo, registro no DETRAN
    - Criar `04-capital-de-giro.mdx` — conta garantida, desconto de recebíveis, antecipação de cartão, repasses BNDES (TJLP/TLP)
    - _Requisitos: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [x] 1.2 Criar capítulo 48 — `48-jornada-modalidades-credito/`
    - Criar `content/chapters/48-jornada-modalidades-credito/index.md` com frontmatter: `title`, `order: 48`, `description`, `part: "Parte 14 — Modalidades de Crédito"`
    - Criar `01-jornada.mdx` — fluxo do cliente em cada modalidade: do pedido à liberação
    - Criar `02-backoffice.mdx` — formalização de garantias, registro em cartório (imóvel) / DETRAN (veículo), gestão de inadimplência e cobrança
    - _Requisitos: 7.7_

  - [x] 1.3 Criar capítulo 49 — `49-simulacao-modalidades-credito/`
    - Criar `content/chapters/49-simulacao-modalidades-credito/index.md` com frontmatter: `title`, `order: 49`, `description`, `part: "Parte 14 — Modalidades de Crédito"`
    - Criar `01-simulacao.mdx` com frontmatter incluindo `simulation: true` — referencia o componente `CreditModalitiesSimulator`
    - _Requisitos: 7.3, 7.4_

  - [x]* 1.4 Criar componente `CreditModalitiesSimulator.tsx`
    - Criar `src/components/simulations/CreditModalitiesSimulator.tsx` como Preact island
    - Implementar comparador SAC vs. Price: entradas de valor, prazo e taxa; saída de tabela de parcelas, juros totais e CET
    - _Requisitos: 7.3_

- [x] 2. Parte 15 — Cartão de Crédito (Req 8)
  - [x] 2.1 Criar capítulo 50 — `50-cartao-credito-conceitos/`
    - Criar `content/chapters/50-cartao-credito-conceitos/index.md` com frontmatter: `title`, `order: 50`, `description`, `part: "Parte 15 — Cartão de Crédito"`
    - Criar `01-conceitos.mdx` — ecossistema de quatro partes (portador, emissor, adquirente, bandeira), fluxo financeiro de uma transação, intercâmbio; referência cruzada a cap. 16 e cap. 13
    - Criar `02-faturamento.mdx` — data de fechamento, vencimento, pagamento mínimo, rotativo, parcelado e cálculo de juros
    - Criar `03-chargeback-pontos.mdx` — contestação (até 180 dias), responsabilidade do estabelecimento, passivo de pontos no balanço
    - _Requisitos: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 2.2 Criar capítulo 51 — `51-jornada-cartao-credito/`
    - Criar `content/chapters/51-jornada-cartao-credito/index.md` com frontmatter: `title`, `order: 51`, `description`, `part: "Parte 15 — Cartão de Crédito"`
    - Criar `01-jornada.mdx` — do pedido à primeira transação: análise de crédito, emissão e ativação
    - Criar `02-backoffice.mdx` — processamento de fatura, cobrança de inadimplentes, bloqueio/desbloqueio e gestão de limite
    - _Requisitos: 8.6_

- [x] 3. Checkpoint — Verificar capítulos 47–51
  - Garantir que todos os `index.md` e `.mdx` dos capítulos 47–51 existem com frontmatter válido.
  - Garantir que referências cruzadas a caps. 13, 16 e 17 estão presentes nos arquivos indicados no design.

- [x] 4. Parte 16 — Fundos de Investimento (Req 2)
  - [x] 4.1 Criar capítulo 52 — `52-fundos-investimento-conceitos/`
    - Criar `content/chapters/52-fundos-investimento-conceitos/index.md` com frontmatter: `title`, `order: 52`, `description`, `part: "Parte 16 — Produtos de Investimento"`
    - Criar `01-conceitos.mdx` — tipos de fundos (RF, multimercado, ações, cambial, FII, FIP), estrutura tripartite (administrador/gestor/custodiante); referência cruzada a cap. 37 e cap. 38
    - Criar `02-cota-e-tributacao.mdx` — cálculo do valor da cota, marcação a mercado diária, come-cotas (datas, alíquotas 20%/15%)
    - _Requisitos: 2.1, 2.2, 2.3, 2.4_

  - [x] 4.2 Criar capítulo 53 — `53-jornada-fundos/`
    - Criar `content/chapters/53-jornada-fundos/index.md` com frontmatter: `title`, `order: 53`, `description`, `part: "Parte 16 — Produtos de Investimento"`
    - Criar `01-jornada.mdx` — suitability (perfil conservador/moderado/arrojado), adequação ao produto e fluxo de aplicação
    - Criar `02-backoffice.mdx` — processamento de resgates (D+0 a D+30), liquidação financeira e emissão de informes de rendimentos
    - _Requisitos: 2.5, 2.6_

- [x] 5. Parte 16 — Previdência Privada (Req 1)
  - [x] 5.1 Criar capítulo 54 — `54-previdencia-privada-conceitos/`
    - Criar `content/chapters/54-previdencia-privada-conceitos/index.md` com frontmatter: `title`, `order: 54`, `description`, `part: "Parte 16 — Produtos de Investimento"`
    - Criar `01-conceitos.mdx` — PGBL vs. VGBL (tratamento tributário na acumulação e no benefício), tabelas progressiva e regressiva, planejamento fiscal
    - Criar `02-fase-beneficio.mdx` — renda vitalícia, renda por prazo certo, renda temporária e cálculo atuarial dos benefícios
    - _Requisitos: 1.1, 1.2, 1.6_

  - [x] 5.2 Criar capítulo 55 — `55-jornada-previdencia/`
    - Criar `content/chapters/55-jornada-previdencia/index.md` com frontmatter: `title`, `order: 55`, `description`, `part: "Parte 16 — Produtos de Investimento"`
    - Criar `01-jornada.mdx` — abertura do plano, cadastro de beneficiários e fluxo de contribuições periódicas
    - Criar `02-backoffice.mdx` — portabilidade entre planos sem IR, resgate antecipado, SUSEP vs. PREVIC, relação banco-seguradora
    - _Requisitos: 1.3, 1.4, 1.5_

- [x] 6. Checkpoint — Verificar capítulos 52–55
  - Garantir que todos os `index.md` e `.mdx` dos capítulos 52–55 existem com frontmatter válido.
  - Garantir que referências cruzadas a caps. 37 e 38 estão presentes nos arquivos indicados no design.

- [x] 7. Parte 17 — Câmbio (Req 4)
  - [x] 7.1 Criar capítulo 59 — `59-cambio-conceitos/`
    - Criar `content/chapters/59-cambio-conceitos/index.md` com frontmatter: `title`, `order: 59`, `description`, `part: "Parte 17 — Câmbio"`
    - Criar `01-conceitos.mdx` — câmbio turismo (PF, espécie e cartão pré-pago) vs. câmbio comercial (empresas, importação/exportação), limites regulatórios, spread cambial e formação de preço
    - Criar `02-swift-correspondentes.mdx` — fluxo SWIFT (MT103), contas nostro/vostro, correspondent banking
    - _Requisitos: 4.1, 4.2, 4.3, 4.6_

  - [x] 7.2 Criar capítulo 60 — `60-jornada-cambio/`
    - Criar `content/chapters/60-jornada-cambio/index.md` com frontmatter: `title`, `order: 60`, `description`, `part: "Parte 17 — Câmbio"`
    - Criar `01-jornada.mdx` — do pedido do cliente ao contrato de câmbio: documentação, cotação e confirmação
    - Criar `02-backoffice.mdx` — liquidação pronto vs. futuro, posição cambial do banco, SISBACEN e RDE (Registro Declaratório Eletrônico)
    - _Requisitos: 4.4, 4.5_

- [x] 8. Parte 16 — Renda Variável (Req 3)
  - [x] 8.1 Criar capítulo 56 — `56-renda-variavel-conceitos/`
    - Criar `content/chapters/56-renda-variavel-conceitos/index.md` com frontmatter: `title`, `order: 56`, `description`, `part: "Parte 16 — Produtos de Investimento"`
    - Criar `01-conceitos.mdx` — ações (ON e PN), BDRs, ETFs, papel do banco como corretora, liquidação D+2 na B3; referência cruzada a cap. 52
    - Criar `02-eventos-corporativos.mdx` — dividendos (data ex, data de pagamento), JCP, bonificações, splits, grupamentos e IR sobre ganho de capital (15%/20%, isenção R$ 20k)
    - _Requisitos: 3.1, 3.2, 3.3, 3.4, 3.6_

  - [x] 8.2 Criar capítulo 57 — `57-jornada-renda-variavel/`
    - Criar `content/chapters/57-jornada-renda-variavel/index.md` com frontmatter: `title`, `order: 57`, `description`, `part: "Parte 16 — Produtos de Investimento"`
    - Criar `01-jornada.mdx` — Home Broker, tipos de ordem (mercado, limitada, stop), controles de risco para day trade
    - Criar `02-backoffice.mdx` — registro de ativos na B3 em nome do investidor, CBLC e processamento de eventos corporativos no backoffice
    - _Requisitos: 3.3, 3.4, 3.5_

  - [x] 8.3 Criar capítulo 58 — `58-simulacao-renda-variavel/`
    - Criar `content/chapters/58-simulacao-renda-variavel/index.md` com frontmatter: `title`, `order: 58`, `description`, `part: "Parte 16 — Produtos de Investimento"`
    - Criar `01-simulacao.mdx` com frontmatter incluindo `simulation: true` — referencia o componente `StockPortfolioSimulator`
    - _Requisitos: 3.2, 3.6_

  - [-]* 8.4 Criar componente `StockPortfolioSimulator.tsx`
    - Criar `src/components/simulations/StockPortfolioSimulator.tsx` como Preact island
    - Implementar simulador de carteira: compra/venda de ações, cálculo de ganho de capital, IR via DARF e verificação de isenção mensal de R$ 20k
    - _Requisitos: 3.6_

- [x] 9. Checkpoint — Verificar capítulos 56–60
  - Garantir que todos os `index.md` e `.mdx` dos capítulos 56–60 existem com frontmatter válido.
  - Garantir que referências cruzadas a caps. 52 e 37 estão presentes nos arquivos indicados no design.

- [x] 10. Parte 18 — Seguros e Bancassurance (Req 5)
  - [x] 10.1 Criar capítulo 61 — `61-seguros-conceitos/`
    - Criar `content/chapters/61-seguros-conceitos/index.md` com frontmatter: `title`, `order: 61`, `description`, `part: "Parte 18 — Seguros e Consórcio"`
    - Criar `01-conceitos.mdx` — banco como canal de distribuição, seguradora parceira, comissão, principais produtos (vida, residencial, auto)
    - Criar `02-seguro-prestamista.mdx` — vinculação ao contrato de crédito, cobertura de morte/invalidez, regras de venda casada (BACEN), Resolução CNSP; referência cruzada a cap. 47
    - _Requisitos: 5.1, 5.2, 5.3, 5.5_

  - [x] 10.2 Criar capítulo 62 — `62-jornada-seguros/`
    - Criar `content/chapters/62-jornada-seguros/index.md` com frontmatter: `title`, `order: 62`, `description`, `part: "Parte 18 — Seguros e Consórcio"`
    - Criar `01-jornada.mdx` — do pedido à emissão da apólice: análise de risco, aceitação e cobrança do prêmio
    - Criar `02-backoffice.mdx` — processamento de sinistro, cancelamento de apólice e reconhecimento de receita de comissão pelo banco
    - _Requisitos: 5.4_

- [x] 11. Parte 18 — Consórcio (Req 6)
  - [x] 11.1 Criar capítulo 63 — `63-consorcio-conceitos/`
    - Criar `content/chapters/63-consorcio-conceitos/index.md` com frontmatter: `title`, `order: 63`, `description`, `part: "Parte 18 — Seguros e Consórcio"`
    - Criar `01-conceitos.mdx` — grupo de consorciados, sorteio mensal, lance (livre, fixo e embutido), carta de crédito e regras de uso
    - _Requisitos: 6.1, 6.2, 6.3_

  - [x] 11.2 Criar capítulo 64 — `64-jornada-consorcio/`
    - Criar `content/chapters/64-jornada-consorcio/index.md` com frontmatter: `title`, `order: 64`, `description`, `part: "Parte 18 — Seguros e Consórcio"`
    - Criar `01-jornada.mdx` — do ingresso no grupo à contemplação: fluxo do consorciado e uso da carta de crédito
    - Criar `02-backoffice.mdx` — controle de cotas, processamento de assembleias mensais, inadimplência, fundo de reserva obrigatório e encerramento de grupo
    - _Requisitos: 6.4, 6.5_

- [x] 12. Checkpoint — Verificar capítulos 61–64
  - Garantir que todos os `index.md` e `.mdx` dos capítulos 61–64 existem com frontmatter válido.
  - Garantir que referência cruzada a cap. 47 está presente em `61-seguros-conceitos/02-seguro-prestamista.mdx`.

- [x] 13. Parte 19 — Open Finance (Req 9)
  - [x] 13.1 Criar capítulo 65 — `65-open-finance-conceitos/`
    - Criar `content/chapters/65-open-finance-conceitos/index.md` com frontmatter: `title`, `order: 65`, `description`, `part: "Parte 19 — Open Finance e BaaS"`
    - Criar `01-conceitos.mdx` — quatro fases do Open Finance brasileiro, modelo de consentimento (12 meses, granularidade, revogação), OAuth 2.0/FAPI; referência cruzada a cap. 13
    - Criar `02-pisp-agregacao.mdx` — PISP (terceiro iniciando Pix em nome do cliente), fluxo de autorização, agregação de saldos/extratos de múltiplos bancos, Open Insurance
    - _Requisitos: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [x] 13.2 Criar capítulo 66 — `66-jornada-open-finance/`
    - Criar `content/chapters/66-jornada-open-finance/index.md` com frontmatter: `title`, `order: 66`, `description`, `part: "Parte 19 — Open Finance e BaaS"`
    - Criar `01-jornada.mdx` — do pedido de consentimento à entrega de dados: fluxo do cliente e do banco receptor
    - Criar `02-backoffice.mdx` — endpoints padronizados, requisito de 99,5% de uptime, monitoramento e obrigações regulatórias do BACEN
    - _Requisitos: 9.3, 9.4_

- [x] 14. Parte 19 — BaaS e Fintechs (Req 10)
  - [x] 14.1 Criar capítulo 67 — `67-baas-fintechs/`
    - Criar `content/chapters/67-baas-fintechs/index.md` com frontmatter: `title`, `order: 67`, `description`, `part: "Parte 19 — Open Finance e BaaS"`
    - Criar `01-conceitos.mdx` — BaaS como provedor de infraestrutura via APIs (cartão white-label, contas de pagamento, crédito para marketplaces), embedded finance; referência cruzada a cap. 65 e cap. 02
    - Criar `02-licencas-e-riscos.mdx` — licenças BACEN para fintechs (IP, SCD, SEP), riscos do modelo BaaS (reputação, operacional, regulatório)
    - _Requisitos: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 15. Testes de propriedade — `content-structure.test.ts`
  - [x] 15.1 Criar arquivo `src/tests/content-structure.test.ts` com configuração base
    - Importar `vitest`, `fast-check`, `fs` e `gray-matter`
    - Configurar `fc.configureGlobal({ numRuns: 100 })`
    - Implementar helpers: `readChapterDirs()` (lista pastas em `content/chapters/`) e `readAllMdxFiles()` (lista recursiva de `.mdx`)
    - _Requisitos: 1–10 (integridade estrutural)_

  - [ ]* 15.2 Implementar teste de Propriedade 1 — frontmatter completo em `index.md`
    - **Propriedade 1: Frontmatter completo em index.md**
    - **Valida: Requisitos 1.3, 2.6, 3.4, 4.4, 4.5, 5.4, 6.4, 7.7, 8.6, 9.4, 10.4**
    - Para qualquer subconjunto aleatório de pastas de capítulo, `index.md` deve existir e conter `title`, `order`, `description` e `part` não-vazios
    - Usar `fc.property` com `fc.subarray` sobre a lista de pastas

  - [ ]* 15.3 Implementar teste de Propriedade 2 — numeração sequencial e única
    - **Propriedade 2: Numeração sequencial e única**
    - **Valida: Convenção de numeração dos Requisitos 1–10**
    - Coletar todos os valores de `order` dos `index.md`, verificar `Set.size === length` (unicidade) e `max - min + 1 === length` (sem lacunas)
    - Usar `fc.property` com `fc.constant` sobre o conjunto completo de capítulos

  - [ ]* 15.4 Implementar teste de Propriedade 3 — frontmatter válido em seções `.mdx`
    - **Propriedade 3: Frontmatter válido em seções .mdx**
    - **Valida: Requisitos 1–10**
    - Para qualquer subconjunto aleatório de arquivos `.mdx`, frontmatter deve conter `title` e `order` não-vazios
    - Usar `fc.property` com `fc.subarray` sobre a lista de arquivos `.mdx`

  - [ ]* 15.5 Implementar teste de Propriedade 4 — referências cruzadas válidas
    - **Propriedade 4: Referências cruzadas válidas**
    - **Valida: Mapa de referências cruzadas do design**
    - Para qualquer arquivo `.mdx` com referência `cap. NN`, verificar que existe pasta em `content/chapters/` com prefixo numérico correspondente
    - Extrair referências com regex `/cap\.\s*(\d+)/gi`, verificar existência de pasta com zero-padding

  - [x] 15.6 Implementar testes de exemplo (unit)
    - Verificar que os 21 capítulos 47–67 existem como pastas
    - Verificar que cada capítulo tem o número correto de seções `.mdx` conforme tabela do design
    - Verificar que caps. 49 e 58 têm `simulation: true` no frontmatter de `01-simulacao.mdx`
    - Verificar que nenhum capítulo novo (47–67) colide com capítulos existentes (00–46)
    - _Requisitos: 1–10_

- [x] 16. Checkpoint final — Garantir que todos os testes passam
  - Garantir que todos os testes passam, perguntar ao usuário se houver dúvidas.

## Notas

- Tasks marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Os componentes de simulação (tasks 1.4 e 8.4) devem ser criados antes de executar o build, pois `01-simulacao.mdx` com `simulation: true` importa o componente correspondente
- Cada task referencia requisitos específicos para rastreabilidade
- Os testes de propriedade (tasks 15.2–15.5) validam invariantes universais sobre o conjunto completo de capítulos usando `fast-check`
- Os testes de exemplo (task 15.6) validam casos específicos e condições de borda
