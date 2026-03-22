import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { filterGlossaryTerms, lookupGlossaryTerm, type GlossaryTerm } from './glossary';

// ---------------------------------------------------------------------------
// Sub-task 7.1 — Property 10: Filtro do Glossário retorna apenas termos relevantes
// Feature: interactive-banking-book, Property 10: Filtro do Glossário retorna apenas termos relevantes
// Validates: Requirements 4.4
// ---------------------------------------------------------------------------

describe('Property 10: Filtro do Glossário retorna apenas termos relevantes', () => {
  it('for any non-empty query, results contain only terms matching term or definition (case-insensitive)', () => {
    // **Validates: Requirements 4.4**
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string(),
            term: fc.string(),
            definition: fc.string(),
          })
        ),
        fc.string({ minLength: 1 }),
        (terms, query) => {
          const results = filterGlossaryTerms(terms, query);
          const lowerQuery = query.toLowerCase();
          for (const result of results) {
            const matches =
              result.term.toLowerCase().includes(lowerQuery) ||
              result.definition.toLowerCase().includes(lowerQuery);
            expect(matches).toBe(true);
          }
        }
      )
    );
  });
});

// ---------------------------------------------------------------------------
// Sub-task 7.2 — Property 11: Lookup de definição de termo
// Feature: interactive-banking-book, Property 11: Lookup de definição de termo
// Validates: Requirements 4.2
// ---------------------------------------------------------------------------

describe('Property 11: Lookup de definição de termo', () => {
  it('returns the term when id exists in the list', () => {
    // **Validates: Requirements 4.2**
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1 }),
            term: fc.string(),
            definition: fc.string(),
          }),
          { minLength: 1 }
        ),
        fc.context(),
        (terms, ctx) => {
          // Pick a random existing term
          const target = terms[Math.floor(Math.random() * terms.length)];
          const result = lookupGlossaryTerm(terms, target.id);
          // Should find a term with that id (may be the first match if duplicates exist)
          expect(result).not.toBeNull();
          expect(result!.id).toBe(target.id);
        }
      )
    );
  });

  it('returns null for any id not present in the list', () => {
    // **Validates: Requirements 4.2**
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string(),
            term: fc.string(),
            definition: fc.string(),
          })
        ),
        fc.string(),
        (terms, id) => {
          // Only test ids that are genuinely absent
          const ids = new Set(terms.map((t) => t.id));
          if (ids.has(id)) return; // skip when id happens to exist
          const result = lookupGlossaryTerm(terms, id);
          expect(result).toBeNull();
        }
      )
    );
  });
});

// ---------------------------------------------------------------------------
// Sub-task 7.3 — Unit tests for glossary functions
// Validates: Requirements 4.2, 4.4
// ---------------------------------------------------------------------------

const sampleTerms: GlossaryTerm[] = [
  {
    id: 'reserva-fracionaria',
    term: 'Reserva Fracionária',
    definition: 'Sistema pelo qual bancos mantêm apenas uma fração dos depósitos como reserva.',
  },
  {
    id: 'multiplicador-monetario',
    term: 'Multiplicador Monetário',
    definition: 'Fator pelo qual a base monetária é expandida pelo sistema bancário.',
  },
  {
    id: 'deposito',
    term: 'Depósito',
    definition: 'Valor entregue pelo cliente ao banco para guarda e rendimento.',
  },
];

describe('filterGlossaryTerms unit tests', () => {
  it('empty query returns all terms', () => {
    const result = filterGlossaryTerms(sampleTerms, '');
    expect(result).toHaveLength(sampleTerms.length);
    expect(result).toEqual(sampleTerms);
  });

  it('query with no match returns empty array', () => {
    const result = filterGlossaryTerms(sampleTerms, 'xyzzy-no-match');
    expect(result).toHaveLength(0);
  });

  it('matches by term (case-insensitive)', () => {
    const result = filterGlossaryTerms(sampleTerms, 'multiplicador');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('multiplicador-monetario');
  });

  it('matches by definition (case-insensitive)', () => {
    const result = filterGlossaryTerms(sampleTerms, 'BASE MONETÁRIA');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('multiplicador-monetario');
  });

  it('returns multiple matches when several terms qualify', () => {
    // Both 'Reserva Fracionária' and 'Multiplicador Monetário' mention 'banco'
    const result = filterGlossaryTerms(sampleTerms, 'banco');
    expect(result.length).toBeGreaterThanOrEqual(2);
  });
});

describe('lookupGlossaryTerm unit tests', () => {
  it('returns the correct term for an existing id', () => {
    const result = lookupGlossaryTerm(sampleTerms, 'deposito');
    expect(result).not.toBeNull();
    expect(result!.term).toBe('Depósito');
  });

  it('returns null for a non-existent id', () => {
    const result = lookupGlossaryTerm(sampleTerms, 'id-inexistente');
    expect(result).toBeNull();
  });

  it('returns null on empty list', () => {
    const result = lookupGlossaryTerm([], 'any-id');
    expect(result).toBeNull();
  });
});
