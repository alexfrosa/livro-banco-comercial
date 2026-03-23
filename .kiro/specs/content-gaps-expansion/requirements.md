# Documento de Requisitos — Expansão de Conteúdo (Content Gaps)

## Introdução

O Interactive Banking Book cobre os fundamentos de um banco comercial, mas ainda não aborda uma série de produtos e serviços que compõem o portfólio completo de um banco de varejo como o Itaú. Este spec define os requisitos para a criação de novos capítulos MDX que preencham esses gaps, mantendo o padrão editorial já estabelecido: conceitos → jornada/backoffice → simulação (quando aplicável).

O foco é **conteúdo educacional em pt-BR**. Não há alteração de código de aplicação — apenas novos arquivos em `content/chapters/`. Cada novo capítulo deve seguir a convenção `NN-kebab-slug/` com `index.md` de metadados e arquivos `.mdx` de seções.

## Glossário

- **Capítulo**: Pasta `NN-slug/` em `content/chapters/` com `index.md` e arquivos `.mdx`
- **Seção**: Arquivo `.mdx` individual dentro de um Capítulo
- **Leitor**: Pessoa que acessa o livro para aprender sobre bancos comerciais
- **Produto_Bancário**: Serviço ou instrumento financeiro oferecido por um banco ao cliente
- **Backoffice**: Processos internos do banco que suportam a operação de um Produto_Bancário
- **Jornada_Cliente**: Sequência de passos que o cliente percorre ao contratar ou usar um Produto_Bancário
- **Regulador**: Autoridade que supervisiona o produto (BACEN, SUSEP, PREVIC, CVM, B3)
- **Bancassurance**: Modelo de distribuição de seguros por meio de canais bancários
- **Consórcio**: Modalidade de poupança programada para aquisição de bens, regulada pelo BACEN
- **Open_Finance**: Ecossistema regulado pelo BACEN para compartilhamento de dados e iniciação de pagamentos entre instituições autorizadas
- **BaaS**: Banking as a Service — infraestrutura bancária oferecida por bancos a fintechs e empresas não-financeiras
- **Suitability**: Processo de adequação do perfil do investidor ao produto de investimento ofertado
- **Come_Cotas**: Mecanismo de antecipação semestral de IR em fundos de investimento abertos
- **Cota**: Fração do patrimônio de um fundo de investimento
- **Patrimônio_Líquido**: Valor total dos ativos de um fundo deduzido das obrigações
- **Chargeback**: Contestação de uma transação de cartão pelo portador, resultando em estorno
- **Intercâmbio**: Taxa paga pelo banco adquirente ao banco emissor em cada transação de cartão
- **Adquirente**: Instituição que processa transações de cartão para o estabelecimento comercial
- **Bandeira**: Rede de pagamento (Visa, Mastercard) que define regras e conecta emissores e adquirentes
- **Home_Broker**: Plataforma eletrônica para negociação de ativos de renda variável na B3
- **Custódia_B3**: Serviço de guarda e controle de ativos de renda variável na B3
- **Evento_Corporativo**: Ação da empresa emissora que afeta os ativos (dividendos, bonificações, splits, grupamentos)
- **SWIFT**: Society for Worldwide Interbank Financial Telecommunication — rede de mensageria para transferências internacionais
- **Câmbio_Comercial**: Operações de câmbio entre empresas e bancos para comércio exterior e remessas
- **Câmbio_Turismo**: Operações de câmbio para pessoas físicas (espécie, cartão pré-pago)
- **Fase_Acumulação**: Período de contribuições em um plano de previdência privada
- **Fase_Benefício**: Período de recebimento de renda em um plano de previdência privada
- **PGBL**: Plano Gerador de Benefício Livre — plano de previdência com dedução fiscal na fase de acumulação
- **VGBL**: Vida Gerador de Benefício Livre — plano de previdência sem dedução fiscal, IR apenas sobre rendimentos
- **Portabilidade_Previdência**: Transferência de recursos entre planos de previdência sem incidência de IR
- **SFH**: Sistema Financeiro de Habitação — financiamento imobiliário com regras e taxas reguladas
- **SFI**: Sistema de Financiamento Imobiliário — financiamento imobiliário sem as restrições do SFH
- **Alienação_Fiduciária**: Garantia em que o bem financiado fica em nome do credor até a quitação
- **CDC**: Crédito Direto ao Consumidor — modalidade de financiamento de bens de consumo
- **Leasing**: Arrendamento mercantil — o bem é alugado com opção de compra ao final
- **Capital_de_Giro**: Crédito de curto prazo para financiar as operações correntes de uma empresa
- **BNDES**: Banco Nacional de Desenvolvimento Econômico e Social — banco público de fomento
- **Embedded_Finance**: Integração de serviços financeiros em plataformas não-financeiras

---

## Requisitos

### Requisito 1: Previdência Privada (PGBL e VGBL)

**User Story:** Como Leitor, quero entender como funcionam os planos de previdência privada (PGBL e VGBL), para que eu possa compreender esse produto de captação de longo prazo e seu backoffice específico.

#### Critérios de Aceitação

1. THE Capítulo SHALL apresentar a diferença entre PGBL e VGBL, incluindo o tratamento tributário de cada modalidade na Fase_Acumulação e na Fase_Benefício
2. THE Capítulo SHALL explicar as tabelas de tributação disponíveis (progressiva e regressiva) e como a escolha impacta o planejamento fiscal do cliente
3. WHEN o Leitor lê a seção de backoffice, THE Capítulo SHALL descrever os processos de gestão de planos: cadastro de beneficiários, controle de contribuições, portabilidade entre planos (Portabilidade_Previdência) e resgate
4. THE Capítulo SHALL explicar a estrutura regulatória: SUSEP como regulador de seguradoras e PREVIC como regulador de fundos de pensão fechados, diferenciando previdência aberta de fechada
5. THE Capítulo SHALL descrever o papel do banco como distribuidor de planos de previdência e a relação com a seguradora parceira (entidade separada do banco)
6. IF o Leitor lê a seção de fase de benefício, THEN THE Capítulo SHALL explicar as modalidades de renda (renda vitalícia, renda por prazo certo, renda temporária) e como o banco/seguradora calcula e paga os benefícios

### Requisito 2: Fundos de Investimento

**User Story:** Como Leitor, quero entender como funcionam os fundos de investimento, para que eu possa compreender a estrutura de administração, gestão e custódia, e como o banco distribui esses produtos.

#### Critérios de Aceitação

1. THE Capítulo SHALL apresentar os principais tipos de fundos: renda fixa, multimercado, ações, cambial, FII (Fundo de Investimento Imobiliário) e FIP (Fundo de Investimento em Participações), com as características e público-alvo de cada tipo
2. THE Capítulo SHALL explicar a estrutura tripartite de um fundo: administrador (responsável legal e operacional), gestor (decisões de investimento) e custodiante (guarda dos ativos), e como essas funções podem ser exercidas por entidades distintas
3. THE Capítulo SHALL explicar o conceito de Cota e Patrimônio_Líquido, e como o valor da cota é calculado diariamente (marcação a mercado)
4. THE Capítulo SHALL descrever o Come_Cotas com profundidade: datas de incidência (último dia útil de maio e novembro), alíquotas por tipo de fundo (curto prazo 20%, longo prazo 15%), e impacto no retorno líquido do investidor
5. THE Capítulo SHALL explicar a distribuição de fundos de terceiros pelo banco e o processo de Suitability: coleta do perfil do investidor (conservador, moderado, arrojado) e adequação ao produto ofertado
6. WHEN o Leitor lê a seção de backoffice, THE Capítulo SHALL descrever os processos de aplicação e resgate de cotas, liquidação financeira (D+0 a D+30 dependendo do fundo) e emissão de informes de rendimentos

### Requisito 3: Renda Variável

**User Story:** Como Leitor, quero entender como o banco atua como corretora e distribuidora de renda variável, para que eu possa compreender a custódia de ações, o Home_Broker e os Eventos_Corporativos.

#### Critérios de Aceitação

1. THE Capítulo SHALL apresentar os principais instrumentos de renda variável: ações (ON e PN), BDRs (Brazilian Depositary Receipts) e ETFs (Exchange Traded Funds), com as características de cada um
2. THE Capítulo SHALL explicar o papel do banco como corretora/distribuidora: habilitação junto à B3, envio de ordens de compra e venda, e liquidação financeira (D+2 para ações)
3. THE Capítulo SHALL descrever a Custódia_B3: como os ativos ficam registrados na B3 em nome do investidor (não do banco), e o papel da CBLC (Câmara Brasileira de Liquidação e Custódia) na liquidação
4. WHEN o Leitor lê a seção de Eventos_Corporativos, THE Capítulo SHALL explicar dividendos (data ex, data de pagamento), juros sobre capital próprio (JCP), bonificações, splits e grupamentos, e como o backoffice do banco processa cada evento
5. THE Capítulo SHALL descrever o Home_Broker: interface de negociação, tipos de ordem (mercado, limitada, stop), e os controles de risco (limite de crédito para day trade)
6. THE Capítulo SHALL explicar a tributação de renda variável: IR de 15% sobre ganho de capital (20% para day trade), isenção para vendas mensais abaixo de R$ 20.000 em ações, e a responsabilidade do investidor pelo recolhimento via DARF

### Requisito 4: Câmbio

**User Story:** Como Leitor, quero entender as operações de câmbio de um banco, para que eu possa compreender câmbio turismo, câmbio comercial, remessas internacionais e a regulação cambial do BACEN.

#### Critérios de Aceitação

1. THE Capítulo SHALL diferenciar Câmbio_Turismo (pessoa física, espécie e cartão pré-pago) de Câmbio_Comercial (empresas, importação/exportação, remessas), incluindo os limites regulatórios e documentação exigida para cada modalidade
2. THE Capítulo SHALL explicar o spread cambial: diferença entre taxa de compra e taxa de venda, e como o banco forma o preço da operação de câmbio
3. THE Capítulo SHALL descrever o fluxo de uma remessa internacional via SWIFT: mensagem MT103, correspondentes bancários no exterior (correspondent banking), e os prazos de liquidação
4. WHEN o Leitor lê a seção de regulação, THE Capítulo SHALL explicar o papel do BACEN como regulador do mercado de câmbio, o SISBACEN como sistema de registro de operações, e as obrigações de reporte (RDE — Registro Declaratório Eletrônico)
5. THE Capítulo SHALL descrever o backoffice de câmbio: contrato de câmbio, liquidação (pronto vs. futuro), posição cambial do banco e os controles de risco de câmbio
6. IF o Leitor lê a seção sobre correspondentes bancários, THEN THE Capítulo SHALL explicar o modelo de correspondent banking: como bancos brasileiros mantêm contas nostro/vostro em bancos estrangeiros para liquidar operações internacionais

### Requisito 5: Seguros (Bancassurance)

**User Story:** Como Leitor, quero entender como o banco distribui seguros, para que eu possa compreender o modelo de bancassurance, os principais produtos e a relação com seguradoras parceiras.

#### Critérios de Aceitação

1. THE Capítulo SHALL apresentar os principais produtos de seguro distribuídos por bancos: seguro de vida, seguro residencial, seguro auto e seguro prestamista (vinculado a operações de crédito)
2. THE Capítulo SHALL explicar o modelo de Bancassurance: o banco como canal de distribuição, a seguradora parceira como responsável pelo risco, e como a receita de comissão é reconhecida pelo banco
3. THE Capítulo SHALL descrever o seguro prestamista com profundidade: vinculação ao contrato de crédito, cobertura de morte e invalidez, e as regras do BACEN sobre venda casada (o cliente não pode ser obrigado a contratar o seguro do banco)
4. WHEN o Leitor lê a seção de backoffice, THE Capítulo SHALL descrever os processos de emissão de apólice, cobrança de prêmio (geralmente debitado da conta corrente), sinistro e cancelamento
5. THE Capítulo SHALL explicar a regulação: SUSEP como regulador de seguros, e as regras de transparência na oferta de seguros por bancos (Resolução CNSP)

### Requisito 6: Consórcio

**User Story:** Como Leitor, quero entender como funciona o consórcio, para que eu possa compreender esse produto de poupança programada, seus mecanismos de contemplação e o backoffice específico.

#### Critérios de Aceitação

1. THE Capítulo SHALL explicar o conceito de consórcio: grupo de pessoas que contribuem mensalmente para um fundo comum, com o objetivo de adquirir um bem (imóvel, veículo, serviço)
2. THE Capítulo SHALL descrever os mecanismos de contemplação: sorteio mensal e lance (livre, fixo e embutido), e como o valor da carta de crédito é determinado
3. THE Capítulo SHALL explicar a carta de crédito: instrumento emitido após a contemplação, que o consorciado usa para adquirir o bem, e as regras para uso (o bem deve ser do tipo previsto no grupo)
4. WHEN o Leitor lê a seção de backoffice, THE Capítulo SHALL descrever os processos de gestão de grupos: controle de cotas, processamento de assembleias mensais, gestão de inadimplência e encerramento de grupo
5. THE Capítulo SHALL explicar a regulação pelo BACEN: autorização para administrar consórcios, fundo de reserva obrigatório, e as proteções ao consorciado (devolução de valores em caso de desistência)

### Requisito 7: Modalidades de Crédito

**User Story:** Como Leitor, quero entender as principais modalidades de crédito oferecidas por um banco, para que eu possa compreender as diferenças entre crédito pessoal, consignado, cheque especial, cartão, financiamento imobiliário, financiamento de veículos, capital de giro e linhas de fomento.

#### Critérios de Aceitação

1. THE Capítulo SHALL apresentar crédito pessoal sem garantia: características, público-alvo, taxas típicas (as mais altas do mercado), e por que o risco é maior para o banco
2. THE Capítulo SHALL descrever o cheque especial e o limite de crédito rotativo: como o limite é concedido, a taxa de juros (regulada pelo BACEN com teto de 8% a.m. desde 2019), e o impacto do uso prolongado no endividamento do cliente
3. THE Capítulo SHALL explicar o financiamento imobiliário com profundidade: diferença entre SFH e SFI, uso do FGTS, Alienação_Fiduciária como garantia, e os sistemas de amortização aplicados (SAC e Price, já cobertos no cap. 16, com referência cruzada)
4. THE Capítulo SHALL descrever o financiamento de veículos: CDC vs. Leasing, alienação fiduciária do veículo, e o processo de registro no DETRAN
5. THE Capítulo SHALL explicar capital de giro para empresas: modalidades (conta garantida, desconto de recebíveis, antecipação de cartão), prazos típicos e garantias aceitas
6. THE Capítulo SHALL descrever as linhas de fomento do BNDES: como o banco atua como agente repassador, as condições diferenciadas de taxa (TJLP/TLP), e os setores elegíveis
7. WHEN o Leitor lê a seção de backoffice, THE Capítulo SHALL descrever as diferenças operacionais entre as modalidades: originação, formalização de garantias, registro em cartório (imóvel) ou DETRAN (veículo), e gestão de inadimplência

### Requisito 8: Cartão de Crédito

**User Story:** Como Leitor, quero entender o ecossistema de cartão de crédito, para que eu possa compreender o ciclo de faturamento, as bandeiras, adquirentes, intercâmbio, chargeback e programas de pontos.

#### Critérios de Aceitação

1. THE Capítulo SHALL explicar o ciclo de faturamento do cartão: data de fechamento, data de vencimento, fatura, pagamento mínimo, rotativo e parcelado, e como os juros do rotativo são calculados
2. THE Capítulo SHALL descrever o ecossistema de quatro partes: portador (cliente), emissor (banco), adquirente (credenciadora), e Bandeira (Visa/Mastercard), e o fluxo financeiro de uma transação entre essas partes
3. THE Capítulo SHALL explicar o Intercâmbio: taxa paga pelo adquirente ao emissor, como é calculada (percentual do valor da transação), e por que ela existe (remunera o risco de crédito do emissor)
4. THE Capítulo SHALL descrever o processo de Chargeback: contestação pelo portador, prazos (até 180 dias), responsabilidade do estabelecimento, e o impacto no backoffice do banco emissor e do adquirente
5. THE Capítulo SHALL explicar programas de pontos e milhas: acúmulo por gasto, parcerias com companhias aéreas e varejistas, e o custo para o banco (passivo de pontos no balanço)
6. WHEN o Leitor lê a seção de backoffice, THE Capítulo SHALL descrever os processos de emissão de cartão, gestão de limite, processamento de fatura, cobrança de inadimplentes e bloqueio/desbloqueio

### Requisito 9: Open Finance

**User Story:** Como Leitor, quero entender o Open Finance em profundidade, para que eu possa compreender o compartilhamento de dados, consentimento, APIs, portabilidade e iniciação de pagamento.

#### Critérios de Aceitação

1. THE Capítulo SHALL explicar a estrutura do Open Finance brasileiro: as quatro fases de implementação (dados de produtos, dados de clientes, serviços transacionais, dados de outros produtos), e o cronograma regulatório do BACEN
2. THE Capítulo SHALL descrever o modelo de consentimento: como o cliente autoriza o compartilhamento de dados, o prazo máximo de 12 meses, a granularidade das permissões, e como o consentimento pode ser revogado
3. THE Capítulo SHALL explicar as APIs padronizadas do Open Finance: autenticação (OAuth 2.0 / FAPI), endpoints de dados cadastrais, transacionais e de produtos, e os requisitos de disponibilidade (99,5% de uptime)
4. WHEN o Leitor lê a seção de PISP, THE Capítulo SHALL descrever o Payment Initiation Service Provider: como um terceiro pode iniciar um Pix em nome do cliente, o fluxo de autorização, e a diferença em relação ao Pix direto pelo app do banco
5. THE Capítulo SHALL explicar a agregação de contas: como um app de gestão financeira pode consolidar saldos e extratos de múltiplos bancos com o consentimento do cliente
6. THE Capítulo SHALL mencionar o Open Insurance como extensão do modelo para o setor de seguros, com compartilhamento de dados de apólices e sinistros

### Requisito 10: Banking as a Service (BaaS) e Fintechs

**User Story:** Como Leitor, quero entender o modelo de Banking as a Service, para que eu possa compreender como bancos tradicionais oferecem infraestrutura para fintechs e como o embedded finance funciona.

#### Critérios de Aceitação

1. THE Capítulo SHALL explicar o conceito de BaaS: o banco como provedor de infraestrutura regulada (licença bancária, sistemas de pagamento, custódia) para fintechs e empresas não-financeiras via APIs
2. THE Capítulo SHALL descrever os modelos de parceria: banco como emissor de cartão para fintech (programa de cartão white-label), banco como custodiante de contas de pagamento, e banco como provedor de crédito para plataformas de marketplace
3. THE Capítulo SHALL explicar o Embedded_Finance: integração de serviços financeiros em plataformas não-financeiras (e-commerce, apps de mobilidade, ERPs), e como o banco participa dessa cadeia
4. WHEN o Leitor lê a seção regulatória, THE Capítulo SHALL descrever os tipos de licença do BACEN relevantes para fintechs: Instituição de Pagamento (IP), Sociedade de Crédito Direto (SCD) e Sociedade de Empréstimo entre Pessoas (SEP), e como cada uma se relaciona com bancos tradicionais
5. THE Capítulo SHALL descrever os riscos do modelo BaaS para o banco: risco de reputação (o banco responde pelos atos da fintech parceira), risco operacional (dependência de terceiros) e risco regulatório (responsabilidade solidária)

---

## Ordem de Implementação Recomendada

Os capítulos devem ser criados na seguinte ordem, considerando dependências de conteúdo e impacto educacional:

1. **Modalidades de Crédito** (Requisito 7) — expande o cap. 16 existente; alta demanda educacional
2. **Cartão de Crédito** (Requisito 8) — produto ubíquo, complementa modalidades de crédito
3. **Fundos de Investimento** (Requisito 2) — expande o cap. 37 existente
4. **Previdência Privada** (Requisito 1) — produto de captação de longo prazo
5. **Câmbio** (Requisito 4) — operação internacional, relativamente independente
6. **Renda Variável** (Requisito 3) — requer entendimento de fundos como base
7. **Seguros / Bancassurance** (Requisito 5) — produto de distribuição
8. **Consórcio** (Requisito 6) — produto regulado pelo BACEN
9. **Open Finance** (Requisito 9) — expande o cap. 13 existente
10. **BaaS / Fintechs** (Requisito 10) — tema mais avançado, depende de entendimento geral

## Convenções de Numeração

Os novos capítulos devem ser numerados a partir do próximo número disponível após o último capítulo existente. Com base na estrutura atual (capítulos 00–42), os novos capítulos iniciam em **43**. Cada tema pode ter múltiplas seções seguindo o padrão `01-conceitos.mdx`, `02-jornada.mdx`, `03-backoffice.mdx` e, quando aplicável, `04-simulacao.mdx`.
