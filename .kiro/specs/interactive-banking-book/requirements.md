# Requirements Document

## Introduction

Frontend interativo para hospedar um livro digital que explica como bancos comerciais funcionam. O sistema oferece navegação por capítulos, simulações interativas de conceitos bancários (como criação de dinheiro via empréstimos), glossário integrado, suporte a diagramas e animações, progresso salvo localmente, e suporte a temas claro/escuro. O design é responsivo e pensado para ser visualmente agradável e fácil de navegar.

## Glossary

- **Book**: O livro digital interativo sobre bancos comerciais
- **Chapter**: Uma divisão principal do conteúdo do Book
- **Section**: Uma subdivisão dentro de um Chapter
- **Reader**: O usuário que acessa e lê o Book
- **Simulation**: Componente interativo que demonstra um conceito bancário através de inputs e visualizações dinâmicas
- **Glossary_Panel**: Painel lateral ou modal que exibe definições de termos financeiros
- **Progress_Tracker**: Mecanismo que registra e persiste o progresso de leitura do Reader no armazenamento local do navegador
- **Theme_Manager**: Componente responsável por alternar e persistir o tema visual (claro/escuro)
- **Diagram**: Representação visual estática ou animada de fluxos e conceitos bancários
- **Navigation_Menu**: Menu lateral ou superior que lista Chapters e Sections do Book
- **Content_Loader**: Componente responsável por processar e renderizar os arquivos de conteúdo Markdown incluídos no bundle estático da aplicação
- **Content_Repository**: Repositório GitHub onde os arquivos Markdown dos Chapters e Sections são versionados e hospedados junto ao código-fonte
- **Static_Site**: A aplicação compilada e publicada como site estático no GitHub Pages, sem servidor backend
- **CI_CD_Pipeline**: Workflow do GitHub Actions responsável por compilar e publicar o Static_Site automaticamente a cada push no repositório

---

## Requirements

### Requirement 1: Navegação por Capítulos e Seções

**User Story:** As a Reader, I want to navigate between chapters and sections through a clear menu, so that I can find and access content easily.

#### Acceptance Criteria

1. THE Navigation_Menu SHALL exibir todos os Chapters e suas Sections em ordem hierárquica
2. WHEN o Reader clica em um Chapter ou Section no Navigation_Menu, THE Book SHALL rolar ou navegar até o conteúdo correspondente
3. WHEN o Reader está em uma Section, THE Navigation_Menu SHALL destacar visualmente o item ativo
4. THE Navigation_Menu SHALL permanecer acessível em telas de desktop como painel lateral fixo
5. WHEN o Reader acessa o Book em um dispositivo móvel, THE Navigation_Menu SHALL ser recolhível e acessível via botão de menu
6. THE Book SHALL atribuir uma URL única (hash ou path) a cada Section, permitindo ao Reader compartilhar ou acessar diretamente aquela Section via link
7. WHEN o Reader seleciona um item no Navigation_Menu, THE Book SHALL realizar scroll suave até o conteúdo alvo

---

### Requirement 2: Persistência de Progresso de Leitura

**User Story:** As a Reader, I want my reading progress to be saved automatically, so that I can continue from where I left off on future visits.

#### Acceptance Criteria

1. WHEN o Reader navega para uma Section, THE Progress_Tracker SHALL registrar a Section como visitada no armazenamento local do navegador
2. WHEN o Reader retorna ao Book após fechar o navegador, THE Book SHALL restaurar a última Section visitada automaticamente
3. THE Navigation_Menu SHALL exibir um indicador visual nas Sections já visitadas pelo Reader
4. THE Progress_Tracker SHALL calcular e exibir o percentual de Sections visitadas em relação ao total de Sections do Book
5. WHEN o Reader solicita redefinir o progresso, THE Progress_Tracker SHALL apagar todos os dados de progresso do armazenamento local e reiniciar o indicador para zero

---

### Requirement 3: Simulações Interativas de Conceitos Bancários

**User Story:** As a Reader, I want to interact with simulations of banking concepts, so that I can understand abstract processes like money creation through hands-on experimentation.

#### Acceptance Criteria

1. WHEN o Reader acessa uma Section que contém uma Simulation, THE Book SHALL renderizar o componente de Simulation embutido no conteúdo
2. WHEN o Reader altera um parâmetro de entrada em uma Simulation, THE Simulation SHALL recalcular e exibir os resultados atualizados em tempo real, sem recarregar a página
3. THE Simulation de criação de dinheiro via empréstimos SHALL aceitar como entrada o valor do depósito inicial e a taxa de reserva fracionária, e SHALL exibir o multiplicador monetário resultante e o total de dinheiro criado
4. WHEN o Reader redefine uma Simulation, THE Simulation SHALL restaurar todos os parâmetros e resultados para os valores padrão
5. IF um parâmetro de entrada da Simulation receber um valor fora do intervalo permitido, THEN THE Simulation SHALL exibir uma mensagem de erro descritiva e impedir o cálculo com o valor inválido
6. THE Simulation SHALL garantir que todos os controles de entrada sejam operáveis por teclado, com navegação via Tab entre elementos, ativação via Enter ou Space, e foco visível em todos os elementos interativos

---

### Requirement 4: Glossário de Termos Financeiros

**User Story:** As a Reader, I want to access definitions of financial terms without leaving the current page, so that I can understand the content without losing my reading context.

#### Acceptance Criteria

1. THE Book SHALL identificar e destacar visualmente os termos financeiros definidos no Glossary_Panel dentro do texto dos Chapters e Sections
2. WHEN o Reader clica em um termo destacado, THE Glossary_Panel SHALL exibir a definição do termo sem navegar para outra página
3. WHEN o Reader fecha o Glossary_Panel, THE Book SHALL retornar o foco para a posição de leitura anterior
4. THE Glossary_Panel SHALL permitir que o Reader pesquise termos por texto livre, exibindo resultados filtrados em tempo real
5. THE Book SHALL permitir que novos termos sejam adicionados ao Glossary_Panel através de arquivos Markdown no Content_Repository, sem alteração de código-fonte da aplicação

---

### Requirement 5: Suporte a Diagramas e Animações

**User Story:** As a Reader, I want to see diagrams and animations that illustrate money flows and banking processes, so that I can understand complex concepts visually.

#### Acceptance Criteria

1. THE Book SHALL renderizar Diagrams estáticos definidos em formato de dados estruturado (ex: JSON ou Markdown estendido) dentro do conteúdo das Sections
2. WHEN o Reader visualiza uma Section com um Diagram animado, THE Diagram SHALL iniciar a animação automaticamente quando entrar na área visível da tela (viewport)
3. WHEN o Reader clica em um elemento de um Diagram interativo, THE Diagram SHALL exibir informações adicionais sobre o elemento selecionado
4. IF o navegador do Reader não suportar animações CSS ou SVG, THEN THE Book SHALL exibir uma versão estática equivalente do Diagram
5. THE Book SHALL suportar Diagrams de fluxo de dinheiro entre banco central, bancos comerciais e clientes
6. THE Book SHALL garantir que todos os Diagrams possuam texto alternativo descritivo via atributo alt ou aria-label, descrevendo o conteúdo visual para leitores de tela

---

### Requirement 6: Tema Claro e Escuro

**User Story:** As a Reader, I want to switch between light and dark themes, so that I can read comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Theme_Manager SHALL disponibilizar um controle visível para alternar entre o tema claro e o tema escuro
2. WHEN o Reader alterna o tema, THE Book SHALL aplicar o novo tema a toda a interface imediatamente, sem recarregar a página
3. THE Theme_Manager SHALL persistir a preferência de tema do Reader no armazenamento local do navegador
4. WHEN o Reader acessa o Book pela primeira vez, THE Theme_Manager SHALL aplicar o tema correspondente à preferência do sistema operacional do Reader (prefers-color-scheme)
5. WHILE o tema escuro estiver ativo, THE Book SHALL garantir que todos os textos, ícones e Diagrams mantenham contraste mínimo de 4.5:1 conforme WCAG 2.1 AA

---

### Requirement 7: Design Responsivo

**User Story:** As a Reader, I want the book to be fully usable on mobile devices, so that I can read and interact with the content on any screen size.

#### Acceptance Criteria

1. THE Book SHALL adaptar o layout para telas com largura mínima de 320px sem perda de funcionalidade ou conteúdo
2. WHEN o Reader acessa o Book em um dispositivo com tela menor que 768px, THE Book SHALL reorganizar o layout para uma coluna única, ocultando o Navigation_Menu lateral
3. THE Book SHALL garantir que todos os elementos interativos (botões, links, controles de Simulation) possuam área de toque mínima de 44x44 pixels em dispositivos móveis
4. WHEN o Reader rotaciona o dispositivo móvel, THE Book SHALL reajustar o layout para a nova orientação sem perda de estado ou progresso
5. THE Book SHALL carregar e renderizar o conteúdo inicial em dispositivos móveis em menos de 3 segundos em conexões 4G
6. WHEN o Reader acessa o Book em dispositivo com tela entre 768px e 1024px, THE Book SHALL exibir o Navigation_Menu em modo compacto com ícones ou versão reduzida, sem ocultar completamente o menu

---

### Requirement 8: Extensibilidade de Conteúdo via Repositório Git

**User Story:** As a content author, I want to add new chapters and sections by committing Markdown files to the repository, so that the book can grow incrementally without modifying application code.

#### Acceptance Criteria

1. THE Content_Repository SHALL armazenar os arquivos Markdown de Chapters e Sections no mesmo repositório Git da aplicação, sob um diretório de conteúdo dedicado
2. WHEN um novo arquivo Markdown é adicionado ao diretório de conteúdo e commitado, THE Book SHALL incluir o Chapter ou Section correspondente na Navigation_Menu automaticamente após o próximo build e deploy
3. THE Book SHALL suportar metadados por Section definidos em frontmatter YAML no próprio arquivo Markdown, incluindo título, ordem de exibição, e referências a Simulations e Diagrams associados
4. IF um arquivo de conteúdo referenciado não for encontrado no bundle estático, THEN THE Book SHALL exibir uma mensagem de erro descritiva no lugar do conteúdo ausente, sem interromper a renderização dos demais Chapters e Sections
5. THE Book SHALL suportar conteúdo escrito em Markdown com extensões para embutir Simulations e Diagrams via sintaxe de componentes customizados
6. THE Static_Site SHALL ser gerado sem dependência de servidor backend, com todo o conteúdo incluído no bundle de build

---

### Requirement 9: Deploy Automático via GitHub Pages e GitHub Actions

**User Story:** As a content author, I want the site to be published automatically whenever I push changes to the repository, so that updates to content or code are reflected without manual deployment steps.

#### Acceptance Criteria

1. THE CI_CD_Pipeline SHALL executar automaticamente o build da aplicação a cada push na branch principal do Content_Repository
2. WHEN o build é concluído com sucesso, THE CI_CD_Pipeline SHALL publicar o Static_Site no GitHub Pages sem intervenção manual
3. IF o build falhar, THEN THE CI_CD_Pipeline SHALL interromper o deploy e registrar o erro no log de execução do GitHub Actions, sem sobrescrever a versão publicada anteriormente
4. THE Static_Site publicado no GitHub Pages SHALL ser acessível via URL pública dentro de 5 minutos após a conclusão do CI_CD_Pipeline
5. THE CI_CD_Pipeline SHALL instalar dependências, compilar os assets e gerar os arquivos estáticos finais em uma única execução de workflow

---

### Requirement 10: Design Visual e Experiência de Leitura

**User Story:** As a Reader, I want the book to have a visually appealing and inviting design, so that I feel motivated to read continuously and the content is easy to absorb.

#### Acceptance Criteria

1. THE Book SHALL utilizar uma família tipográfica serif ou sans-serif de alta legibilidade para o corpo do texto, com tamanho mínimo de 16px e altura de linha mínima de 1.6 para Sections de conteúdo
2. THE Book SHALL aplicar espaçamento entre parágrafos de no mínimo 1.2em e margens laterais que limitem a largura do bloco de texto a no máximo 75 caracteres por linha em telas desktop, garantindo conforto de leitura
3. THE Book SHALL adotar uma paleta de cores com no máximo 5 cores primárias definidas em variáveis CSS, onde a cor de fundo e a cor do texto principal atendam contraste mínimo de 7:1 conforme WCAG 2.1 AAA
4. WHEN o Reader permanece em uma Section por mais de 30 segundos sem interação, THE Book SHALL manter o layout estável, sem animações automáticas, banners ou elementos que desviem o foco do conteúdo
5. THE Book SHALL aplicar hierarquia visual consistente entre títulos de Chapter (h1), títulos de Section (h2) e subtítulos (h3), com escala tipográfica modular de razão mínima de 1.25x entre cada nível hierárquico consecutivo
6. THE Book SHALL utilizar uma fonte distinta de display ou serif para títulos (h1, h2, h3) e uma fonte otimizada para legibilidade no corpo do texto, ambas provenientes de fontes web gratuitas (Google Fonts ou equivalente), carregadas com font-display: swap
7. WHEN o Reader passa o cursor sobre um link interno ou termo do Glossary_Panel, THE Book SHALL exibir um indicador visual de hover com transição de no máximo 200ms, sem deslocamento de layout
8. THE Book SHALL utilizar espaçamento interno (padding) mínimo de 24px nas áreas de conteúdo principal em todas as resoluções, evitando que o texto encoste nas bordas da tela
9. THE Book SHALL aplicar espaçamento vertical mínimo de 3rem entre blocos de conteúdo distintos (entre Sections, entre Diagrams e parágrafos, e entre Simulations e o texto adjacente)
10. THE Book SHALL renderizar callouts, blockquotes e notas com estilo visual diferenciado, incluindo borda lateral colorida de no mínimo 4px e cor de fundo com opacidade reduzida em relação ao fundo principal, sem interromper o fluxo de leitura do conteúdo ao redor
11. WHEN o Reader navega entre Sections, THE Book SHALL aplicar uma transição de fade-in com duração máxima de 300ms no conteúdo entrante; IF o Reader tiver configurado prefers-reduced-motion no sistema operacional, THEN THE Book SHALL suprimir a animação e exibir o conteúdo imediatamente
12. THE Book SHALL renderizar imagens e ilustrações com border-radius mínimo de 8px, sombra sutil (box-shadow com opacidade máxima de 0.15), e legendas tipograficamente diferenciadas do corpo do texto por tamanho reduzido (no máximo 0.875em) e estilo itálico
13. IF o Reader estiver utilizando o tema claro, THEN THE Book SHALL aplicar uma cor de fundo levemente off-white (luminosidade entre 95% e 99%) em vez de branco puro (#FFFFFF), reduzindo o cansaço visual durante leitura prolongada

---

### Requirement 11: SEO e Metadados

**User Story:** As a content author, I want each page and section to have proper SEO metadata, so that the book is discoverable via search engines and shareable on social media.

#### Acceptance Criteria

1. THE Book SHALL gerar um elemento `<title>` e uma meta description únicos para cada Section, refletindo o título e o resumo do conteúdo daquela Section
2. THE Book SHALL incluir Open Graph tags (`og:title`, `og:description`, `og:url`, `og:image`) em cada Section, permitindo pré-visualização correta ao compartilhar links em redes sociais
3. WHEN o CI_CD_Pipeline executa o build, THE Static_Site SHALL gerar automaticamente um arquivo sitemap.xml listando todas as URLs públicas de Chapters e Sections do Book
4. THE Book SHALL utilizar URLs semânticas e legíveis por humanos para cada Section, compostas pelo slug do Chapter e pelo slug da Section (ex: `/capitulo-1/criacao-de-dinheiro`), sem parâmetros de query ou identificadores numéricos arbitrários

---

### Requirement 12: Acessibilidade de Teclado e Leitores de Tela

**User Story:** As a Reader who relies on keyboard navigation or screen readers, I want the book to be fully operable without a mouse, so that I can access all content and interactions independently.

#### Acceptance Criteria

1. THE Book SHALL permitir navegação completa por teclado, incluindo Tab para avançar o foco, Shift+Tab para recuar, Enter para ativar links e botões, e Escape para fechar painéis e modais
2. THE Book SHALL definir ARIA landmarks para as regiões principais da interface, incluindo `role="navigation"` no Navigation_Menu, `role="main"` na área de conteúdo e `role="complementary"` no Glossary_Panel
3. THE Book SHALL exibir um skip link "Pular para o conteúdo" como primeiro elemento focável da página, tornando-o visível ao receber foco via teclado e oculto visualmente nos demais estados
4. WHEN o Reader navega para uma nova Section, THE Book SHALL anunciar o título da Section para leitores de tela via região `aria-live="polite"`, sem interromper a leitura em curso

---

### Requirement 13: Página Inicial (Landing/Capa)

**User Story:** As a Reader, I want a visually impactful landing page that presents the book and invites me to start reading, so that I understand what the book is about and feel motivated to begin.

#### Acceptance Criteria

1. THE Book SHALL exibir uma página inicial com o título do livro, uma descrição introdutória e um convite visual claro para iniciar a leitura, antes de qualquer conteúdo de Chapter
2. THE Book SHALL listar na página inicial todos os Chapters disponíveis, exibindo o título e uma breve descrição de cada Chapter
3. WHEN o Reader acessa a página inicial e possui progresso salvo pelo Progress_Tracker, THE Book SHALL exibir um call-to-action de "Continuar leitura" indicando a última Section visitada; IF não houver progresso salvo, THEN THE Book SHALL exibir um call-to-action de "Começar a leitura" apontando para o primeiro Chapter
4. THE Book SHALL aplicar na página inicial um design visualmente diferenciado do restante do conteúdo, com elementos de identidade visual do livro (tipografia de display, ilustração ou imagem de capa, e paleta de cores primária), estabelecendo o tom visual da experiência de leitura
