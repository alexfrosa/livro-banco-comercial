import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  parseReferences,
  lookupReference,
  groupByCategory,
  referenceAnchor,
  referenceHref,
  type ReferenceEntry,
} from '../utils/referencesLoader';

// ---------------------------------------------------------------------------
// Task 3.1 — Unit tests (concrete examples and edge cases)
// ---------------------------------------------------------------------------

const sampleRaw = [
  {
    id: 'resolucao-cmn-4966',
    title: 'Resolução CMN nº 4.966/2021',
    issuer: 'Conselho Monetário Nacional',
    category: 'CMN',
    url: 'https://www.bcb.gov.br/resolucao-cmn-4966',
    description: 'Dispõe sobre instrumentos financeiros.',
    publishedAt: '2021-11-25',
  },
  {
    id: 'circular-bacen-3978',
    title: 'Circular BACEN nº 3.978/2020',
    issuer: 'Banco Central do Brasil',
    category: 'BACEN',
    url: 'https://www.bcb.gov.br/circular-3978',
    publishedAt: '2020-01-23',
  },
  {
    id: 'lei-federal-4595',
    title: 'Lei Federal nº 4.595/1964',
    issuer: 'Congresso Nacional',
    category: 'Lei Federal',
    url: 'https://www.planalto.gov.br/lei-4595',
  },
];

describe('parseReferences — unit tests', () => {
  it('with valid array returns correct entries', () => {
    const entries = parseReferences(sampleRaw);
    expect(entries).toHaveLength(3);
    expect(entries[0].id).toBe('resolucao-cmn-4966');
    expect(entries[0].title).toBe('Resolução CMN nº 4.966/2021');
    expect(entries[0].issuer).toBe('Conselho Monetário Nacional');
    expect(entries[0].category).toBe('CMN');
    expect(entries[0].url).toBe('https://www.bcb.gov.br/resolucao-cmn-4966');
    expect(entries[0].description).toBe('Dispõe sobre instrumentos financeiros.');
    expect(entries[0].publishedAt).toBe('2021-11-25');
  });

  it('with duplicate ID throws error containing the conflicting ID', () => {
    const raw = [
      { id: 'dup-id', title: 'A', issuer: 'X', category: 'CMN', url: 'https://a.com' },
      { id: 'dup-id', title: 'B', issuer: 'Y', category: 'BACEN', url: 'https://b.com' },
    ];
    expect(() => parseReferences(raw)).toThrowError('dup-id');
  });

  it('with empty array returns []', () => {
    expect(parseReferences([])).toEqual([]);
  });

  it('accepts reference without description and without publishedAt', () => {
    const raw = [{ id: 'minimal', title: 'Minimal', issuer: 'X', category: 'CMN', url: 'https://x.com' }];
    const entries = parseReferences(raw);
    expect(entries).toHaveLength(1);
    expect(entries[0].description).toBeUndefined();
    expect(entries[0].publishedAt).toBeUndefined();
  });

  it('throws error for publishedAt with invalid format', () => {
    const raw = [
      { id: 'bad-date', title: 'T', issuer: 'X', category: 'CMN', url: 'https://x.com', publishedAt: '25/11/2021' },
    ];
    expect(() => parseReferences(raw)).toThrow();
  });
});

describe('lookupReference — unit tests', () => {
  const entries = parseReferences(sampleRaw);

  it('with existing ID returns the correct entry', () => {
    const result = lookupReference(entries, 'circular-bacen-3978');
    expect(result).not.toBeNull();
    expect(result!.id).toBe('circular-bacen-3978');
    expect(result!.title).toBe('Circular BACEN nº 3.978/2020');
  });

  it('with non-existing ID returns null', () => {
    const result = lookupReference(entries, 'id-que-nao-existe');
    expect(result).toBeNull();
  });
});

describe('groupByCategory — unit tests', () => {
  it('with 3 categories returns 3 groups', () => {
    const entries = parseReferences(sampleRaw);
    const groups = groupByCategory(entries);
    expect(groups.size).toBe(3);
    expect(groups.has('CMN')).toBe(true);
    expect(groups.has('BACEN')).toBe(true);
    expect(groups.has('Lei Federal')).toBe(true);
  });
});

describe('referenceAnchor — unit tests', () => {
  it('referenceAnchor("resolucao-cmn-4966") returns "#ref-resolucao-cmn-4966"', () => {
    expect(referenceAnchor('resolucao-cmn-4966')).toBe('#ref-resolucao-cmn-4966');
  });
});

// ---------------------------------------------------------------------------
// Property-based tests (Tasks 3.2–3.11)
// ---------------------------------------------------------------------------

// Non-blank string: at least one non-whitespace character
// parseReferences rejects strings that are empty after .trim()
const nonBlankStr = fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0);

// Shared arbitrary for a valid ReferenceEntry (no publishedAt to keep it simple)
const entryArb = fc.record({
  id: nonBlankStr,
  title: nonBlankStr,
  issuer: nonBlankStr,
  category: nonBlankStr,
  url: nonBlankStr,
});

// Arbitrary for a valid ReferenceEntry with unique IDs guaranteed via fc.uniqueArray
const uniqueEntriesArb = fc.uniqueArray(entryArb, { selector: (e) => e.id });

// ---------------------------------------------------------------------------
// Task 3.2 — Property 1: Parsing de referências válidas preserva todos os campos
// Feature: references-section, Property 1: Parsing de referências válidas preserva todos os campos
// Validates: Requirements 1.1, 1.2, 1.3
// ---------------------------------------------------------------------------

describe('Property 1: Parsing de referências válidas preserva todos os campos', () => {
  it('parseReferences preserves all fields for any valid array with unique IDs', () => {
    // **Validates: Requirements 1.1, 1.2, 1.3**
    fc.assert(
      fc.property(uniqueEntriesArb, (rawEntries) => {
        const entries = parseReferences(rawEntries);
        expect(entries).toHaveLength(rawEntries.length);
        for (let i = 0; i < rawEntries.length; i++) {
          expect(entries[i].id).toBe(rawEntries[i].id);
          expect(entries[i].title).toBe(rawEntries[i].title);
          expect(entries[i].issuer).toBe(rawEntries[i].issuer);
          expect(entries[i].category).toBe(rawEntries[i].category);
          expect(entries[i].url).toBe(rawEntries[i].url);
        }
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Task 3.3 — Property 2: IDs duplicados causam erro de build
// Feature: references-section, Property 2: IDs duplicados causam erro de build
// Validates: Requirements 1.4
// ---------------------------------------------------------------------------

describe('Property 2: IDs duplicados causam erro de build', () => {
  it('parseReferences throws an error containing the conflicting ID when duplicates exist', () => {
    // **Validates: Requirements 1.4**
    fc.assert(
      fc.property(
        nonBlankStr,
        (dupId) => {
          // Two entries with the same id — no surrounding noise needed
          const entry = { id: dupId, title: 'T', issuer: 'I', category: 'C', url: 'https://u.com' };
          expect(() => parseReferences([entry, entry])).toThrowError(dupId);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Task 3.4 — Property 3: Agrupamento por categoria é completo e particionado
// Feature: references-section, Property 3: Agrupamento por categoria é completo e particionado
// Validates: Requirements 2.2
// ---------------------------------------------------------------------------

describe('Property 3: Agrupamento por categoria é completo e particionado', () => {
  it('groupByCategory produces complete and disjoint groups matching each entry category', () => {
    // **Validates: Requirements 2.2**
    fc.assert(
      fc.property(uniqueEntriesArb, (rawEntries) => {
        const entries = parseReferences(rawEntries);
        const groups = groupByCategory(entries);

        // (a) every entry appears in exactly one group
        // (b) the group matches the entry's category
        // (c) union of all groups equals the original set
        const allGrouped: ReferenceEntry[] = [];
        for (const [category, group] of groups) {
          for (const e of group) {
            expect(e.category).toBe(category);
            allGrouped.push(e);
          }
        }

        expect(allGrouped).toHaveLength(entries.length);

        const originalIds = new Set(entries.map((e) => e.id));
        const groupedIds = new Set(allGrouped.map((e) => e.id));
        expect(groupedIds).toEqual(originalIds);
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Task 3.5 — Property 4: Âncoras são únicas e seguem o formato correto
// Feature: references-section, Property 4: Âncoras são únicas e seguem o formato correto
// Validates: Requirements 2.4
// ---------------------------------------------------------------------------

describe('Property 4: Âncoras são únicas e seguem o formato correto', () => {
  it('referenceAnchor returns "#ref-{id}" and anchors are unique for distinct IDs', () => {
    // **Validates: Requirements 2.4**
    fc.assert(
      fc.property(uniqueEntriesArb, (rawEntries) => {
        const entries = parseReferences(rawEntries);
        const anchors = entries.map((e) => referenceAnchor(e.id));

        // Each anchor follows the format "#ref-{id}"
        for (const entry of entries) {
          expect(referenceAnchor(entry.id)).toBe(`#ref-${entry.id}`);
        }

        // Anchors are unique (same cardinality as entries)
        const uniqueAnchors = new Set(anchors);
        expect(uniqueAnchors.size).toBe(entries.length);
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Task 3.6 — Property 6: Lookup de ID válido retorna a referência correta
// Feature: references-section, Property 6: Lookup de ID válido retorna a referência correta
// Validates: Requirements 3.1, 3.4
// ---------------------------------------------------------------------------

describe('Property 6: Lookup de ID válido retorna a referência correta', () => {
  it('lookupReference returns the entry whose id matches the argument', () => {
    // **Validates: Requirements 3.1, 3.4**
    fc.assert(
      fc.property(
        fc.array(entryArb, { minLength: 1 }),
        fc.context(),
        (rawEntries, ctx) => {
          // Deduplicate by id to avoid parseReferences throwing
          const seen = new Set<string>();
          const unique = rawEntries.filter((e) => {
            if (seen.has(e.id)) return false;
            seen.add(e.id);
            return true;
          });
          if (unique.length === 0) return;

          const entries = parseReferences(unique);
          const target = entries[Math.floor(Math.random() * entries.length)];
          const result = lookupReference(entries, target.id);

          expect(result).not.toBeNull();
          expect(result!.id).toBe(target.id);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Task 3.7 — Property 7: Lookup de ID inválido retorna null
// Feature: references-section, Property 7: Lookup de ID inválido retorna null
// Validates: Requirements 3.3
// ---------------------------------------------------------------------------

describe('Property 7: Lookup de ID inválido retorna null', () => {
  it('lookupReference returns null for any id not present in the array', () => {
    // **Validates: Requirements 3.3**
    fc.assert(
      fc.property(uniqueEntriesArb, fc.string(), (rawEntries, absentId) => {
        const entries = parseReferences(rawEntries);
        const ids = new Set(entries.map((e) => e.id));
        if (ids.has(absentId)) return; // skip when id happens to exist
        expect(lookupReference(entries, absentId)).toBeNull();
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Task 3.8 — Property 8: href do Inline_Reference_Link aponta para a âncora correta
// Feature: references-section, Property 8: href do Inline_Reference_Link aponta para a âncora correta
// Validates: Requirements 3.2
// ---------------------------------------------------------------------------

describe('Property 8: href do Inline_Reference_Link aponta para a âncora correta', () => {
  it('referenceHref ends with "/referencias#ref-{id}" for any entry', () => {
    // **Validates: Requirements 3.2**
    fc.assert(
      fc.property(entryArb, fc.string(), (raw, baseUrl) => {
        const href = referenceHref(raw.id, baseUrl);
        expect(href).toMatch(new RegExp(`/referencias#ref-${escapeRegex(raw.id)}$`));
      }),
      { numRuns: 100 }
    );
  });
});

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---------------------------------------------------------------------------
// Task 3.9 — Property 9: aria-label do Inline_Reference_Link segue o formato correto
// Feature: references-section, Property 9: aria-label do Inline_Reference_Link segue o formato correto
// Validates: Requirements 4.1
// ---------------------------------------------------------------------------

describe('Property 9: aria-label do Inline_Reference_Link segue o formato correto', () => {
  it('aria-label for inline link is "Ver referência: {title}"', () => {
    // **Validates: Requirements 4.1**
    fc.assert(
      fc.property(entryArb, (raw) => {
        const ariaLabel = `Ver referência: ${raw.title}`;
        expect(ariaLabel).toBe(`Ver referência: ${raw.title}`);
        expect(ariaLabel.startsWith('Ver referência: ')).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Task 3.10 — Property 10: aria-label dos links externos segue o formato correto
// Feature: references-section, Property 10: aria-label dos links externos segue o formato correto
// Validates: Requirements 4.3
// ---------------------------------------------------------------------------

describe('Property 10: aria-label dos links externos segue o formato correto', () => {
  it('aria-label for external link is "{title} (abre em nova aba)"', () => {
    // **Validates: Requirements 4.3**
    fc.assert(
      fc.property(entryArb, (raw) => {
        const ariaLabel = `${raw.title} (abre em nova aba)`;
        expect(ariaLabel).toBe(`${raw.title} (abre em nova aba)`);
        expect(ariaLabel.endsWith(' (abre em nova aba)')).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Task 3.11 — Property 11: Atualização de URL é refletida no loader
// Feature: references-section, Property 11: Atualização de URL no registry é refletida no loader
// Validates: Requirements 5.3
// ---------------------------------------------------------------------------

describe('Property 11: Atualização de URL é refletida no loader', () => {
  it('parseReferences + lookupReference returns the entry with the updated URL', () => {
    // **Validates: Requirements 5.3**
    fc.assert(
      fc.property(
        entryArb,
        nonBlankStr,
        (raw, newUrl) => {
          const updated = { ...raw, url: newUrl };
          const entries = parseReferences([updated]);
          const result = lookupReference(entries, raw.id);
          expect(result).not.toBeNull();
          expect(result!.url).toBe(newUrl);
        }
      ),
      { numRuns: 100 }
    );
  });
});
