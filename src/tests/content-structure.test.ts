/**
 * Content Structure Tests — 29 Capítulos Consolidados (01–29)
 *
 * Validates structural integrity of the consolidated chapter structure.
 * Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.4, 3.5, 4.1, 8.1
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// ── Helpers ───────────────────────────────────────────────────────────────────

const CHAPTERS_DIR = resolve(process.cwd(), 'content/chapters');

const CONSOLIDATED_SLUGS = [
  '01-fundamentos-bancarios',
  '02-regulacao-e-arquitetura',
  '03-kyc-onboarding-ledger',
  '04-contas-bancarias',
  '05-tarifas-bancarias',
  '06-pagamentos',
  '07-operacoes-fim-de-dia',
  '08-cartao-de-credito',
  '09-credito',
  '10-modalidades-credito',
  '11-credito-avancado',
  '12-seguros-bancassurance',
  '13-titulos-capitalizacao',
  '14-consorcio',
  '15-investimentos-renda-variavel',
  '16-fundos-previdencia',
  '17-suitability-fidc-custodia',
  '18-tesouraria-liquidez',
  '19-alm-funding',
  '20-cambio',
  '21-gestao-risco',
  '22-aml-pld-sancoes',
  '23-contabilidade-bancaria',
  '24-scr-registradoras-compulsorio',
  '25-open-finance',
  '26-baas-fintechs',
  '27-falhas-fraudes-reconciliacao',
  '28-expansao-casos-praticos',
  '29-simulador-integrado',
];

/** Returns all chapter folder names sorted */
function readChapterDirs(): string[] {
  return readdirSync(CHAPTERS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

/** Returns all .mdx file paths under a chapter dir */
function readMdxFiles(chapterSlug: string): string[] {
  const dirPath = join(CHAPTERS_DIR, chapterSlug);
  return readdirSync(dirPath)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => join(dirPath, f));
}

/** Parse frontmatter from a markdown/mdx file */
function parseFrontmatter(filePath: string): Record<string, unknown> {
  const content = readFileSync(filePath, 'utf-8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm: Record<string, unknown> = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (val === 'true') fm[key] = true;
    else if (val === 'false') fm[key] = false;
    else if (val !== '') fm[key] = isNaN(Number(val)) ? val : Number(val);
  }
  return fm;
}

// ── 1. Exatamente 29 pastas consolidadas existem (Req 1.1, 1.2) ──────────────

describe('Estrutura consolidada — existência das pastas', () => {
  it('existem exatamente 29 pastas em content/chapters/', () => {
    const dirs = readChapterDirs();
    expect(dirs.length).toBe(29);
  });

  it('todas as 29 pastas consolidadas existem com slugs corretos', () => {
    const dirs = readChapterDirs();
    for (const slug of CONSOLIDATED_SLUGS) {
      expect(dirs, `pasta '${slug}' não encontrada`).toContain(slug);
    }
  });

  it('não existem pastas com prefixos antigos (00–77)', () => {
    const dirs = readChapterDirs();
    const oldPrefixes = dirs.filter((d) => {
      const n = parseInt(d.split('-')[0], 10);
      return n === 0 || n >= 30;
    });
    expect(oldPrefixes, `pastas antigas encontradas: ${oldPrefixes.join(', ')}`).toHaveLength(0);
  });
});

// ── 2. Cada capítulo tem index.md com frontmatter completo (Req 2.1–2.5) ─────

describe('index.md — frontmatter completo nos 29 capítulos', () => {
  it('todos os 29 capítulos têm index.md', () => {
    for (const slug of CONSOLIDATED_SLUGS) {
      const indexPath = join(CHAPTERS_DIR, slug, 'index.md');
      expect(existsSync(indexPath), `index.md ausente em ${slug}`).toBe(true);
    }
  });

  it('todos os index.md têm title, order, description, part e partOrder', () => {
    for (const slug of CONSOLIDATED_SLUGS) {
      const indexPath = join(CHAPTERS_DIR, slug, 'index.md');
      if (!existsSync(indexPath)) continue;
      const fm = parseFrontmatter(indexPath);
      expect(fm.title, `title ausente em ${slug}/index.md`).toBeTruthy();
      expect(fm.order, `order ausente em ${slug}/index.md`).toBeTruthy();
      expect(fm.description, `description ausente em ${slug}/index.md`).toBeTruthy();
      expect(fm.part, `part ausente em ${slug}/index.md`).toBeTruthy();
      expect(fm.partOrder, `partOrder ausente em ${slug}/index.md`).toBeTruthy();
    }
  });

  it('o campo order em index.md corresponde ao número do prefixo da pasta', () => {
    for (const slug of CONSOLIDATED_SLUGS) {
      const indexPath = join(CHAPTERS_DIR, slug, 'index.md');
      if (!existsSync(indexPath)) continue;
      const expectedOrder = parseInt(slug.split('-')[0], 10);
      const fm = parseFrontmatter(indexPath);
      expect(Number(fm.order), `order incorreto em ${slug}/index.md`).toBe(expectedOrder);
    }
  });

  it('partOrder está no intervalo [1, 12]', () => {
    for (const slug of CONSOLIDATED_SLUGS) {
      const indexPath = join(CHAPTERS_DIR, slug, 'index.md');
      if (!existsSync(indexPath)) continue;
      const fm = parseFrontmatter(indexPath);
      const po = Number(fm.partOrder);
      expect(po, `partOrder fora do intervalo em ${slug}/index.md`).toBeGreaterThanOrEqual(1);
      expect(po, `partOrder fora do intervalo em ${slug}/index.md`).toBeLessThanOrEqual(12);
    }
  });

  it('part segue o formato "Parte N — Título da Parte"', () => {
    const partPattern = /^Parte [IVXLCDM]+ — .+$/;
    for (const slug of CONSOLIDATED_SLUGS) {
      const indexPath = join(CHAPTERS_DIR, slug, 'index.md');
      if (!existsSync(indexPath)) continue;
      const fm = parseFrontmatter(indexPath);
      expect(
        String(fm.part),
        `part com formato inválido em ${slug}/index.md`
      ).toMatch(partPattern);
    }
  });
});

// ── 3. Capítulo 13 existe com conteúdo original (Req 4.1) ────────────────────

describe('Capítulo 13 — Títulos de Capitalização (novo)', () => {
  const slug = '13-titulos-capitalizacao';

  it('pasta 13-titulos-capitalizacao existe', () => {
    expect(existsSync(join(CHAPTERS_DIR, slug))).toBe(true);
  });

  it('index.md existe com part "Parte VI — Seguros, Capitalização e Consórcio"', () => {
    const indexPath = join(CHAPTERS_DIR, slug, 'index.md');
    expect(existsSync(indexPath)).toBe(true);
    const fm = parseFrontmatter(indexPath);
    expect(fm.part).toBe('Parte VI — Seguros, Capitalização e Consórcio');
    expect(fm.partOrder).toBe(6);
  });

  it('01-conceitos.mdx existe com title e order: 1', () => {
    const filePath = join(CHAPTERS_DIR, slug, '01-conceitos.mdx');
    expect(existsSync(filePath)).toBe(true);
    const fm = parseFrontmatter(filePath);
    expect(fm.title).toBeTruthy();
    expect(Number(fm.order)).toBe(1);
  });
});

// ── 4. Todos os .mdx têm frontmatter válido (Req 3.1, 3.2, 3.4, 3.5) ────────

describe('Seções .mdx — frontmatter válido nos 29 capítulos', () => {
  it('todos os .mdx têm title e order não-vazios', () => {
    for (const slug of CONSOLIDATED_SLUGS) {
      const files = readMdxFiles(slug);
      for (const filePath of files) {
        const fm = parseFrontmatter(filePath);
        const name = filePath.split('/').slice(-2).join('/');
        expect(fm.title, `title ausente em ${name}`).toBeTruthy();
        expect(fm.order, `order ausente em ${name}`).toBeTruthy();
      }
    }
  });

  it('o prefixo numérico do nome do arquivo corresponde ao campo order', () => {
    for (const slug of CONSOLIDATED_SLUGS) {
      const files = readMdxFiles(slug);
      for (const filePath of files) {
        const fileName = filePath.split('/').pop()!;
        const prefix = parseInt(fileName.split('-')[0], 10);
        const fm = parseFrontmatter(filePath);
        const name = filePath.split('/').slice(-2).join('/');
        expect(Number(fm.order), `order não corresponde ao prefixo em ${name}`).toBe(prefix);
      }
    }
  });

  it('não há duplicatas de order dentro de cada capítulo', () => {
    for (const slug of CONSOLIDATED_SLUGS) {
      const files = readMdxFiles(slug);
      const orders = files.map((f) => {
        const fm = parseFrontmatter(f);
        return Number(fm.order);
      });
      const unique = new Set(orders);
      expect(unique.size, `order duplicado em ${slug}`).toBe(orders.length);
    }
  });
});

// ── 5. Property: subconjunto aleatório — index.md sempre válido ───────────────

describe('Property — frontmatter de index.md válido para qualquer subconjunto', () => {
  /**
   * Property 1: Frontmatter completo nos index.md consolidados
   * Validates: Requirements 2.1, 2.2, 2.3, 2.4
   */
  it('index.md tem frontmatter completo para qualquer subconjunto aleatório (property-based)', () => {
    fc.assert(
      fc.property(
        fc.subarray(CONSOLIDATED_SLUGS, { minLength: 1 }),
        (subset) => {
          for (const slug of subset) {
            const indexPath = join(CHAPTERS_DIR, slug, 'index.md');
            if (!existsSync(indexPath)) return false;
            const fm = parseFrontmatter(indexPath);
            if (!fm.title || !fm.order || !fm.description) return false;
            if (!fm.part || !fm.partOrder) return false;
            const po = Number(fm.partOrder);
            if (po < 1 || po > 12) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── 6. Property: subconjunto aleatório de .mdx — frontmatter sempre válido ────

describe('Property — frontmatter de .mdx válido para qualquer subconjunto de seções', () => {
  /**
   * Property 2: Frontmatter válido nos Content_Files consolidados
   * Validates: Requirements 3.1, 3.2, 3.4, 3.5
   */
  it('title e order presentes para qualquer subconjunto aleatório de .mdx (property-based)', () => {
    const allMdx = CONSOLIDATED_SLUGS.flatMap((slug) => readMdxFiles(slug));

    fc.assert(
      fc.property(
        fc.subarray(allMdx, { minLength: 1 }),
        (subset) => {
          for (const filePath of subset) {
            const fm = parseFrontmatter(filePath);
            if (!fm.title || !fm.order) return false;
            const fileName = filePath.split('/').pop()!;
            const prefix = parseInt(fileName.split('-')[0], 10);
            if (isNaN(prefix) || Number(fm.order) !== prefix) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
