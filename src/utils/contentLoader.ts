// ContentLoader: frontmatter parsing, URL generation, and nav item generation
// Used at build time by Astro to process MDX content files.

export interface SectionFrontmatter {
  title: string;
  order: number;
  description?: string;
  simulation?: string;
  diagram?: string;
  ogImage?: string;
}

export interface ChapterMeta {
  title: string;
  order: number;
  description: string;
  slug: string;
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
  };
}

/**
 * Generate a section URL in the format `/chapterSlug/sectionSlug`.
 */
export function generateSectionUrl(chapterSlug: string, sectionSlug: string): string {
  return `/${chapterSlug}/${sectionSlug}`;
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
