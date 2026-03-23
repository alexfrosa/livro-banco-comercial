/**
 * Content Structure Tests — Capítulos 47–67
 *
 * Validates structural integrity of the 21 new chapters added in the
 * content-gaps-expansion spec (Requisitos 1–10).
 *
 * Req 1–10: integridade estrutural dos capítulos 47–67
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// ── Helpers ───────────────────────────────────────────────────────────────────

const CHAPTERS_DIR = resolve(process.cwd(), 'content/chapters');

/** Returns all chapter folder names sorted */
function readChapterDirs(): string[] {
  return readdirSync(CHAPTERS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

/** Returns all .mdx file paths recursively under content/chapters */
function readAllMdxFiles(): string[] {
  const results: string[] = [];
  for (const dir of readChapterDirs()) {
    const dirPath = join(CHAPTERS_DIR, dir);
    const files = readdirSync(dirPath).filter((f) => f.endsWith('.mdx'));
    for (const f of files) results.push(join(dirPath, f));
  }
  return results;
}

/** Parse frontmatter from a markdown/mdx file without gray-matter */
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
    // parse booleans
    if (val === 'true') fm[key] = true;
    else if (val === 'false') fm[key] = false;
    else if (val !== '') fm[key] = isNaN(Number(val)) ? val : Number(val);
  }
  return fm;
}

// ── 1. Os 21 capítulos novos existem como pastas ──────────────────────────────

describe('Capítulos 47–67 — existência das pastas', () => {
  const expectedPrefixes = Array.from({ length: 21 }, (_, i) => String(i + 47));

  it('cada capítulo de 47 a 67 tem uma pasta em content/chapters/', () => {
    const dirs = readChapterDirs();
    for (const prefix of expectedPrefixes) {
      const found = dirs.some((d) => d.startsWith(prefix + '-'));
      expect(found, `pasta para capítulo ${prefix} não encontrada`).toBe(true);
    }
  });

  it('nenhum capítulo novo (47–67) colide com capítulos existentes (00–46)', () => {
    const dirs = readChapterDirs();
    const orders = dirs
      .map((d) => parseInt(d.split('-')[0], 10))
      .filter((n) => !isNaN(n));
    const set = new Set(orders);
    expect(set.size).toBe(orders.length); // sem duplicatas
  });
});

// ── 2. Cada capítulo tem o número correto de seções .mdx ──────────────────────

describe('Capítulos 47–67 — número de seções .mdx', () => {
  // [chapterPrefix, expectedMdxCount]
  const sectionCounts: [string, number][] = [
    ['47', 4], // 01-conceitos, 02-financiamento-imobiliario, 03-financiamento-veiculos, 04-capital-de-giro
    ['48', 2], // 01-jornada, 02-backoffice
    ['49', 1], // 01-simulacao
    ['50', 3], // 01-conceitos, 02-faturamento, 03-chargeback-pontos
    ['51', 2], // 01-jornada, 02-backoffice
    ['52', 2], // 01-conceitos, 02-cota-e-tributacao
    ['53', 2], // 01-jornada, 02-backoffice
    ['54', 2], // 01-conceitos, 02-fase-beneficio
    ['55', 2], // 01-jornada, 02-backoffice
    ['56', 2], // 01-conceitos, 02-eventos-corporativos
    ['57', 2], // 01-jornada, 02-backoffice
    ['58', 1], // 01-simulacao
    ['59', 2], // 01-conceitos, 02-swift-correspondentes
    ['60', 2], // 01-jornada, 02-backoffice
    ['61', 2], // 01-conceitos, 02-seguro-prestamista
    ['62', 2], // 01-jornada, 02-backoffice
    ['63', 1], // 01-conceitos
    ['64', 2], // 01-jornada, 02-backoffice
    ['65', 2], // 01-conceitos, 02-pisp-agregacao
    ['66', 2], // 01-jornada, 02-backoffice
    ['67', 2], // 01-conceitos, 02-licencas-e-riscos
  ];

  for (const [prefix, count] of sectionCounts) {
    it(`capítulo ${prefix} tem ${count} arquivo(s) .mdx`, () => {
      const dirs = readChapterDirs();
      const dir = dirs.find((d) => d.startsWith(prefix + '-'));
      expect(dir, `pasta para capítulo ${prefix} não encontrada`).toBeTruthy();
      const dirPath = join(CHAPTERS_DIR, dir!);
      const mdxFiles = readdirSync(dirPath).filter((f) => f.endsWith('.mdx'));
      expect(mdxFiles.length).toBe(count);
    });
  }
});

// ── 3. Caps. 49 e 58 têm simulation: true ────────────────────────────────────

describe('Capítulos de simulação — frontmatter simulation: true', () => {
  it('cap. 49 — 01-simulacao.mdx tem simulation: true (Req 7.3)', () => {
    const dirs = readChapterDirs();
    const dir = dirs.find((d) => d.startsWith('49-'))!;
    const filePath = join(CHAPTERS_DIR, dir, '01-simulacao.mdx');
    expect(existsSync(filePath)).toBe(true);
    const fm = parseFrontmatter(filePath);
    expect(fm.simulation).toBe(true);
  });

  it('cap. 58 — 01-simulacao.mdx tem simulation: true (Req 3.6)', () => {
    const dirs = readChapterDirs();
    const dir = dirs.find((d) => d.startsWith('58-'))!;
    const filePath = join(CHAPTERS_DIR, dir, '01-simulacao.mdx');
    expect(existsSync(filePath)).toBe(true);
    const fm = parseFrontmatter(filePath);
    expect(fm.simulation).toBe(true);
  });
});

// ── 4. Todos os index.md têm frontmatter válido ───────────────────────────────

describe('index.md — frontmatter válido nos capítulos 47–67', () => {
  const newChapterPrefixes = Array.from({ length: 21 }, (_, i) => String(i + 47));

  it('todos os index.md dos capítulos 47–67 têm title, order e description', () => {
    const dirs = readChapterDirs();
    for (const prefix of newChapterPrefixes) {
      const dir = dirs.find((d) => d.startsWith(prefix + '-'));
      if (!dir) continue;
      const indexPath = join(CHAPTERS_DIR, dir, 'index.md');
      expect(existsSync(indexPath), `index.md ausente em ${dir}`).toBe(true);
      const fm = parseFrontmatter(indexPath);
      expect(fm.title, `title ausente em ${dir}/index.md`).toBeTruthy();
      expect(fm.order, `order ausente em ${dir}/index.md`).toBeTruthy();
      expect(fm.description, `description ausente em ${dir}/index.md`).toBeTruthy();
    }
  });

  it('o campo order em index.md corresponde ao número do capítulo', () => {
    const dirs = readChapterDirs();
    for (const prefix of newChapterPrefixes) {
      const dir = dirs.find((d) => d.startsWith(prefix + '-'));
      if (!dir) continue;
      const indexPath = join(CHAPTERS_DIR, dir, 'index.md');
      if (!existsSync(indexPath)) continue;
      const fm = parseFrontmatter(indexPath);
      expect(Number(fm.order)).toBe(Number(prefix));
    }
  });
});

// ── 5. Todos os .mdx têm title e order ───────────────────────────────────────

describe('Seções .mdx — frontmatter válido nos capítulos 47–67', () => {
  it('todos os .mdx dos capítulos 47–67 têm title e order não-vazios', () => {
    const dirs = readChapterDirs();
    const newDirs = dirs.filter((d) => {
      const n = parseInt(d.split('-')[0], 10);
      return n >= 47 && n <= 67;
    });
    for (const dir of newDirs) {
      const dirPath = join(CHAPTERS_DIR, dir);
      const mdxFiles = readdirSync(dirPath).filter((f) => f.endsWith('.mdx'));
      for (const file of mdxFiles) {
        const filePath = join(dirPath, file);
        const fm = parseFrontmatter(filePath);
        expect(fm.title, `title ausente em ${dir}/${file}`).toBeTruthy();
        expect(fm.order, `order ausente em ${dir}/${file}`).toBeTruthy();
      }
    }
  });
});

// ── 6. Property: subconjunto aleatório de pastas — index.md sempre válido ─────

describe('Property — frontmatter de index.md válido para qualquer subconjunto de capítulos', () => {
  /**
   * Para qualquer subconjunto aleatório de pastas de capítulo (47–67),
   * index.md deve existir e conter title, order e description não-vazios.
   * Req 1–10 (integridade estrutural)
   */
  it('index.md tem frontmatter completo para qualquer subconjunto aleatório (property-based)', () => {
    const dirs = readChapterDirs().filter((d) => {
      const n = parseInt(d.split('-')[0], 10);
      return n >= 47 && n <= 67;
    });

    fc.assert(
      fc.property(
        fc.subarray(dirs, { minLength: 1 }),
        (subset) => {
          for (const dir of subset) {
            const indexPath = join(CHAPTERS_DIR, dir, 'index.md');
            if (!existsSync(indexPath)) return false;
            const fm = parseFrontmatter(indexPath);
            if (!fm.title || !fm.order || !fm.description) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ── 7. Property: subconjunto aleatório de .mdx — frontmatter sempre válido ────

describe('Property — frontmatter de .mdx válido para qualquer subconjunto de seções', () => {
  /**
   * Para qualquer subconjunto aleatório de arquivos .mdx (caps 47–67),
   * frontmatter deve conter title e order não-vazios.
   * Req 1–10
   */
  it('title e order presentes para qualquer subconjunto aleatório de .mdx (property-based)', () => {
    const allMdx = readAllMdxFiles().filter((p) => {
      const parts = p.split('/');
      const dirName = parts[parts.length - 2];
      const n = parseInt(dirName.split('-')[0], 10);
      return n >= 47 && n <= 67;
    });

    fc.assert(
      fc.property(
        fc.subarray(allMdx, { minLength: 1 }),
        (subset) => {
          for (const filePath of subset) {
            const fm = parseFrontmatter(filePath);
            if (!fm.title || !fm.order) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
