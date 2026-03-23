# Documento de Requisitos: Melhorias de Conteúdo e Referências

## Introdução

A avaliação especializada do livro identificou duas categorias de melhoria:

1. **Referências regulatórias**: o `references.yaml` atual tem apenas 7 entradas. O livro menciona dezenas de normas, leis e sistemas sem links para os documentos oficiais. É necessário cadastrar todas as referências identificadas e usar o componente `<Ref />` inline nos capítulos.

2. **Correções de conteúdo**: alguns capítulos contêm simplificações excessivas, normas desatualizadas ou lacunas em tópicos relevantes para profissionais de backoffice.

## Glossário

- **Reference_Registry**: arquivo `content/references.yaml` com todas as referências cadastradas
- **Inline_Ref**: uso do componente `<Ref id="..." />` no texto MDX para linkar a uma referência
- **Capítulo**: arquivo `.mdx` em `content/chapters/`

---

## Requisitos

### Requisito 1: Expansão do Reference_Registry

**User Story:** Como leitor, quero que todas as normas, leis e sistemas mencionados no livro tenham links para os documentos oficiais, para que eu possa consultar as fontes primárias.

#### Critérios de Aceitação

1. O Reference_Registry SHALL conter entradas para todas as normas e sistemas identificados na avaliação de conteúdo, cobrindo no mínimo as categorias: CMN, BACEN, Lei Federal, Medida Provisória
2. Cada entrada SHALL ter `id`, `title`, `issuer`, `category`, `url` preenchidos
3. Entradas de normas regulatórias SHALL ter `description` explicando o que a norma dispõe
4. Entradas de normas SHALL ter `publishedAt` quando a data de publicação for conhecida

### Requisito 2: Uso de Inline_Ref nos capítulos

**User Story:** Como leitor, quero que as menções a normas no texto sejam linkadas automaticamente para a seção de referências.

#### Critérios de Aceitação

1. Cada capítulo que menciona uma norma cadastrada SHALL usar o componente `<Ref id="..." />` na primeira menção relevante
2. O componente SHALL ser importado no frontmatter MDX de cada arquivo que o usa
3. Não SHALL haver referências inline com IDs que não existam no registry (o build falharia)

### Requisito 3: Correções de conteúdo — Macroeconomia (cap. 01)

**User Story:** Como leitor com conhecimento intermediário, quero que o multiplicador monetário seja explicado com suas limitações reais, para não criar uma visão mecanicista incorreta.

#### Critérios de Aceitação

1. O capítulo SHALL mencionar que o multiplicador `1/taxa de reserva` é um limite teórico máximo, não o valor real
2. O capítulo SHALL explicar que bancos mantêm reservas excedentes e o público retém espécie, reduzindo o multiplicador real
3. O capítulo SHALL mencionar que na visão moderna (endogenous money), o banco cria o depósito ao conceder o crédito — não precisa ter depósitos previamente

### Requisito 4: Correções de conteúdo — Regulação (cap. 02)

**User Story:** Como profissional de backoffice, quero que o capítulo de regulação mencione o Open Finance e o DREX, que já são realidades operacionais.

#### Critérios de Aceitação

1. O capítulo SHALL mencionar o Open Finance (antes Open Banking) e seu impacto no compartilhamento de dados
2. O capítulo SHALL mencionar o DREX (Real Digital / CBDC do BACEN) como projeto em fase piloto
3. O capítulo SHALL mencionar os buffers de capital do Basileia III (conservação, contracíclico, sistêmico)

### Requisito 5: Correções de conteúdo — KYC/AML (caps. 04 e 31)

**User Story:** Como analista de compliance, quero que os capítulos de KYC e AML referenciem as normas vigentes e o GAFI.

#### Critérios de Aceitação

1. O capítulo de KYC SHALL referenciar a Circular BACEN 3.978/2020 como norma vigente de PLD/FT
2. O capítulo de AML SHALL mencionar o GAFI (FATF) como organismo internacional que define os padrões globais
3. O capítulo de AML SHALL mencionar criptoativos como veículo emergente de lavagem de dinheiro

### Requisito 6: Correções de conteúdo — Pagamentos (cap. 13)

**User Story:** Como profissional de pagamentos, quero que o capítulo mencione o Pix Garantido e o Open Finance como evoluções relevantes do ecossistema.

#### Critérios de Aceitação

1. O capítulo SHALL mencionar o Pix Garantido (modalidade de crédito via Pix, lançada em 2023)
2. O capítulo SHALL mencionar o Open Finance e a iniciação de pagamento (PISP)
3. O capítulo SHALL expandir a explicação do MED (Mecanismo Especial de Devolução) com prazos e responsabilidades

### Requisito 7: Correções de conteúdo — Crédito (cap. 16)

**User Story:** Como analista de crédito, quero que o capítulo mencione a migração para IFRS 9 e o crédito consignado.

#### Critérios de Aceitação

1. O capítulo SHALL mencionar a migração da Resolução CMN 2.682 para o modelo de ECL (Expected Credit Loss) do IFRS 9 / Resolução CMN 4.966
2. O capítulo SHALL mencionar o crédito consignado como modalidade com características únicas (desconto em folha, menor risco)
3. O capítulo SHALL mencionar a portabilidade de crédito como processo de backoffice relevante

### Requisito 8: Correções de conteúdo — Investimentos (cap. 37)

**User Story:** Como profissional de backoffice de investimentos, quero que o capítulo mencione o come-cotas e as mudanças recentes na tributação de fundos.

#### Critérios de Aceitação

1. O capítulo SHALL explicar o come-cotas (antecipação semestral de IR em fundos de renda fixa)
2. O capítulo SHALL mencionar a mudança de 2023 na tributação de fundos fechados (exclusivos)

### Requisito 9: Correções de conteúdo — Fraudes (cap. 41)

**User Story:** Como profissional de prevenção a fraudes, quero que o capítulo mencione deepfakes como ameaça emergente à biometria.

#### Critérios de Aceitação

1. O capítulo SHALL mencionar fraudes com deepfake como ameaça emergente à validação biométrica
2. O capítulo SHALL mencionar os desafios da biometria como fator de autenticação diante dessa ameaça
