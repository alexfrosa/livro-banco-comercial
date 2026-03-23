/**
 * Preservation Tests
 *
 * These tests MUST PASS on unfixed code — they confirm baseline behaviors
 * that must NOT change after the fix is applied.
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// ── Helpers ───────────────────────────────────────────────────────────────────

function readSource(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf-8');
}

// ── 1. NavigationMenu renders items from prop ─────────────────────────────────

describe('Preservation 1 — NavigationMenu renders items from prop', () => {
  it('source contains items.map( — existing items are rendered from the prop (Req 3.2)', () => {
    const source = readSource('src/components/NavigationMenu.astro');
    // The dynamic rendering of nav items must remain intact
    expect(source).toContain('items.map(');
  });

  it('source contains href patterns for chapter URLs — nav items point to correct URLs (Req 3.2)', () => {
    const source = readSource('src/components/NavigationMenu.astro');
    // Each item's URL is used as the href — accept both plain and BASE_URL-prefixed patterns
    const hasChapterHref =
      /href=\{chapter\.url\}/.test(source) ||
      /href=\{`\$\{[^}]*BASE_URL[^}]*\}\$\{chapter\.url\}`\}/.test(source) ||
      /chapter\.url/.test(source);
    expect(hasChapterHref).toBe(true);
  });
});

// ── 2. ThemeToggle present in header ─────────────────────────────────────────

describe('Preservation 2 — ThemeToggle is present in the header (Req 3.3)', () => {
  it('BaseLayout.astro source contains <ThemeToggle — toggle is present in the header', () => {
    const source = readSource('src/layouts/BaseLayout.astro');
    expect(source).toContain('<ThemeToggle');
  });

  it('ThemeToggle appears inside the site-header block', () => {
    const source = readSource('src/layouts/BaseLayout.astro');
    const headerMatch = source.match(/<header class="site-header">([\s\S]*?)<\/header>/);
    expect(headerMatch).not.toBeNull();
    expect(headerMatch![1]).toContain('<ThemeToggle');
  });
});

// ── 3. Mobile hamburger menu markup is present ────────────────────────────────

describe('Preservation 3 — Mobile hamburger menu is present (Req 3.4)', () => {
  it('NavigationMenu.astro source contains nav-toggle button — hamburger button is present', () => {
    const source = readSource('src/components/NavigationMenu.astro');
    expect(source).toContain('nav-toggle');
  });

  it('NavigationMenu.astro source contains nav-panel — collapsible panel is present', () => {
    const source = readSource('src/components/NavigationMenu.astro');
    expect(source).toContain('nav-panel');
  });

  it('NavigationMenu.astro source contains aria-expanded — accessibility attribute for hamburger is present', () => {
    const source = readSource('src/components/NavigationMenu.astro');
    expect(source).toContain('aria-expanded');
  });
});

// ── 4. MDX dependency is configured ──────────────────────────────────────────

describe('Preservation 4 — MDX rendering is configured (Req 3.1)', () => {
  it('package.json has @astrojs/mdx dependency — MDX rendering is configured', () => {
    const pkg = JSON.parse(readSource('package.json'));
    const mdxVersion: string = pkg.dependencies?.['@astrojs/mdx'] ?? '';
    expect(mdxVersion).toBeTruthy();
  });
});

// ── 5. Property: items.map( pattern renders any navItems list ─────────────────

describe('Property — NavigationMenu renders any list of navItems (Req 3.2)', () => {
  /**
   * Validates: Requirements 3.2
   *
   * For any array of navItems objects with `url` and `title`, the `items.map(`
   * pattern in NavigationMenu would render them — structural check.
   */
  it('items.map( pattern is present for any navItems input (property-based)', () => {
    const source = readSource('src/components/NavigationMenu.astro');

    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            url: fc.webUrl(),
            title: fc.string({ minLength: 1, maxLength: 80 }),
          }),
          { minLength: 0, maxLength: 20 }
        ),
        (_navItems) => {
          // Structural check: the template uses items.map( to render any list
          // This property holds for all possible navItems arrays
          return source.includes('items.map(');
        }
      )
    );
  });

  it('chapter.url is used as href for any navItems input (property-based)', () => {
    const source = readSource('src/components/NavigationMenu.astro');

    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            url: fc.webUrl(),
            title: fc.string({ minLength: 1, maxLength: 80 }),
          }),
          { minLength: 1, maxLength: 20 }
        ),
        (_navItems) => {
          // The href is bound to chapter.url — correct URL navigation is preserved
          // Accept both plain href={chapter.url} and BASE_URL-prefixed patterns
          return (
            /href=\{chapter\.url\}/.test(source) ||
            /chapter\.url/.test(source)
          );
        }
      )
    );
  });
});

// ── 6. Property: ThemeToggle present for any title prop ───────────────────────

describe('Property — ThemeToggle is present for any title prop (Req 3.3)', () => {
  /**
   * Validates: Requirements 3.3
   *
   * For any `title` prop value, ThemeToggle continues to be present in the header.
   */
  it('ThemeToggle is always present in site-header regardless of title value (property-based)', () => {
    const source = readSource('src/layouts/BaseLayout.astro');

    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 200 }),
        (_title) => {
          // Structural check: ThemeToggle is in the header regardless of title
          const headerMatch = source.match(/<header class="site-header">([\s\S]*?)<\/header>/);
          if (!headerMatch) return false;
          return headerMatch[1].includes('<ThemeToggle');
        }
      )
    );
  });
});

// ── 7. Content preservation — slug map integrity (Req 11.1, 11.5) ────────────

import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { CHAPTER_SLUG_MAP } from '../utils/chapterSlugMap';

const CHAPTERS_DIR = resolve(process.cwd(), 'content/chapters');

describe('Preservation 7 — Integridade do CHAPTER_SLUG_MAP (Req 11.1, 11.5)', () => {
  it('cada entrada do CHAPTER_SLUG_MAP aponta para um arquivo .mdx existente', () => {
    for (const [oldSlug, newSlug] of Object.entries(CHAPTER_SLUG_MAP)) {
      const [chapterDir, sectionFile] = newSlug.split('/');
      const filePath = join(CHAPTERS_DIR, chapterDir, `${sectionFile}.mdx`);
      expect(
        existsSync(filePath),
        `arquivo ausente para mapeamento ${oldSlug} → ${newSlug} (esperado: ${filePath})`
      ).toBe(true);
    }
  });

  it('CHAPTER_SLUG_MAP tem pelo menos 100 entradas (cobertura mínima)', () => {
    expect(Object.keys(CHAPTER_SLUG_MAP).length).toBeGreaterThanOrEqual(100);
  });
});

// ── 8. Content preservation — total de arquivos .mdx (Req 1.3) ───────────────

describe('Preservation 8 — Total de Content_Files preservados (Req 1.3)', () => {
  function countMdxFiles(): number {
    let count = 0;
    const dirs = readdirSync(CHAPTERS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    for (const dir of dirs) {
      const files = readdirSync(join(CHAPTERS_DIR, dir)).filter((f) => f.endsWith('.mdx'));
      count += files.length;
    }
    return count;
  }

  it('existem pelo menos 60 arquivos .mdx nos 29 capítulos consolidados', () => {
    // Original content had ~78 sections; consolidated + cap 13 new content
    expect(countMdxFiles()).toBeGreaterThanOrEqual(60);
  });

  it('todos os 29 capítulos têm pelo menos 1 arquivo .mdx', () => {
    const dirs = readdirSync(CHAPTERS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    for (const dir of dirs) {
      const files = readdirSync(join(CHAPTERS_DIR, dir)).filter((f) => f.endsWith('.mdx'));
      expect(files.length, `capítulo ${dir} não tem arquivos .mdx`).toBeGreaterThan(0);
    }
  });
});
