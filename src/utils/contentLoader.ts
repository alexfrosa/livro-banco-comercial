// ContentLoader: frontmatter parsing, URL generation, and nav item generation
// Used at build time by Astro to process MDX content files.

export interface SectionFrontmatter {
  title: string;
  order: number;
  description?: string;
  simulation?: string;
  diagram?: string;
  ogImage?: string;
  part?: string; // Req 1.1 — lido do frontmatter do index.md do capítulo
}

export interface ChapterMeta {
  title: string;
  order: number;
  description: string;
  slug: string;
  part?: string;      // Req 1.1, 1.3 — valor exato do frontmatter, sem transformação
  partOrder?: number; // Req 10.1 — usado para ordenar grupos de Partes
}

export interface NavItem {
  title: string;
  slug: string;
  url: string;
  children?: NavItem[];
}

/**
 * Parse YAML frontmatter from a raw string (content between --- delimiters).
 * Supports the fields: title, order, description, simulation, diagram, ogImage.
 * Throws if `title` or `order` are missing.
 */
export function parseFrontmatter(raw: string): SectionFrontmatter {
  const result: Record<string, string | number | undefined> = {};

  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    const value = trimmed.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');

    if (!key) continue;

    if (key === 'order') {
      const num = Number(value);
      result[key] = isNaN(num) ? undefined : num;
    } else {
      result[key] = value || undefined;
    }
  }

  const missing: string[] = [];
  if (result['title'] === undefined || (result['title'] as string).trim() === '') missing.push('title');
  if (result['order'] === undefined) missing.push('order');

  if (missing.length > 0) {
    throw new Error(
      `Frontmatter inválido: campos obrigatórios ausentes: ${missing.join(', ')}`
    );
  }

  return {
    title: result['title'] as string,
    order: result['order'] as number,
    description: result['description'] as string | undefined,
    simulation: result['simulation'] as string | undefined,
    diagram: result['diagram'] as string | undefined,
    ogImage: result['ogImage'] as string | undefined,
    part: result['part'] as string | undefined, // Req 1.1, 1.4 — preservado sem transformação
  };
}

/**
 * Generate a section URL in the format `/chapterSlug/sectionSlug`.
 */
export function generateSectionUrl(chapterSlug: string, sectionSlug: string): string {
  return `/${chapterSlug}/${sectionSlug}`;
}

/**
 * Convert a category title to a kebab-case slug.
 * Removes accents, lowercases, replaces spaces and special chars with `-`,
 * and collapses multiple hyphens. Req 2.6
 */
function toCategorySlug(part: string): string {
  return part
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars (parens, em-dash, etc.)
    .trim()
    .replace(/[\s]+/g, '-')        // spaces → hyphens
    .replace(/-{2,}/g, '-');       // collapse multiple hyphens
}

/**
 * Represents a category group in the navigation (Req 2.6).
 */
export interface CategoryNavItem {
  title: string;   // Category_Label (ex: "Parte 2 — Cadastro e Onboarding (KYC)")
  slug: string;    // kebab-case derived from title
  url: string;     // always "#"
  children: NavItem[];
}

/**
 * Group chapters by `part` and return a CategoryNavItem[] sorted by the minimum
 * `order` of each group. Chapters without `part` go to a nameless group at the end.
 * Req 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
 */
export function generateCategoryNavItems(
  chapters: Array<{
    slug: string;
    meta: ChapterMeta;
    sections: Array<{ slug: string; frontmatter: SectionFrontmatter }>;
  }>
): CategoryNavItem[] {
  // Map from part title → { minOrder, partOrder, navItems }
  const groups = new Map<string, { minOrder: number; partOrder?: number; children: NavItem[] }>();
  const uncategorized: NavItem[] = [];
  let uncategorizedMinOrder = Infinity;

  const sortedChapters = [...chapters].sort((a, b) => a.meta.order - b.meta.order);

  for (const chapter of sortedChapters) {
    const part = chapter.meta.part && chapter.meta.part.trim() ? chapter.meta.part : null;

    const sortedSections = [...chapter.sections].sort(
      (a, b) => a.frontmatter.order - b.frontmatter.order
    );
    const chapterNavItem: NavItem = {
      title: chapter.meta.title,
      slug: chapter.slug,
      url: `/${chapter.slug}`,
      children: sortedSections.map((s) => ({
        title: s.frontmatter.title,
        slug: s.slug,
        url: generateSectionUrl(chapter.slug, s.slug),
      })),
    };

    if (part === null) {
      // Req 2.5 — capítulos sem part vão ao final
      uncategorized.push(chapterNavItem);
      if (chapter.meta.order < uncategorizedMinOrder) {
        uncategorizedMinOrder = chapter.meta.order;
      }
    } else {
      if (!groups.has(part)) {
        groups.set(part, { minOrder: chapter.meta.order, partOrder: chapter.meta.partOrder, children: [] });
      }
      const group = groups.get(part)!;
      group.children.push(chapterNavItem);
      if (chapter.meta.order < group.minOrder) {
        group.minOrder = chapter.meta.order;
      }
    }
  }

  // Build result sorted by partOrder (when available) then minOrder of each group (Req 10.1, 2.3)
  const result: CategoryNavItem[] = Array.from(groups.entries())
    .sort((a, b) => {
      const aPartOrder = a[1].partOrder ?? Infinity;
      const bPartOrder = b[1].partOrder ?? Infinity;
      if (aPartOrder !== bPartOrder) return aPartOrder - bPartOrder;
      return a[1].minOrder - b[1].minOrder;
    })
    .map(([title, { children }]) => ({
      title,
      slug: toCategorySlug(title),
      url: '#',
      children: [...children].sort((a, b) => {
        // children are already sorted by order from the loop above,
        // but re-sort for correctness (Req 2.4)
        const aOrder = chapters.find((c) => c.slug === a.slug)?.meta.order ?? 0;
        const bOrder = chapters.find((c) => c.slug === b.slug)?.meta.order ?? 0;
        return aOrder - bOrder;
      }),
    }));

  // Append uncategorized group at the end (Req 2.5)
  if (uncategorized.length > 0) {
    result.push({
      title: '',
      slug: 'sem-categoria',
      url: '#',
      children: uncategorized,
    });
  }

  return result;
}

/**
 * Generate NavItem[] from chapters, sorting chapters and sections by `order` ascending.
 */
export function generateNavItems(
  chapters: Array<{
    slug: string;
    meta: ChapterMeta;
    sections: Array<{ slug: string; frontmatter: SectionFrontmatter }>;
  }>
): NavItem[] {
  const sortedChapters = [...chapters].sort((a, b) => a.meta.order - b.meta.order);

  return sortedChapters.map((chapter) => {
    const sortedSections = [...chapter.sections].sort(
      (a, b) => a.frontmatter.order - b.frontmatter.order
    );

    const children: NavItem[] = sortedSections.map((section) => ({
      title: section.frontmatter.title,
      slug: section.slug,
      url: generateSectionUrl(chapter.slug, section.slug),
    }));

    return {
      title: chapter.meta.title,
      slug: chapter.slug,
      url: `/${chapter.slug}`,
      children,
    };
  });
}
