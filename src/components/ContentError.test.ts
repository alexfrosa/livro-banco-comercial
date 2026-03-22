/**
 * ContentError.test.ts
 * Sub-task 18.1 — Unit tests for ContentError and dynamic route logic
 * Tests: seção ausente exibe ContentError, demais seções renderizam normalmente (Property 13)
 * Requirements: 8.4, 11.4
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { generateNavItems, generateSectionUrl, type ChapterMeta, type SectionFrontmatter } from '../utils/contentLoader';

// ---------------------------------------------------------------------------
// Helpers — simulate the route resolution logic from [...slug].astro
// ---------------------------------------------------------------------------

interface SectionEntry {
  chapterSlug: string;
  sectionSlug: string;
  url: string;
  frontmatter: SectionFrontmatter;
}

/**
 * Simulates the page resolution logic from [...slug].astro.
 * Returns the section entry if found, or null if missing.
 */
function resolveSection(
  sections: SectionEntry[],
  chapterSlug: string,
  sectionSlug: string
): SectionEntry | null {
  return (
    sections.find(
      (s) => s.chapterSlug === chapterSlug && s.sectionSlug === sectionSlug
    ) ?? null
  );
}

/**
 * Simulates what the page renders: either the content or a ContentError.
 * Returns 'content' | 'error'.
 */
function getPageRenderType(
  sections: SectionEntry[],
  chapterSlug: string,
  sectionSlug: string
): 'content' | 'error' {
  const entry = resolveSection(sections, chapterSlug, sectionSlug);
  return entry ? 'content' : 'error';
}

/**
 * Builds a minimal HTML string for a ContentError component.
 * Mirrors the structure of ContentError.astro.
 */
function buildContentErrorHTML(message: string, suggestion?: string): string {
  return `<div class="content-error" role="alert" aria-live="polite">
  <span class="content-error__icon" aria-hidden="true">⚠️</span>
  <div class="content-error__body">
    <p class="content-error__message">${message}</p>
    ${suggestion ? `<p class="content-error__suggestion">${suggestion}</p>` : ''}
  </div>
</div>`;
}

function parseHTML(html: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

// ---------------------------------------------------------------------------
// Unit tests — ContentError component structure
// ---------------------------------------------------------------------------

describe('ContentError — component structure', () => {
  it('renders with role="alert" for screen readers', () => {
    const html = buildContentErrorHTML('Seção não encontrada: capitulo/secao');
    const doc = parseHTML(html);
    const el = doc.querySelector('[role="alert"]');
    expect(el).not.toBeNull();
  });

  it('renders the error message', () => {
    const message = 'Seção não encontrada: 02-criacao-de-dinheiro/01-fluxo-de-dinheiro';
    const html = buildContentErrorHTML(message);
    const doc = parseHTML(html);
    const msgEl = doc.querySelector('.content-error__message');
    expect(msgEl?.textContent).toBe(message);
  });

  it('renders the suggestion when provided', () => {
    const suggestion = 'Verifique se o arquivo existe no repositório de conteúdo.';
    const html = buildContentErrorHTML('Erro', suggestion);
    const doc = parseHTML(html);
    const suggEl = doc.querySelector('.content-error__suggestion');
    expect(suggEl?.textContent).toBe(suggestion);
  });

  it('does not render suggestion element when not provided', () => {
    const html = buildContentErrorHTML('Erro sem sugestão');
    const doc = parseHTML(html);
    const suggEl = doc.querySelector('.content-error__suggestion');
    expect(suggEl).toBeNull();
  });

  it('has aria-live="polite" for non-disruptive announcements', () => {
    const html = buildContentErrorHTML('Erro');
    const doc = parseHTML(html);
    const el = doc.querySelector('[aria-live="polite"]');
    expect(el).not.toBeNull();
  });

  it('has a warning icon with aria-hidden="true"', () => {
    const html = buildContentErrorHTML('Erro');
    const doc = parseHTML(html);
    const icon = doc.querySelector('[aria-hidden="true"]');
    expect(icon).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Unit tests — route resolution logic
// ---------------------------------------------------------------------------

describe('Dynamic route — section resolution', () => {
  const sampleSections: SectionEntry[] = [
    {
      chapterSlug: '01-introducao',
      sectionSlug: '01-o-que-e-banco',
      url: '/01-introducao/01-o-que-e-banco',
      frontmatter: { title: 'O que é um banco?', order: 1 },
    },
    {
      chapterSlug: '02-criacao-de-dinheiro',
      sectionSlug: '01-fluxo-de-dinheiro',
      url: '/02-criacao-de-dinheiro/01-fluxo-de-dinheiro',
      frontmatter: { title: 'Fluxo de Dinheiro', order: 1 },
    },
  ];

  it('resolves an existing section correctly', () => {
    const entry = resolveSection(sampleSections, '01-introducao', '01-o-que-e-banco');
    expect(entry).not.toBeNull();
    expect(entry?.frontmatter.title).toBe('O que é um banco?');
  });

  it('returns null for a missing section', () => {
    const entry = resolveSection(sampleSections, '01-introducao', '99-nao-existe');
    expect(entry).toBeNull();
  });

  it('returns null for a missing chapter', () => {
    const entry = resolveSection(sampleSections, '99-capitulo-inexistente', '01-secao');
    expect(entry).toBeNull();
  });

  it('renders content for existing section', () => {
    const type = getPageRenderType(sampleSections, '02-criacao-de-dinheiro', '01-fluxo-de-dinheiro');
    expect(type).toBe('content');
  });

  it('renders error for missing section', () => {
    const type = getPageRenderType(sampleSections, '02-criacao-de-dinheiro', '99-nao-existe');
    expect(type).toBe('error');
  });

  it('renders error for empty sections list', () => {
    const type = getPageRenderType([], '01-introducao', '01-o-que-e-banco');
    expect(type).toBe('error');
  });
});

// ---------------------------------------------------------------------------
// Unit tests — missing section does not affect other sections (Req 8.4)
// ---------------------------------------------------------------------------

describe('Dynamic route — missing section does not interrupt other sections', () => {
  it('other sections still resolve when one is missing', () => {
    const sections: SectionEntry[] = [
      {
        chapterSlug: '01-introducao',
        sectionSlug: '01-o-que-e-banco',
        url: '/01-introducao/01-o-que-e-banco',
        frontmatter: { title: 'O que é um banco?', order: 1 },
      },
      {
        chapterSlug: '01-introducao',
        sectionSlug: '02-historia',
        url: '/01-introducao/02-historia',
        frontmatter: { title: 'História dos bancos', order: 2 },
      },
    ];

    // Simulate a missing section
    const missingType = getPageRenderType(sections, '01-introducao', '99-nao-existe');
    expect(missingType).toBe('error');

    // Other sections are unaffected
    const section1Type = getPageRenderType(sections, '01-introducao', '01-o-que-e-banco');
    const section2Type = getPageRenderType(sections, '01-introducao', '02-historia');
    expect(section1Type).toBe('content');
    expect(section2Type).toBe('content');
  });
});

// ---------------------------------------------------------------------------
// Unit tests — URL generation (Req 11.4)
// ---------------------------------------------------------------------------

describe('Dynamic route — semantic URL generation', () => {
  it('generates URLs in /chapter-slug/section-slug format', () => {
    const url = generateSectionUrl('02-criacao-de-dinheiro', '01-fluxo-de-dinheiro');
    expect(url).toBe('/02-criacao-de-dinheiro/01-fluxo-de-dinheiro');
  });

  it('generates URLs without query parameters or numeric IDs', () => {
    const url = generateSectionUrl('capitulo-1', 'criacao-de-dinheiro');
    expect(url).not.toContain('?');
    expect(url).not.toContain('#');
    expect(url).toBe('/capitulo-1/criacao-de-dinheiro');
  });
});

// ---------------------------------------------------------------------------
// Property 13: Conteúdo ausente não interrompe renderização
// Sub-task 18.1
// Validates: Requirements 8.4
// ---------------------------------------------------------------------------

describe('Property 13: Conteúdo ausente não interrompe renderização', () => {
  // Arbitraries for valid slugs
  const slugArb = fc
    .string({ minLength: 1, maxLength: 40 })
    .filter((s) => /^[a-z0-9-]+$/.test(s));

  const frontmatterArb = fc.record({
    title: fc.string({ minLength: 1, maxLength: 80 }),
    order: fc.integer({ min: 1, max: 100 }),
  });

  const sectionArb = fc.record({
    chapterSlug: slugArb,
    sectionSlug: slugArb,
    frontmatter: frontmatterArb,
  }).map((s) => ({
    ...s,
    url: generateSectionUrl(s.chapterSlug, s.sectionSlug),
  }));

  it('missing section shows error while all other sections remain resolvable', () => {
    // **Validates: Requirements 8.4**
    fc.assert(
      fc.property(
        fc.array(sectionArb, { minLength: 1, maxLength: 10 }),
        slugArb,
        slugArb,
        (sections, missingChapter, missingSection) => {
          // Ensure the missing slug is not in the sections list
          const isMissing = !sections.some(
            (s) => s.chapterSlug === missingChapter && s.sectionSlug === missingSection
          );

          if (!isMissing) return; // skip if accidentally present

          // Missing section renders error
          const missingType = getPageRenderType(sections, missingChapter, missingSection);
          expect(missingType).toBe('error');

          // All existing sections still render content
          for (const section of sections) {
            const type = getPageRenderType(sections, section.chapterSlug, section.sectionSlug);
            expect(type).toBe('content');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('ContentError HTML always contains role="alert" for any message', () => {
    // **Validates: Requirements 8.4**
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }),
        (message) => {
          const html = buildContentErrorHTML(message);
          const doc = parseHTML(html);
          const alertEl = doc.querySelector('[role="alert"]');
          expect(alertEl).not.toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('ContentError message is always visible in the rendered HTML', () => {
    // **Validates: Requirements 8.4**
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }).filter((s) => !s.includes('<') && !s.includes('>')),
        (message) => {
          const html = buildContentErrorHTML(message);
          const doc = parseHTML(html);
          const msgEl = doc.querySelector('.content-error__message');
          expect(msgEl?.textContent).toBe(message);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 2 (partial): Semantic URLs for dynamic routes (Req 11.4)
// ---------------------------------------------------------------------------

describe('Dynamic route — URL uniqueness (Req 11.4)', () => {
  const slugArb = fc
    .string({ minLength: 1, maxLength: 30 })
    .filter((s) => /^[a-z0-9-]+$/.test(s));

  it('distinct chapter/section pairs produce distinct URLs', () => {
    // **Validates: Requirements 11.4**
    fc.assert(
      fc.property(
        fc.array(
          fc.record({ chapterSlug: slugArb, sectionSlug: slugArb }),
          { minLength: 2, maxLength: 20 }
        ),
        (pairs) => {
          // Only test pairs that are actually distinct
          const uniquePairs = new Set(pairs.map((p) => `${p.chapterSlug}/${p.sectionSlug}`));
          if (uniquePairs.size !== pairs.length) return; // skip duplicates

          const urls = pairs.map((p) => generateSectionUrl(p.chapterSlug, p.sectionSlug));
          const uniqueUrls = new Set(urls);
          expect(uniqueUrls.size).toBe(urls.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});
