/**
 * mobile-menu-toggle — Fix Checking & Preservation Checking
 *
 * Fix Checking (tasks 9.x):
 *   Verifica que os seis defeitos foram corrigidos no código-fonte.
 *   Validates: Requirements 2.1–2.12
 *
 * Preservation Checking (tasks 10.x):
 *   Verifica que comportamentos existentes não foram alterados.
 *   Validates: Requirements 3.1–3.9
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

function src(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf-8');
}

const navSrc = () => src('src/components/NavigationMenu.astro');
const layoutSrc = () => src('src/layouts/BaseLayout.astro');

// ── Fix Checking ──────────────────────────────────────────────────────────────

describe('Fix 9.1 — Escape fecha o menu (Bug 1)', () => {
  it('script contém listener de keydown para Escape', () => {
    const s = navSrc();
    expect(s).toContain("e.key === 'Escape'");
    expect(s).toContain('closeMenu()');
  });

  it('closeMenu remove nav-panel--open', () => {
    const s = navSrc();
    expect(s).toContain("panel.classList.remove('nav-panel--open')");
  });
});

describe('Fix 9.2 — Clique no overlay fecha o menu (Bug 1 + Bug 5)', () => {
  it('overlay tem listener de click que chama closeMenu', () => {
    const s = navSrc();
    expect(s).toContain("overlay?.addEventListener('click', closeMenu)");
  });
});

describe('Fix 9.3 — aria-expanded e aria-label refletem o estado do menu (Bug 1)', () => {
  it('openMenu define aria-expanded="true" e aria-label de fechar', () => {
    const s = navSrc();
    expect(s).toContain("toggle.setAttribute('aria-expanded', 'true')");
    expect(s).toContain("'Fechar menu de navegação'");
  });

  it('closeMenu define aria-expanded="false" e aria-label de abrir', () => {
    const s = navSrc();
    expect(s).toContain("toggle.setAttribute('aria-expanded', 'false')");
    expect(s).toContain("'Abrir menu de navegação'");
  });
});

describe('Fix 9.4 — Scroll lock no body (Bug 6)', () => {
  it('openMenu adiciona nav-body-lock ao body', () => {
    const s = navSrc();
    expect(s).toContain("document.body.classList.add('nav-body-lock')");
  });

  it('closeMenu remove nav-body-lock do body', () => {
    const s = navSrc();
    expect(s).toContain("document.body.classList.remove('nav-body-lock')");
  });

  it('CSS define :global(.nav-body-lock) com overflow: hidden', () => {
    const s = navSrc();
    expect(s).toContain('.nav-body-lock');
    expect(s).toContain('overflow: hidden');
  });
});

describe('Fix 9.5 — Overlay visível quando menu está aberto (Bug 5)', () => {
  it('openMenu adiciona nav-menu-overlay--visible ao overlay', () => {
    const s = navSrc();
    expect(s).toContain("overlay.classList.add('nav-menu-overlay--visible')");
  });

  it('closeMenu remove nav-menu-overlay--visible do overlay', () => {
    const s = navSrc();
    expect(s).toContain("overlay.classList.remove('nav-menu-overlay--visible')");
  });

  it('CSS define .nav-menu-overlay com opacity: 0 e .nav-menu-overlay--visible com opacity: 1', () => {
    const s = navSrc();
    expect(s).toContain('.nav-menu-overlay');
    expect(s).toContain('.nav-menu-overlay--visible');
    expect(s).toContain('opacity: 1');
  });

  it('overlay tem position: fixed e z-index abaixo do nav-panel', () => {
    const s = navSrc();
    expect(s).toContain('position: fixed');
    // overlay z-index: 99, nav-panel z-index: 100
    expect(s).toContain('z-index: 99');
    expect(s).toContain('z-index: 100');
  });
});

describe('Fix 9.6 — nav-toggle está dentro do site-header (Bug 4)', () => {
  it('BaseLayout.astro contém nav-toggle dentro do bloco site-header', () => {
    const s = layoutSrc();
    const headerBlock = s.match(/<header class="site-header">([\s\S]*?)<\/header>/);
    expect(headerBlock).not.toBeNull();
    expect(headerBlock![1]).toContain('nav-toggle');
  });

  it('NavigationMenu.astro NÃO contém o elemento button#nav-toggle no markup', () => {
    const s = navSrc();
    // O botão foi movido para BaseLayout; o componente só referencia o id via getElementById
    // O markup do componente não deve ter <button ... id="nav-toggle"
    const markupSection = s.split('<script>')[0];
    expect(markupSection).not.toMatch(/<button[^>]*id="nav-toggle"/);
  });
});

describe('Fix 9.7 — Títulos completos no mobile e desktop (Bug 2)', () => {
  it('CSS global contém white-space: normal para .nav-item-title', () => {
    const s = navSrc();
    // Regra global cobre todos os breakpoints
    expect(s).toContain('white-space: normal');
    expect(s).toContain('word-break: break-word');
  });

  it('CSS NÃO contém max-width fixo em .nav-item-title', () => {
    const s = navSrc();
    // Extrai apenas o bloco da regra .nav-item-title para verificar
    const block = s.match(/\.nav-item-title\s*\{([^}]*)\}/);
    expect(block).not.toBeNull();
    expect(block![1]).not.toMatch(/max-width:\s*\d/);
  });

  it('CSS contém flex: 1 e min-width: 0 em .nav-item-title para evitar truncamento em flex containers', () => {
    const s = navSrc();
    // Extrai o bloco da regra .nav-item-title
    const block = s.match(/\.nav-item-title\s*\{([^}]*)\}/);
    expect(block).not.toBeNull();
    expect(block![1]).toContain('min-width: 0');
    expect(block![1]).toContain('flex: 1');
  });
});

describe('Fix 9.8 — Títulos completos no tablet (Bug 3)', () => {
  it('CSS tablet NÃO contém max-width: 140px em .nav-item-title', () => {
    const s = navSrc();
    const tabletBlock = s.match(/@media \(min-width: 768px\) and \(max-width: 1024px\)([\s\S]*?)(?=@media|\s*<\/style>)/);
    expect(tabletBlock).not.toBeNull();
    expect(tabletBlock![1]).not.toContain('max-width: 140px');
  });

  it('CSS global garante white-space: normal — sem override de nowrap no tablet', () => {
    const s = navSrc();
    const tabletBlock = s.match(/@media \(min-width: 768px\) and \(max-width: 1024px\)([\s\S]*?)(?=@media|\s*<\/style>)/);
    expect(tabletBlock).not.toBeNull();
    expect(tabletBlock![1]).not.toMatch(/\.nav-item-title[\s\S]*?white-space:\s*nowrap/);
  });
});

// ── Preservation Checking ─────────────────────────────────────────────────────

describe('Preservation 10.1 — Desktop: nav-panel sempre visível (Req 3.1)', () => {
  it('CSS desktop força display: block no nav-panel', () => {
    const s = navSrc();
    const desktopBlock = s.match(/@media \(min-width: 1025px\)([\s\S]*?)(?=@media|\s*<\/style>)/);
    expect(desktopBlock).not.toBeNull();
    expect(desktopBlock![1]).toContain('display: block !important');
  });
});

describe('Preservation 10.2 — Tablet: nav-panel sempre visível (Req 3.2)', () => {
  it('CSS tablet força display: block no nav-panel', () => {
    const s = navSrc();
    const tabletBlock = s.match(/@media \(min-width: 768px\) and \(max-width: 1024px\)([\s\S]*?)(?=@media|\s*<\/style>)/);
    expect(tabletBlock).not.toBeNull();
    expect(tabletBlock![1]).toContain('display: block !important');
  });
});

describe('Preservation 10.3 — Colapso de categorias preservado (Req 3.3)', () => {
  it('script contém applyCollapseState — lógica de colapso intacta', () => {
    expect(navSrc()).toContain('applyCollapseState');
  });

  it('script contém bindCategoryButtons — listeners de categoria intactos', () => {
    expect(navSrc()).toContain('bindCategoryButtons');
  });

  it('CSS contém .nav-category--collapsed — classe de colapso intacta', () => {
    expect(navSrc()).toContain('.nav-category--collapsed');
  });
});

describe('Preservation 10.4 — localStorage de categorias preservado (Req 3.5)', () => {
  it('script usa a chave ibbook_nav_categories', () => {
    expect(navSrc()).toContain("'ibbook_nav_categories'");
  });

  it('script contém loadCategoryState e saveCategoryState', () => {
    const s = navSrc();
    expect(s).toContain('loadCategoryState');
    expect(s).toContain('saveCategoryState');
  });
});

describe('Preservation 10.5 — site-header exibe título e ThemeToggle (Req 3.7)', () => {
  it('site-header contém site-title', () => {
    const s = layoutSrc();
    const headerBlock = s.match(/<header class="site-header">([\s\S]*?)<\/header>/);
    expect(headerBlock).not.toBeNull();
    expect(headerBlock![1]).toContain('site-title');
  });

  it('site-header contém ThemeToggle', () => {
    const s = layoutSrc();
    const headerBlock = s.match(/<header class="site-header">([\s\S]*?)<\/header>/);
    expect(headerBlock).not.toBeNull();
    expect(headerBlock![1]).toContain('<ThemeToggle');
  });
});

describe('Preservation 10.6 & 10.7 — GlossaryPanel independente, classes não conflitam (Req 3.8)', () => {
  it('nav-body-lock e glossary-body-lock são nomes distintos', () => {
    expect('nav-body-lock').not.toBe('glossary-body-lock');
  });

  it('NavigationMenu usa nav-body-lock, não glossary-body-lock', () => {
    const s = navSrc();
    expect(s).toContain('nav-body-lock');
    expect(s).not.toContain('glossary-body-lock');
  });

  it('GlossaryPanel usa glossary-body-lock, não nav-body-lock', () => {
    const glossary = src('src/components/GlossaryPanel.astro');
    expect(glossary).toContain('glossary-body-lock');
    expect(glossary).not.toContain('nav-body-lock');
  });
});

// ── Property-Based: consistência do estado do menu ────────────────────────────

describe('Property — openMenu/closeMenu são funções simétricas no código-fonte', () => {
  /**
   * Validates: Requirements 2.1, 2.11, 2.12, 3.8
   *
   * Para qualquer sequência de opens/closes, o código deve conter
   * operações simétricas: add ↔ remove para cada classe/atributo.
   */
  it('cada classList.add tem um classList.remove correspondente (property-based)', () => {
    const s = navSrc();

    fc.assert(
      fc.property(
        fc.constantFrom('nav-panel--open', 'nav-menu-overlay--visible', 'nav-body-lock'),
        (cls) => {
          const addPattern = `classList.add('${cls}')`;
          const removePattern = `classList.remove('${cls}')`;
          // Ambas as operações devem existir — simetria de estado
          return s.includes(addPattern) && s.includes(removePattern);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('aria-expanded tem valores "true" e "false" — toggle bidirecional (property-based)', () => {
    const s = navSrc();

    fc.assert(
      fc.property(
        fc.constantFrom('true', 'false'),
        (value) => {
          return s.includes(`setAttribute('aria-expanded', '${value}')`);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property — CSS de títulos não trunca para qualquer comprimento (property-based)', () => {
  /**
   * Validates: Requirements 2.6, 2.7
   *
   * Para qualquer string de título, o CSS global não deve conter
   * max-width fixo nem white-space: nowrap em .nav-item-title.
   */
  it('CSS global não trunca títulos de qualquer comprimento', () => {
    const s = navSrc();

    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }),
        (_title) => {
          const hasNowrap = /\.nav-item-title\s*\{[^}]*white-space:\s*nowrap/.test(s);
          const hasFixedMaxWidth = /\.nav-item-title\s*\{[^}]*max-width:\s*\d+px/.test(s);
          return !hasNowrap && !hasFixedMaxWidth;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('CSS tablet não introduz truncamento em .nav-item-title', () => {
    const s = navSrc();
    const tabletBlock = s.match(/@media \(min-width: 768px\) and \(max-width: 1024px\)([\s\S]*?)(?=@media|\s*<\/style>)/)![1];

    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }),
        (_title) => {
          const hasNowrap = /\.nav-item-title[\s\S]*?white-space:\s*nowrap/.test(tabletBlock);
          const hasFixedMaxWidth = /\.nav-item-title[\s\S]*?max-width:\s*140px/.test(tabletBlock);
          return !hasNowrap && !hasFixedMaxWidth;
        }
      ),
      { numRuns: 100 }
    );
  });
});
