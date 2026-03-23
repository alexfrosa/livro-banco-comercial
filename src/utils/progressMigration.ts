// progressMigration.ts — migra o ProgressStore do localStorage para os slugs consolidados
// Req 6.1–6.8

import { CHAPTER_SLUG_MAP, MIGRATION_VERSION } from './chapterSlugMap';

const PROGRESS_KEY = 'ibbook_progress';
const VERSION_KEY = 'ibbook_progress_version';

export interface ProgressStore {
  visitedSections: Record<string, boolean>;
  lastVisited?: string;
}

/** Lê o ProgressStore do localStorage. Retorna null se ausente, inválido ou inacessível. Req 6.8 */
export function readProgressStore(): ProgressStore | null {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;
    if (typeof parsed.visitedSections !== 'object' || parsed.visitedSections === null) return null;
    return parsed as ProgressStore;
  } catch {
    // SecurityError (private browsing) ou JSON inválido — Req 6.7, 6.8
    return null;
  }
}

/** Persiste o ProgressStore no localStorage. Req 6.8 */
export function writeProgressStore(store: ProgressStore): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(store));
  } catch {
    // localStorage indisponível — degradação silenciosa. Req 6.8
  }
}

/**
 * Migra os slugs antigos do ProgressStore para os slugs consolidados.
 * - No-op se já na versão atual. Req 6.6
 * - Slugs sem mapeamento são descartados. Req 6.3, 6.4
 * - lastVisited é migrado se tiver mapeamento, descartado caso contrário. Req 6.2
 * - Todos os acessos a localStorage envolvidos em try/catch. Req 6.8
 */
export function migrateProgress(): void {
  try {
    // No-op se já migrado. Req 6.6
    const currentVersion = localStorage.getItem(VERSION_KEY);
    if (currentVersion === MIGRATION_VERSION) return;
  } catch {
    return; // localStorage inacessível — Req 6.8
  }

  const store = readProgressStore();

  // Inicializa store vazio se ausente ou corrompido. Req 6.5
  const source: ProgressStore = store ?? { visitedSections: {} };

  const migratedVisited: Record<string, boolean> = {};

  // Migra visitedSections — descarta slugs sem mapeamento. Req 6.3, 6.4
  for (const [oldSlug, value] of Object.entries(source.visitedSections)) {
    const newSlug = CHAPTER_SLUG_MAP[oldSlug];
    if (newSlug !== undefined) {
      migratedVisited[newSlug] = value;
    }
    // slugs sem mapeamento são silenciosamente descartados — Req 6.3
  }

  // Migra lastVisited — descarta se sem mapeamento. Req 6.2
  let migratedLastVisited: string | undefined;
  if (source.lastVisited !== undefined) {
    migratedLastVisited = CHAPTER_SLUG_MAP[source.lastVisited];
  }

  const migratedStore: ProgressStore = {
    visitedSections: migratedVisited,
    ...(migratedLastVisited !== undefined ? { lastVisited: migratedLastVisited } : {}),
  };

  writeProgressStore(migratedStore);

  try {
    localStorage.setItem(VERSION_KEY, MIGRATION_VERSION); // Req 6.1
  } catch {
    // degradação silenciosa — Req 6.8
  }
}
