import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  parseFrontmatter,
  generateSectionUrl,
  generateNavItems,
  type SectionFrontmatter,
  type ChapterMeta,
} from './contentLoader';

// Safe string generator for frontmatter values: no newlines, colons, quotes, or whitespace-only
const safeFrontmatterString = fc
  .string({ minLength: 1 })
  .filter(
    (s) =>
      !s.includes('\n') &&
      !s.includes(':') &&
      !s.includes('"') &&
      !s.includes("'") &&
      s.trim().length > 0
  );

// ---------------------------------------------------------------------------
// Sub-task 8.1 — Property 12: Round-trip de parsing de frontmatter
// Feature: interactive-banking-book, Property 12: Round-trip de parsing de frontmatter
// Validates: Requirements 8.3, 8.5
// ---------------------------------------------------------------------------

describe('Property 12: Round-trip de parsing de frontmatter', () => {
  it('for any valid frontmatter with title and order, parseFrontmatter extracts them correctly', () => {
    // **Validates: Requirements 8.3, 8.5**
    fc.assert(
      fc.property(
        safeFrontmatterString,
        fc.integer({ min: 0, max: 9999 }),
        (title, order) => {
          const raw = `title: ${title}\norder: ${order}`;
          const result = parseFrontmatter(raw);
          expect(result.title).toBe(title.trim());
          expect(result.order).toBe(order);
        }
      )
    );
  });

  it('optional fields are preserved when present', () => {
    // **Validates: Requirements 8.3**
    fc.assert(
      fc.property(
        safeFrontmatterString,
        fc.integer({ min: 0, max: 9999 }),
        safeFrontmatterString,
        (title, order, description) => {
          const raw = `title: ${title}\norder: ${order}\ndescription: ${description}`;
          const result = parseFrontmatter(raw);
          expect(result.title).toBe(title.trim());
          expect(result.order).toBe(order);
          expect(result.description).toBe(description.trim());
        }
      )
    );
  });
});

// ---------------------------------------------------------------------------
// Sub-task 8.2 — Property 2: Unicidade de URLs por Seção
// Feature: interactive-banking-book, Property 2: Unicidade de URLs por Seção
// Validates: Requirements 1.6, 11.4
// ---------------------------------------------------------------------------

describe('Property 2: Unicidade de URLs por Seção', () => {
  it('all section URLs are unique for unique chapter/section slug pairs', () => {
    // **Validates: Requirements 1.6, 11.4**
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            chapterSlug: fc.string({ minLength: 1 }).filter((s) => !s.includes('/')),
            sectionSlug: fc.string({ minLength: 1 }).filter((s) => !s.includes('/')),
          }),
          { minLength: 1 }
        ),
        (pairs) => {
          const urls = pairs.map((p) => generateSectionUrl(p.chapterSlug, p.sectionSlug));
          const uniquePairs = new Set(pairs.map((p) => `${p.chapterSlug}/${p.sectionSlug}`));
          const uniqueUrls = new Set(urls);
          // Number of unique URLs must equal number of unique slug pairs
          expect(uniqueUrls.size).toBe(uniquePairs.size);
        }
      )
    );
  });
});

// ---------------------------------------------------------------------------
// Sub-task 8.3 — Property 1: Ordem hierárquica da navegação
// Feature: interactive-banking-book, Property 1: Ordem hierárquica da navegação
// Validates: Requirements 1.1
// ---------------------------------------------------------------------------

describe('Property 1: Ordem hierárquica da navegação', () => {
  it('generateNavItems sorts chapters by order ascending', () => {
    // **Validates: Requirements 1.1**
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            slug: fc.uuid(), // unique slugs to avoid ambiguity in lookup
            order: fc.integer({ min: 0, max: 1000 }),
            title: fc.string({ minLength: 1 }),
          }),
          { minLength: 1 }
        ),
        (chapterDefs) => {
          const chapters = chapterDefs.map((c) => ({
            slug: c.slug,
            meta: {
              title: c.title,
              order: c.order,
              description: '',
              slug: c.slug,
            } as ChapterMeta,
            sections: [],
          }));

          const slugToOrder = new Map(chapters.map((c) => [c.slug, c.meta.order]));
          const navItems = generateNavItems(chapters);

          for (let i = 1; i < navItems.length; i++) {
            const prevOrder = slugToOrder.get(navItems[i - 1].slug)!;
            const currOrder = slugToOrder.get(navItems[i].slug)!;
            expect(prevOrder).toBeLessThanOrEqual(currOrder);
          }
        }
      )
    );
  });

  it('generateNavItems sorts sections within each chapter by order ascending', () => {
    // **Validates: Requirements 1.1**
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            slug: fc.uuid(), // unique slugs to avoid ambiguity
            order: fc.integer({ min: 0, max: 1000 }),
          }),
          { minLength: 1 }
        ),
        (sectionDefs) => {
          const chapter = {
            slug: 'chapter-1',
            meta: { title: 'Chapter 1', order: 1, description: '', slug: 'chapter-1' } as ChapterMeta,
            sections: sectionDefs.map((s) => ({
              slug: s.slug,
              frontmatter: { title: `Section ${s.order}`, order: s.order } as SectionFrontmatter,
            })),
          };

          const slugToOrder = new Map(chapter.sections.map((s) => [s.slug, s.frontmatter.order]));
          const navItems = generateNavItems([chapter]);
          const children = navItems[0].children ?? [];

          for (let i = 1; i < children.length; i++) {
            const prevOrder = slugToOrder.get(children[i - 1].slug)!;
            const currOrder = slugToOrder.get(children[i].slug)!;
            expect(prevOrder).toBeLessThanOrEqual(currOrder);
          }
        }
      )
    );
  });
});

// ---------------------------------------------------------------------------
// Sub-task 8.4 — Property 14: Navigation_Menu inclui todos os arquivos de conteúdo
// Feature: interactive-banking-book, Property 14: Navigation_Menu inclui todos os arquivos de conteúdo
// Validates: Requirements 8.2
// ---------------------------------------------------------------------------

describe('Property 14: Navigation_Menu inclui todos os arquivos de conteúdo', () => {
  it('generateNavItems includes exactly one NavItem per input chapter', () => {
    // **Validates: Requirements 8.2**
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            slug: fc.uuid(),
            order: fc.integer({ min: 0, max: 1000 }),
            title: fc.string({ minLength: 1 }),
          }),
          { minLength: 0, maxLength: 20 }
        ),
        (chapterDefs) => {
          const chapters = chapterDefs.map((c) => ({
            slug: c.slug,
            meta: { title: c.title, order: c.order, description: '', slug: c.slug } as ChapterMeta,
            sections: [],
          }));

          const navItems = generateNavItems(chapters);
          expect(navItems).toHaveLength(chapters.length);

          // Each input chapter slug appears exactly once
          const navSlugs = navItems.map((n) => n.slug);
          const inputSlugs = chapters.map((c) => c.slug);
          expect(navSlugs.sort()).toEqual(inputSlugs.sort());
        }
      )
    );
  });

  it('generateNavItems includes exactly one child NavItem per input section', () => {
    // **Validates: Requirements 8.2**
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            slug: fc.uuid(),
            order: fc.integer({ min: 0, max: 1000 }),
          }),
          { minLength: 0, maxLength: 20 }
        ),
        (sectionDefs) => {
          const chapter = {
            slug: 'test-chapter',
            meta: { title: 'Test', order: 1, description: '', slug: 'test-chapter' } as ChapterMeta,
            sections: sectionDefs.map((s) => ({
              slug: s.slug,
              frontmatter: { title: `S${s.order}`, order: s.order } as SectionFrontmatter,
            })),
          };

          const navItems = generateNavItems([chapter]);
          const children = navItems[0].children ?? [];
          expect(children).toHaveLength(sectionDefs.length);

          const childSlugs = children.map((c) => c.slug);
          const inputSlugs = sectionDefs.map((s) => s.slug);
          expect(childSlugs.sort()).toEqual(inputSlugs.sort());
        }
      )
    );
  });
});

// ---------------------------------------------------------------------------
// Sub-task 8.5 — Unit tests for ContentLoader
// Validates: Requirements 8.2, 8.3, 8.4, 8.5
// ---------------------------------------------------------------------------

describe('parseFrontmatter unit tests', () => {
  it('throws when title is missing', () => {
    expect(() => parseFrontmatter('order: 1')).toThrow(/title/);
  });

  it('throws when order is missing', () => {
    expect(() => parseFrontmatter('title: My Section')).toThrow(/order/);
  });

  it('throws when both title and order are missing', () => {
    expect(() => parseFrontmatter('description: some text')).toThrow(/title.*order|order.*title/);
  });

  it('parses a minimal valid frontmatter', () => {
    const result = parseFrontmatter('title: Hello World\norder: 3');
    expect(result.title).toBe('Hello World');
    expect(result.order).toBe(3);
    expect(result.description).toBeUndefined();
  });

  it('parses all optional fields', () => {
    const raw = [
      'title: Full Section',
      'order: 5',
      'description: A description',
      'simulation: MoneyCreation',
      'diagram: money-flow',
      'ogImage: /og/image.png',
    ].join('\n');
    const result = parseFrontmatter(raw);
    expect(result.title).toBe('Full Section');
    expect(result.order).toBe(5);
    expect(result.description).toBe('A description');
    expect(result.simulation).toBe('MoneyCreation');
    expect(result.diagram).toBe('money-flow');
    expect(result.ogImage).toBe('/og/image.png');
  });

  it('parses quoted string values', () => {
    const result = parseFrontmatter('title: "Quoted Title"\norder: 2');
    expect(result.title).toBe('Quoted Title');
  });

  it('ignores comment lines', () => {
    const result = parseFrontmatter('# comment\ntitle: Test\norder: 1');
    expect(result.title).toBe('Test');
  });
});

describe('generateSectionUrl unit tests', () => {
  it('produces /chapterSlug/sectionSlug format', () => {
    expect(generateSectionUrl('capitulo-1', 'criacao-de-dinheiro')).toBe(
      '/capitulo-1/criacao-de-dinheiro'
    );
  });

  it('starts with a leading slash', () => {
    const url = generateSectionUrl('ch', 'sec');
    expect(url.startsWith('/')).toBe(true);
  });

  it('contains both slugs separated by /', () => {
    const url = generateSectionUrl('abc', 'xyz');
    expect(url).toBe('/abc/xyz');
  });
});

describe('generateNavItems unit tests', () => {
  const makeChapter = (slug: string, order: number, sections: Array<{ slug: string; order: number }>) => ({
    slug,
    meta: { title: `Chapter ${order}`, order, description: '', slug } as ChapterMeta,
    sections: sections.map((s) => ({
      slug: s.slug,
      frontmatter: { title: `Section ${s.order}`, order: s.order } as SectionFrontmatter,
    })),
  });

  it('returns empty array for empty input', () => {
    expect(generateNavItems([])).toEqual([]);
  });

  it('sorts chapters by order ascending', () => {
    const chapters = [makeChapter('c3', 3, []), makeChapter('c1', 1, []), makeChapter('c2', 2, [])];
    const nav = generateNavItems(chapters);
    expect(nav.map((n) => n.slug)).toEqual(['c1', 'c2', 'c3']);
  });

  it('sorts sections within a chapter by order ascending', () => {
    const chapter = makeChapter('ch', 1, [
      { slug: 's3', order: 3 },
      { slug: 's1', order: 1 },
      { slug: 's2', order: 2 },
    ]);
    const nav = generateNavItems([chapter]);
    expect(nav[0].children!.map((c) => c.slug)).toEqual(['s1', 's2', 's3']);
  });

  it('chapter URL is /chapterSlug', () => {
    const nav = generateNavItems([makeChapter('intro', 1, [])]);
    expect(nav[0].url).toBe('/intro');
  });

  it('section URL is /chapterSlug/sectionSlug', () => {
    const chapter = makeChapter('intro', 1, [{ slug: 'what-is-bank', order: 1 }]);
    const nav = generateNavItems([chapter]);
    expect(nav[0].children![0].url).toBe('/intro/what-is-bank');
  });

  it('does not mutate the original chapters array', () => {
    const chapters = [makeChapter('c2', 2, []), makeChapter('c1', 1, [])];
    const originalOrder = chapters.map((c) => c.slug);
    generateNavItems(chapters);
    expect(chapters.map((c) => c.slug)).toEqual(originalOrder);
  });
});
