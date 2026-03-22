export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  relatedTerms?: string[];
}

/**
 * Filters glossary terms by query string (case-insensitive match on term or definition).
 * Returns all terms if query is empty.
 */
export function filterGlossaryTerms(terms: GlossaryTerm[], query: string): GlossaryTerm[] {
  if (query === '') return terms;
  const lowerQuery = query.toLowerCase();
  return terms.filter(
    (t) =>
      t.term.toLowerCase().includes(lowerQuery) ||
      t.definition.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Returns the term with the matching id, or null if not found.
 */
export function lookupGlossaryTerm(terms: GlossaryTerm[], id: string): GlossaryTerm | null {
  return terms.find((t) => t.id === id) ?? null;
}
