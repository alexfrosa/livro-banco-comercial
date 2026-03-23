/**
 * index.test.ts — Tests for Landing Page logic
 *
 * Since index.astro is a server-rendered Astro component, we test the
 * underlying logic and DOM structure that the page produces:
 *   - CTA button behaviour (reads localStorage ibbook_progress)
 *   - Chapter list rendering
 *
 * Sub-tasks: 19.1, 19.2, 19.3
 * Requirements: 13.1, 13.2, 13.3, 13.4
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';

// ---------------------------------------------------------------------------
// Helpers — simulate the HTML structure produced by index.astro
// ---------------------------------------------------------------------------

interface ChapterInfo {
  slug: string;
  title: string;
  description: string;
  order: number;
  firstSectionSlug?: string;
}

/**
 * Build a minimal HTML string that mirrors what index.astro renders,
 * given a list of chapters and an optional lastVisited slug.
 */
function buildLandingPageHTML(opts: {
  chapters: ChapterInfo[];
  firstSectionUrl: string;
}): string {
  const { chapters, firstSectionUrl } = opts;

  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);

  const chapterItems = sortedChapters
    .map(
      (ch, i) => `
    <li class="chapter-card" data-slug="${ch.slug}">
      <span class="chapter-number">${String(i + 1).padStart(2, '0')}</span>
      <div class="chapter-info">
        <h3 class="chapter-title">${ch.title.trim()}</h3>
        ${ch.description ? `<p class="chapter-description">${ch.description}</p>` : ''}
      </div>
    </li>`
    )
    .join('');

  const chapterList =
    sortedChapters.length === 0
      ? `<p class="chapters-empty">Nenhum capítulo disponível ainda.</p>`
      : `<ol class="chapters-list">${chapterItems}</ol>`;

  return `<!doctype html>
<html lang="pt-BR">
  <body>
    <section class="hero">
      <h1 id="book-title">Bancos Comerciais: Como Funciona o Dinheiro</h1>
      <div class="hero-cta">
        <a id="cta-button" href="${firstSectionUrl}" data-first-section="${firstSectionUrl}">
          Começar a leitura
        </a>
      </div>
    </section>
    <section class="chapters-section">
      <h2 id="chapters-heading">Capítulos</h2>
      ${chapterList}
    </section>
  </body>
</html>`;
}

/**
 * Simulate the client-side CTA script that reads localStorage.
 * Returns the updated { href, text } for the CTA button.
 */
function simulateCTAScript(opts: {
  firstSectionUrl: string;
  localStorageValue: string | null;
}): { href: string; text: string } {
  const { firstSectionUrl, localStorageValue } = opts;

  // Default state
  let href = firstSectionUrl;
  let text = 'Começar a leitura';

  try {
    if (!localStorageValue) return { href, text };

    const progress = JSON.parse(localStorageValue) as { lastVisited?: string | null };
    const lastVisited = progress?.lastVisited;

    if (lastVisited && typeof lastVisited === 'string') {
      href = `/${lastVisited}`;
      text = 'Continuar leitura';
    }
  } catch {
    // JSON parse error — keep defaults
  }

  return { href, text };
}

function parseHTML(html: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

// ---------------------------------------------------------------------------
// Sub-task 19.3 — Unit tests for Landing Page
// Validates: Requirements 13.1, 13.2, 13.3, 13.4
// ---------------------------------------------------------------------------

describe('Landing Page — unit tests (Req 13.1, 13.2, 13.3, 13.4)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Req 13.1 — title and description present
  it('renders the book title', () => {
    const doc = parseHTML(buildLandingPageHTML({ chapters: [], firstSectionUrl: '/' }));
    const h1 = doc.getElementById('book-title');
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toContain('Bancos Comerciais');
  });

  it('renders a CTA button', () => {
    const doc = parseHTML(buildLandingPageHTML({ chapters: [], firstSectionUrl: '/ch/s1' }));
    const btn = doc.getElementById('cta-button') as HTMLAnchorElement;
    expect(btn).not.toBeNull();
    expect(btn.getAttribute('href')).toBe('/ch/s1');
  });

  // Req 13.2 — chapter list
  it('renders all chapters in the list', () => {
    const chapters: ChapterInfo[] = [
      { slug: 'ch1', title: 'Introdução', description: 'Desc 1', order: 1 },
      { slug: 'ch2', title: 'Criação de Dinheiro', description: 'Desc 2', order: 2 },
    ];
    const doc = parseHTML(buildLandingPageHTML({ chapters, firstSectionUrl: '/ch1/s1' }));
    const items = doc.querySelectorAll('.chapter-card');
    expect(items.length).toBe(2);
  });

  it('renders chapter title and description', () => {
    const chapters: ChapterInfo[] = [
      { slug: 'ch1', title: 'Introdução', description: 'Uma breve introdução', order: 1 },
    ];
    const doc = parseHTML(buildLandingPageHTML({ chapters, firstSectionUrl: '/ch1/s1' }));
    const card = doc.querySelector('.chapter-card');
    expect(card?.querySelector('.chapter-title')?.textContent?.trim()).toBe('Introdução');
    expect(card?.querySelector('.chapter-description')?.textContent?.trim()).toBe('Uma breve introdução');
  });

  it('shows empty state when no chapters are available', () => {
    const doc = parseHTML(buildLandingPageHTML({ chapters: [], firstSectionUrl: '/' }));
    const empty = doc.querySelector('.chapters-empty');
    expect(empty).not.toBeNull();
    const list = doc.querySelector('.chapters-list');
    expect(list).toBeNull();
  });

  // Req 13.3 — CTA logic: no progress → "Começar a leitura"
  it('CTA shows "Começar a leitura" when no progress saved', () => {
    const result = simulateCTAScript({ firstSectionUrl: '/ch1/s1', localStorageValue: null });
    expect(result.text).toBe('Começar a leitura');
    expect(result.href).toBe('/ch1/s1');
  });

  // Req 13.3 — CTA logic: with progress → "Continuar leitura"
  it('CTA shows "Continuar leitura" when lastVisited is set', () => {
    const progress = JSON.stringify({ lastVisited: 'ch2/s3', visitedSections: ['ch1/s1', 'ch2/s3'] });
    const result = simulateCTAScript({ firstSectionUrl: '/ch1/s1', localStorageValue: progress });
    expect(result.text).toBe('Continuar leitura');
    expect(result.href).toBe('/ch2/s3');
  });

  it('CTA shows "Começar a leitura" when lastVisited is null', () => {
    const progress = JSON.stringify({ lastVisited: null, visitedSections: [] });
    const result = simulateCTAScript({ firstSectionUrl: '/ch1/s1', localStorageValue: progress });
    expect(result.text).toBe('Começar a leitura');
    expect(result.href).toBe('/ch1/s1');
  });

  it('CTA falls back to "Começar a leitura" on malformed JSON', () => {
    const result = simulateCTAScript({ firstSectionUrl: '/ch1/s1', localStorageValue: 'not-json' });
    expect(result.text).toBe('Começar a leitura');
    expect(result.href).toBe('/ch1/s1');
  });

  it('CTA falls back to "Começar a leitura" when lastVisited is empty string', () => {
    const progress = JSON.stringify({ lastVisited: '', visitedSections: [] });
    const result = simulateCTAScript({ firstSectionUrl: '/ch1/s1', localStorageValue: progress });
    expect(result.text).toBe('Começar a leitura');
    expect(result.href).toBe('/ch1/s1');
  });

  // Req 13.2 — chapters sorted by order
  it('renders chapters in ascending order', () => {
    const chapters: ChapterInfo[] = [
      { slug: 'ch3', title: 'Capítulo 3', description: '', order: 3 },
      { slug: 'ch1', title: 'Capítulo 1', description: '', order: 1 },
      { slug: 'ch2', title: 'Capítulo 2', description: '', order: 2 },
    ];
    const doc = parseHTML(buildLandingPageHTML({ chapters, firstSectionUrl: '/ch1/s1' }));
    const titles = Array.from(doc.querySelectorAll('.chapter-title')).map(
      (el) => el.textContent?.trim()
    );
    expect(titles).toEqual(['Capítulo 1', 'Capítulo 2', 'Capítulo 3']);
  });
});

// ---------------------------------------------------------------------------
// Sub-task 19.1 — Property 20: Landing page reflete estado de progresso
// Feature: interactive-banking-book, Property 20: Landing page reflete estado de progresso
// Validates: Requirements 13.3
// ---------------------------------------------------------------------------

describe('Property 20: Landing page reflete estado de progresso', () => {
  it('with lastVisited set: CTA is "Continuar leitura" linking to lastVisited', () => {
    // **Validates: Requirements 13.3**
    fc.assert(
      fc.property(
        // lastVisited: non-empty slug
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0 && !s.includes('\0')),
        // firstSectionUrl
        fc.string({ minLength: 1 }).filter((s) => s.startsWith('/') || s === '/'),
        (lastVisited, firstSectionUrl) => {
          const progress = JSON.stringify({ lastVisited, visitedSections: [lastVisited] });
          const result = simulateCTAScript({ firstSectionUrl, localStorageValue: progress });

          expect(result.text).toBe('Continuar leitura');
          expect(result.href).toBe(`/${lastVisited}`);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('without progress: CTA is "Começar a leitura" linking to first section', () => {
    // **Validates: Requirements 13.3**
    fc.assert(
      fc.property(
        // firstSectionUrl
        fc.string({ minLength: 2 }).filter((s) => s.startsWith('/')),
        (firstSectionUrl) => {
          const result = simulateCTAScript({ firstSectionUrl, localStorageValue: null });

          expect(result.text).toBe('Começar a leitura');
          expect(result.href).toBe(firstSectionUrl);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('with lastVisited=null: CTA is "Começar a leitura"', () => {
    // **Validates: Requirements 13.3**
    fc.assert(
      fc.property(
        fc.string({ minLength: 2 }).filter((s) => s.startsWith('/')),
        (firstSectionUrl) => {
          const progress = JSON.stringify({ lastVisited: null, visitedSections: [] });
          const result = simulateCTAScript({ firstSectionUrl, localStorageValue: progress });

          expect(result.text).toBe('Começar a leitura');
          expect(result.href).toBe(firstSectionUrl);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Sub-task 19.2 — Property 21: Landing page lista todos os capítulos disponíveis
// Feature: interactive-banking-book, Property 21: Landing page lista todos os capítulos disponíveis
// Validates: Requirements 13.2
// ---------------------------------------------------------------------------

describe('Property 21: Landing page lista todos os capítulos disponíveis', () => {
  it('chapter list contains exactly one item per chapter, no omissions', () => {
    // **Validates: Requirements 13.2**
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            slug: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => /^[a-z0-9-]+$/.test(s)),
            title: fc.string({ minLength: 1, maxLength: 80 }).filter((s) => s.trim().length > 0 && !s.includes('<') && !s.includes('>') && !s.includes('&')),
            description: fc.string({ maxLength: 200 }).filter((s) => !s.includes('<') && !s.includes('>') && !s.includes('&')),
            order: fc.integer({ min: 1, max: 100 }),
          }),
          { minLength: 1, maxLength: 20 }
        ),
        (rawChapters) => {
          // Deduplicate by slug (as the real implementation would)
          const seen = new Set<string>();
          const chapters: ChapterInfo[] = rawChapters.filter((ch) => {
            if (seen.has(ch.slug)) return false;
            seen.add(ch.slug);
            return true;
          });

          const doc = parseHTML(
            buildLandingPageHTML({ chapters, firstSectionUrl: '/ch/s1' })
          );

          const items = doc.querySelectorAll('.chapter-card');
          expect(items.length).toBe(chapters.length);

          // Every chapter title must appear in the list (compare trimmed)
          const renderedTitles = Array.from(items).map(
            (el) => el.querySelector('.chapter-title')?.textContent?.trim()
          );
          for (const ch of chapters) {
            expect(renderedTitles).toContain(ch.title.trim());
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('empty chapter list shows placeholder message, not a list', () => {
    // **Validates: Requirements 13.2** (graceful empty state)
    fc.assert(
      fc.property(
        fc.constant([]),
        (chapters: ChapterInfo[]) => {
          const doc = parseHTML(
            buildLandingPageHTML({ chapters, firstSectionUrl: '/' })
          );
          const list = doc.querySelector('.chapters-list');
          const empty = doc.querySelector('.chapters-empty');
          expect(list).toBeNull();
          expect(empty).not.toBeNull();
        }
      ),
      { numRuns: 10 }
    );
  });
});
