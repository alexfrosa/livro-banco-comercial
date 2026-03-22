# Missing Spacing After List — Tasks

## Tasks

- [ ] 1. Exploratory: verificar bug condition no código não-corrigido
  - [ ] 1.1 Inspecionar `computedStyle` de `ul`/`ol` no DOM e confirmar `marginBottom === "0px"` e `paddingLeft === "0px"` antes do fix
  - [ ] 1.2 Confirmar que `p` tem `marginBottom` com valor de `--spacing-paragraph` (controle positivo)
  - [ ] 1.3 Confirmar que `ul:last-child` já tem `marginBottom === "0px"` (comportamento a preservar)

- [ ] 2. Implementar o fix em `src/styles/global.css`
  - [ ] 2.1 Adicionar regra `ul, ol { margin-bottom: var(--spacing-paragraph); padding-left: 1.5rem; }` após o bloco de parágrafos
  - [ ] 2.2 Adicionar regra `ul:last-child, ol:last-child { margin-bottom: 0; }` para preservar req 3.1
  - [ ] 2.3 Adicionar regra `li { margin-bottom: 0.25em; }` para espaçamento interno dos itens

- [ ] 3. Fix Checking: verificar que o bug foi corrigido
  - [ ] 3.1 Verificar que `computedStyle(ul).marginBottom` agora retorna valor de `--spacing-paragraph`
  - [ ] 3.2 Verificar que `computedStyle(ol).marginBottom` agora retorna valor de `--spacing-paragraph`
  - [ ] 3.3 Verificar que `computedStyle(ul).paddingLeft === "24px"` (1.5rem)
  - [ ] 3.4 Verificar que `computedStyle(li).marginBottom === "0.25em"`

- [ ] 4. Preservation Checking: verificar que não há regressões
  - [ ] 4.1 Verificar que `ul:last-child` e `ol:last-child` têm `margin-bottom: 0` (req 3.1)
  - [ ] 4.2 Verificar que `blockquote p` e `.callout p` continuam com `margin-bottom: 0` (req 3.2)
  - [ ] 4.3 Verificar visualmente que listas dentro de `blockquote`/`.callout` não causam overflow com o `padding-left` adicionado (req 3.4)
  - [ ] 4.4 Verificar que o layout em viewport mobile (375px) não apresenta overflow ou colapso (req 3.5)
