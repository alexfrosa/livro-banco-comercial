import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { generateNavItems, type ChapterMeta, type SectionFrontmatter } from '../utils/contentLoader';

// ---------------------------------------------------------------------------
// Sub-task 10.1 — Property 3: Item ativo no Navigation_Menu
// Feature: interactive-banking-book, Property 3: Item ativo no Navigation_Menu
// Validates: Requirements 1.3
// ---------------------------------------------------------------------------

/**
 * Simulates the active-item logic from NavigationMenu.astro:
 * given a list of NavItems and a currentUrl, returns all items (chapters + sections)
 * that would receive aria-current="page".
 */
function getActiveItems(
  items: ReturnType<typeof generateNavItems>,
  currentUrl: string
): string[] {
  const active: string[] = [];
  for (const chapter of items) {
    if (chapter.url === currentUrl) active.push(chapter.url);
    for (const section of chapter.children ?? []) {
      if (section.url === currentUrl) active.push(section.url);
    }
  }
  return active;
}

// Generator for a valid slug (no slashes, non-empty)
const slugArb = fc
  .string({ minLength: 1, maxLength: 20 })
  .filter((s) => !s.includes('/') && s.trim().length > 0);

// Generator for a chapter with sections
const chapterArb = fc.record({
  slug: slugArb,
  order: fc.integer({ min: 0, max: 100 }),
  sections: fc.array(
    fc.record({ slug: slugArb, order: fc.integer({ min: 0, max: 100 }) }),
    { minLength: 0, maxLength: 5 }
  ),
});

function buildChapters(defs: Array<{ slug: string; order: number; sections: Array<{ slug: string; order: number }> }>) {
  return defs.map((c) => ({
    slug: c.slug,
    meta: { title: c.slug, order: c.order, description: '', slug: c.slug } as ChapterMeta,
    sections: c.sections.map((s) => ({
      slug: s.slug,
      frontmatter: { title: s.slug, order: s.order } as SectionFrontmatter,
    })),
  }));
}

describe('Property 3: Item ativo no Navigation_Menu', () => {
  it('exactly one item has aria-current="page" when currentUrl matches a nav item', () => {
    // **Validates: Requirements 1.3**
    fc.assert(
      fc.property(
        fc.array(chapterArb, { minLength: 1, maxLength: 5 }),
        (chapterDefs) => {
          const chapters = buildChapters(chapterDefs);
          const navItems = generateNavItems(chapters);

          // Collect all possible URLs from the nav
          const allUrls: string[] = [];
          for (const chapter of navItems) {
            allUrls.push(chapter.url);
            for (const section of chapter.children ?? []) {
              allUrls.push(section.url);
            }
          }

          if (allUrls.length === 0) return;

          // Pick any URL from the nav as the current URL
          const currentUrl = allUrls[0];
          const activeItems = getActiveItems(navItems, currentUrl);

          // Exactly one item should be active
          expect(activeItems.length).toBe(1);
          expect(activeItems[0]).toBe(currentUrl);
        }
      )
    );
  });

  it('no item has aria-current="page" when currentUrl does not match any nav item', () => {
    // **Validates: Requirements 1.3**
    fc.assert(
      fc.property(
        fc.array(chapterArb, { minLength: 1, maxLength: 5 }),
        (chapterDefs) => {
          const chapters = buildChapters(chapterDefs);
          const navItems = generateNavItems(chapters);

          // Use a URL that cannot match any nav item
          const nonExistentUrl = '/this-url-does-not-exist-in-nav';
          const activeItems = getActiveItems(navItems, nonExistentUrl);

          expect(activeItems.length).toBe(0);
        }
      )
    );
  });

  it('only the item matching currentUrl is active, never multiple items simultaneously', () => {
    // **Validates: Requirements 1.3**
    fc.assert(
      fc.property(
        fc.array(chapterArb, { minLength: 2, maxLength: 5 }),
        (chapterDefs) => {
          // Ensure unique slugs to avoid URL collisions
          const uniqueDefs = chapterDefs.map((c, i) => ({
            ...c,
            slug: `chapter-${i}-${c.slug}`,
            sections: c.sections.map((s, j) => ({ ...s, slug: `section-${i}-${j}-${s.slug}` })),
          }));

          const chapters = buildChapters(uniqueDefs);
          const navItems = generateNavItems(chapters);

          const allUrls: string[] = [];
          for (const chapter of navItems) {
            allUrls.push(chapter.url);
            for (const section of chapter.children ?? []) {
              allUrls.push(section.url);
            }
          }

          // For every possible currentUrl, at most one item is active
          for (const currentUrl of allUrls) {
            const activeItems = getActiveItems(navItems, currentUrl);
            expect(activeItems.length).toBeLessThanOrEqual(1);
          }
        }
      )
    );
  });
});
