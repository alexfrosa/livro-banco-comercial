// referencesLoader.ts — utilitário puro para carregamento e validação de referências regulatórias
// Sem dependências de framework (Astro/Preact)
// Req 1.1, 1.2, 1.3, 1.4, 2.4, 3.2, 5.1, 5.3

// Req 1.1 — categorias suportadas (extensível via string)
export type ReferenceCategory =
  | 'CMN'
  | 'BACEN'
  | 'Lei Federal'
  | 'Medida Provisória'
  | string;

// Req 1.2 — estrutura de uma entrada de referência
export interface ReferenceEntry {
  id: string;           // identificador único kebab-case, ex: "resolucao-cmn-4966"
  title: string;        // título completo da norma
  issuer: string;       // órgão emissor
  category: ReferenceCategory;
  url: string;          // URL do documento oficial
  description?: string; // texto explicativo opcional
  publishedAt?: string; // data ISO 8601 opcional, ex: "2021-11-25"
}

// Regex para validação de data ISO 8601 (YYYY-MM-DD) — Req 1.3
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const REQUIRED_FIELDS = ['id', 'title', 'issuer', 'category', 'url'] as const;

/**
 * Valida e retorna um array de ReferenceEntry a partir de dados brutos.
 * Lança erro se campos obrigatórios estiverem ausentes, se houver IDs duplicados,
 * ou se publishedAt não seguir o formato ISO 8601.
 * Req 1.1, 1.2, 1.3, 1.4
 */
export function parseReferences(raw: unknown[]): ReferenceEntry[] {
  const seenIds = new Set<string>();
  const entries: ReferenceEntry[] = [];

  for (const item of raw) {
    const obj = item as Record<string, unknown>;

    // Determina o id para mensagens de erro (pode estar ausente)
    const rawId = typeof obj['id'] === 'string' ? obj['id'] : '(desconhecido)';

    // Req 1.2 — valida campos obrigatórios
    for (const field of REQUIRED_FIELDS) {
      if (typeof obj[field] !== 'string' || (obj[field] as string).trim() === '') {
        throw new Error(
          `[references] Referência inválida: campo obrigatório "${field}" ausente na entrada com id "${rawId}".`
        );
      }
    }

    const id = obj['id'] as string;

    // Req 1.4 — detecta IDs duplicados
    if (seenIds.has(id)) {
      throw new Error(
        `[references] ID duplicado encontrado: "${id}". Cada referência deve ter um identificador único.`
      );
    }
    seenIds.add(id);

    // Req 1.3 — valida publishedAt quando presente
    const publishedAt = obj['publishedAt'];
    if (publishedAt !== undefined && publishedAt !== null) {
      if (typeof publishedAt !== 'string' || !ISO_DATE_RE.test(publishedAt)) {
        throw new Error(
          `[references] Data inválida em "${id}": "${publishedAt}" não segue o formato ISO 8601 (YYYY-MM-DD).`
        );
      }
    }

    entries.push({
      id,
      title: obj['title'] as string,
      issuer: obj['issuer'] as string,
      category: obj['category'] as ReferenceCategory,
      url: obj['url'] as string,
      description: typeof obj['description'] === 'string' ? obj['description'] : undefined,
      publishedAt: typeof obj['publishedAt'] === 'string' ? obj['publishedAt'] : undefined,
    });
  }

  return entries;
}

/**
 * Retorna a ReferenceEntry com o id fornecido, ou null se não encontrada.
 * Req 3.1, 3.3, 3.4
 */
export function lookupReference(entries: ReferenceEntry[], id: string): ReferenceEntry | null {
  return entries.find((e) => e.id === id) ?? null;
}

/**
 * Agrupa um array de ReferenceEntry por categoria.
 * Retorna um Map<category, ReferenceEntry[]> com entradas ordenadas por título dentro de cada grupo.
 * Req 2.2
 */
export function groupByCategory(entries: ReferenceEntry[]): Map<string, ReferenceEntry[]> {
  const map = new Map<string, ReferenceEntry[]>();

  for (const entry of entries) {
    const group = map.get(entry.category);
    if (group) {
      group.push(entry);
    } else {
      map.set(entry.category, [entry]);
    }
  }

  // Ordena entradas por título dentro de cada grupo
  for (const group of map.values()) {
    group.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
  }

  return map;
}

/**
 * Gera o href de âncora para uma referência: "#ref-{id}"
 * Req 2.4
 */
export function referenceAnchor(id: string): string {
  return `#ref-${id}`;
}

/**
 * Gera o href completo para um Inline_Reference_Link: "{baseUrl}/referencias#ref-{id}"
 * baseUrl padrão é string vazia.
 * Req 3.2
 */
export function referenceHref(id: string, baseUrl: string = ''): string {
  return `${baseUrl}/referencias#ref-${id}`;
}
