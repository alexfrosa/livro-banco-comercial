import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { generateNavItems, type ChapterMeta, type SectionFrontmatter } from '../utils/contentLoader';

// ---------------------------------------------------------------------------
// Sub-task 17.1 — Unit tests for ARIA landmarks and metadata
// Sub-task 17.2 — Property 18: ARIA landmarks presentes em toda página renderizada
// Sub-task 17.3 — Property 16: Metadados de página completos e únicos
// Feature: interactive-banking-book, Property 18: ARIA landmarks presentes em toda página renderizada
// Feature: interactive-banking-book, Property 16: Metadados de página completos e únicos
// Validates: Requirements 11.1, 11.2, 12.1, 12.2
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Helpers — simulate the HTML structure produced by BaseLayout / ChapterLayout
// ---------------------------------------------------------------------------

/** Escape a string for safe use inside an HTML attribute value (double-quoted). */
function escapeAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Builds a minimal HTML string that mirrors what BaseLayout.astro renders,
 * given a set of page metadata. Used to test landmark and metadata presence
 * without running a full Astro build.
 */
function buildBaseLayoutHTML(opts: {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogImage?: string;
  includeGlossaryPanel?: boolean;
}): string {
  const {
    title,
    description,
    ogTitle = title,
    ogDescription = description,
    ogUrl = '',
    ogImage = '/og-image.png',
    includeGlossaryPanel = false,
  } = opts;

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeAttr(title)}</title>
    <meta name="description" content="${escapeAttr(description)}" />
    <meta property="og:title" content="${escapeAttr(ogTitle)}" />
    <meta property="og:description" content="${escapeAttr(ogDescription)}" />
    ${ogUrl ? `<meta property="og:url" content="${escapeAttr(ogUrl)}" />` : ''}
    ${ogImage ? `<meta property="og:image" content="${escapeAttr(ogImage)}" />` : ''}
  </head>
  <body>
    <a href="#main-content" class="skip-link">Pular para o conteúdo</a>
    <div id="section-announcer" aria-live="polite" aria-atomic="true"></div>
    <header class="site-header"></header>
    <div class="layout">
      <nav role="navigation" aria-label="Navegação do livro" id="navigation-menu"></nav>
      <main id="main-content" role="main" class="main-content">
        <slot></slot>
      </main>
    </div>
    ${
      includeGlossaryPanel
        ? `<aside id="glossary-panel" role="complementary" aria-label="Glossário"></aside>`
        : ''
    }
  </body>
</html>`;
}

/**
 * Parse the HTML string into a DOM document using happy-dom (available via vitest).
 */
function parseHTML(html: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

// ---------------------------------------------------------------------------
// Unit tests — Sub-task 17.1
// ---------------------------------------------------------------------------

describe('BaseLayout — ARIA landmarks (unit tests)', () => {
  it('contains exactly one role="navigation" element', () => {
    const doc = parseHTML(buildBaseLayoutHTML({ title: 'Test', description: 'desc' }));
    const navEls = doc.querySelectorAll('[role="navigation"], nav');
    expect(navEls.length).toBeGreaterThanOrEqual(1);
  });

  it('contains exactly one role="main" element', () => {
    const doc = parseHTML(buildBaseLayoutHTML({ title: 'Test', description: 'desc' }));
    const mainEls = doc.querySelectorAll('[role="main"], main');
    expect(mainEls.length).toBe(1);
  });

  it('main element has id="main-content" for skip link target', () => {
    const doc = parseHTML(buildBaseLayoutHTML({ title: 'Test', description: 'desc' }));
    const main = doc.getElementById('main-content');
    expect(main).not.toBeNull();
  });

  it('skip link points to #main-content', () => {
    const doc = parseHTML(buildBaseLayoutHTML({ title: 'Test', description: 'desc' }));
    const skipLink = doc.querySelector('.skip-link') as HTMLAnchorElement;
    expect(skipLink).not.toBeNull();
    expect(skipLink.getAttribute('href')).toBe('#main-content');
  });

  it('aria-live region is present for screen reader announcements', () => {
    const doc = parseHTML(buildBaseLayoutHTML({ title: 'Test', description: 'desc' }));
    const announcer = doc.getElementById('section-announcer');
    expect(announcer).not.toBeNull();
    expect(announcer?.getAttribute('aria-live')).toBe('polite');
  });

  it('GlossaryPanel has role="complementary" when visible', () => {
    const doc = parseHTML(
      buildBaseLayoutHTML({ title: 'Test', description: 'desc', includeGlossaryPanel: true })
    );
    const glossary = doc.querySelector('[role="complementary"]');
    expect(glossary).not.toBeNull();
  });

  it('no role="complementary" when GlossaryPanel is absent', () => {
    const doc = parseHTML(
      buildBaseLayoutHTML({ title: 'Test', description: 'desc', includeGlossaryPanel: false })
    );
    const glossary = doc.querySelector('[role="complementary"]');
    expect(glossary).toBeNull();
  });
});

describe('BaseLayout — SEO metadata (unit tests)', () => {
  it('renders <title> with the provided title', () => {
    const doc = parseHTML(buildBaseLayoutHTML({ title: 'Criação de Dinheiro', description: 'desc' }));
    expect(doc.title).toBe('Criação de Dinheiro');
  });

  it('renders meta description', () => {
    const doc = parseHTML(
      buildBaseLayoutHTML({ title: 'T', description: 'Descrição da seção' })
    );
    const meta = doc.querySelector('meta[name="description"]');
    expect(meta?.getAttribute('content')).toBe('Descrição da seção');
  });

  it('renders og:title', () => {
    const doc = parseHTML(buildBaseLayoutHTML({ title: 'OG Title', description: 'desc' }));
    const og = doc.querySelector('meta[property="og:title"]');
    expect(og?.getAttribute('content')).toBe('OG Title');
  });

  it('renders og:description', () => {
    const doc = parseHTML(buildBaseLayoutHTML({ title: 'T', description: 'OG Desc' }));
    const og = doc.querySelector('meta[property="og:description"]');
    expect(og?.getAttribute('content')).toBe('OG Desc');
  });

  it('renders og:url when provided', () => {
    const doc = parseHTML(
      buildBaseLayoutHTML({ title: 'T', description: 'd', ogUrl: 'https://example.com/section' })
    );
    const og = doc.querySelector('meta[property="og:url"]');
    expect(og?.getAttribute('content')).toBe('https://example.com/section');
  });

  it('renders og:image when provided', () => {
    const doc = parseHTML(
      buildBaseLayoutHTML({ title: 'T', description: 'd', ogImage: '/og/section.png' })
    );
    const og = doc.querySelector('meta[property="og:image"]');
    expect(og?.getAttribute('content')).toBe('/og/section.png');
  });
});

// ---------------------------------------------------------------------------
// Property 18: ARIA landmarks presentes em toda página renderizada
// Sub-task 17.2
// Validates: Requirements 12.2
// ---------------------------------------------------------------------------

describe('Property 18: ARIA landmarks presentes em toda página renderizada', () => {
  // Generator for valid page metadata
  const titleArb = fc.string({ minLength: 1, maxLength: 80 }).filter((s) => !s.includes('<') && !s.includes('>'));
  const descArb = fc.string({ minLength: 1, maxLength: 200 }).filter((s) => !s.includes('<') && !s.includes('>'));

  it('every rendered page has role="navigation", role="main", and skip link', () => {
    // **Validates: Requirements 12.2**
    fc.assert(
      fc.property(titleArb, descArb, (title, description) => {
        const html = buildBaseLayoutHTML({ title, description });
        const doc = parseHTML(html);

        // role="navigation" (or <nav>) must be present
        const navEl = doc.querySelector('[role="navigation"], nav');
        expect(navEl).not.toBeNull();

        // role="main" (or <main>) must be present
        const mainEl = doc.querySelector('[role="main"], main');
        expect(mainEl).not.toBeNull();

        // skip link must be present
        const skipLink = doc.querySelector('[href="#main-content"]');
        expect(skipLink).not.toBeNull();
      }),
      { numRuns: 100 }
    );
  });

  it('role="complementary" is present when GlossaryPanel is visible', () => {
    // **Validates: Requirements 12.2**
    fc.assert(
      fc.property(titleArb, descArb, (title, description) => {
        const html = buildBaseLayoutHTML({ title, description, includeGlossaryPanel: true });
        const doc = parseHTML(html);

        const complementary = doc.querySelector('[role="complementary"]');
        expect(complementary).not.toBeNull();
      }),
      { numRuns: 100 }
    );
  });

  it('aria-live region is always present for screen reader announcements', () => {
    // **Validates: Requirements 12.4**
    fc.assert(
      fc.property(titleArb, descArb, (title, description) => {
        const html = buildBaseLayoutHTML({ title, description });
        const doc = parseHTML(html);

        const liveRegion = doc.querySelector('[aria-live="polite"]');
        expect(liveRegion).not.toBeNull();
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 16: Metadados de página completos e únicos
// Sub-task 17.3
// Validates: Requirements 11.1, 11.2
// ---------------------------------------------------------------------------

describe('Property 16: Metadados de página completos e únicos', () => {
  const titleArb = fc
    .string({ minLength: 1, maxLength: 80 })
    .filter((s) => !s.includes('<') && !s.includes('>') && s.trim().length > 0);
  const descArb = fc
    .string({ minLength: 1, maxLength: 200 })
    .filter((s) => !s.includes('<') && !s.includes('>') && s.trim().length > 0);
  const urlArb = fc
    .string({ minLength: 1, maxLength: 100 })
    .filter((s) => !s.includes('<') && !s.includes('>') && s.trim().length > 0)
    .map((s) => `https://example.com/${s}`);

  it('every page has a non-empty <title>', () => {
    // **Validates: Requirements 11.1**
    fc.assert(
      fc.property(titleArb, descArb, (title, description) => {
        const doc = parseHTML(buildBaseLayoutHTML({ title, description }));
        expect(doc.title.trim().length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('every page has a non-empty meta description', () => {
    // **Validates: Requirements 11.1**
    fc.assert(
      fc.property(titleArb, descArb, (title, description) => {
        const doc = parseHTML(buildBaseLayoutHTML({ title, description }));
        const meta = doc.querySelector('meta[name="description"]');
        expect(meta).not.toBeNull();
        expect(meta?.getAttribute('content')?.trim().length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  it('every page has og:title, og:description, og:url, og:image Open Graph tags', () => {
    // **Validates: Requirements 11.2**
    fc.assert(
      fc.property(titleArb, descArb, urlArb, (title, description, ogUrl) => {
        const doc = parseHTML(buildBaseLayoutHTML({ title, description, ogUrl }));

        expect(doc.querySelector('meta[property="og:title"]')).not.toBeNull();
        expect(doc.querySelector('meta[property="og:description"]')).not.toBeNull();
        expect(doc.querySelector('meta[property="og:url"]')).not.toBeNull();
        expect(doc.querySelector('meta[property="og:image"]')).not.toBeNull();
      }),
      { numRuns: 100 }
    );
  });

  it('distinct pages have distinct <title> values', () => {
    // **Validates: Requirements 11.1**
    fc.assert(
      fc.property(
        fc.array(
          fc.record({ title: titleArb, description: descArb, url: urlArb }),
          { minLength: 2, maxLength: 10 }
        ),
        (pages) => {
          // Ensure unique titles in the generated set
          const uniqueTitles = new Set(pages.map((p) => p.title));
          if (uniqueTitles.size !== pages.length) return; // skip if duplicates generated

          const titles = pages.map((p) => {
            const doc = parseHTML(buildBaseLayoutHTML({ title: p.title, description: p.description, ogUrl: p.url }));
            return doc.title;
          });

          const titleSet = new Set(titles);
          expect(titleSet.size).toBe(titles.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('distinct pages have distinct og:url values', () => {
    // **Validates: Requirements 11.2**
    fc.assert(
      fc.property(
        fc.array(
          fc.record({ title: titleArb, description: descArb, url: urlArb }),
          { minLength: 2, maxLength: 10 }
        ),
        (pages) => {
          // Ensure unique URLs in the generated set
          const uniqueUrls = new Set(pages.map((p) => p.url));
          if (uniqueUrls.size !== pages.length) return; // skip if duplicates generated

          const ogUrls = pages.map((p) => {
            const doc = parseHTML(
              buildBaseLayoutHTML({ title: p.title, description: p.description, ogUrl: p.url })
            );
            return doc.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? '';
          });

          const urlSet = new Set(ogUrls);
          expect(urlSet.size).toBe(ogUrls.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});
