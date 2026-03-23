/**
 * progressMigration.test.ts
 *
 * Tests for src/utils/progressMigration.ts
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Window } from 'happy-dom';
import { CHAPTER_SLUG_MAP, MIGRATION_VERSION } from '../utils/chapterSlugMap';

// ── Setup happy-dom localStorage mock ────────────────────────────────────────

const window = new Window();
const localStorage = window.localStorage;

// Inject localStorage into global scope for the module under test
Object.defineProperty(global, 'localStorage', {
  value: localStorage,
  writable: true,
});

// Import after setting up global localStorage
const { migrateProgress, readProgressStore, writeProgressStore } = await import('../utils/progressMigration');

// ── Helpers ───────────────────────────────────────────────────────────────────

function clearStorage() {
  localStorage.clear();
}

// Pick a few known entries from the map for fixtures
const OLD_SLUG_1 = '00-introducao/01-objetivo';
const NEW_SLUG_1 = CHAPTER_SLUG_MAP[OLD_SLUG_1]!;

const OLD_SLUG_2 = '02-regulacao/01-conceitos';
const NEW_SLUG_2 = CHAPTER_SLUG_MAP[OLD_SLUG_2]!;

const UNKNOWN_SLUG = 'xx-nao-existe/01-nada';

// ── 1. readProgressStore / writeProgressStore ─────────────────────────────────

describe('readProgressStore', () => {
  beforeEach(clearStorage);

  it('retorna null quando localStorage está vazio (Req 6.5)', () => {
    expect(readProgressStore()).toBeNull();
  });

  it('retorna null para JSON inválido (Req 6.7)', () => {
    localStorage.setItem('ibbook_progress', 'not-json{{{');
    expect(readProgressStore()).toBeNull();
  });

  it('retorna null para objeto sem visitedSections (Req 6.7)', () => {
    localStorage.setItem('ibbook_progress', JSON.stringify({ foo: 'bar' }));
    expect(readProgressStore()).toBeNull();
  });

  it('retorna o store quando válido', () => {
    const store = { visitedSections: { [OLD_SLUG_1]: true }, lastVisited: OLD_SLUG_1 };
    localStorage.setItem('ibbook_progress', JSON.stringify(store));
    const result = readProgressStore();
    expect(result).not.toBeNull();
    expect(result!.visitedSections[OLD_SLUG_1]).toBe(true);
    expect(result!.lastVisited).toBe(OLD_SLUG_1);
  });
});

describe('writeProgressStore', () => {
  beforeEach(clearStorage);

  it('persiste o store no localStorage', () => {
    const store = { visitedSections: { [NEW_SLUG_1]: true } };
    writeProgressStore(store);
    const raw = localStorage.getItem('ibbook_progress');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.visitedSections[NEW_SLUG_1]).toBe(true);
  });
});

// ── 2. migrateProgress — casos de exemplo ────────────────────────────────────

describe('migrateProgress — migração de slugs antigos', () => {
  beforeEach(clearStorage);

  it('migra slug antigo válido para slug novo correto (Req 6.2)', () => {
    const store = { visitedSections: { [OLD_SLUG_1]: true } };
    localStorage.setItem('ibbook_progress', JSON.stringify(store));

    migrateProgress();

    const result = readProgressStore();
    expect(result).not.toBeNull();
    expect(result!.visitedSections[NEW_SLUG_1]).toBe(true);
    expect(result!.visitedSections[OLD_SLUG_1]).toBeUndefined();
  });

  it('migra múltiplos slugs antigos corretamente (Req 6.2)', () => {
    const store = {
      visitedSections: {
        [OLD_SLUG_1]: true,
        [OLD_SLUG_2]: true,
      },
    };
    localStorage.setItem('ibbook_progress', JSON.stringify(store));

    migrateProgress();

    const result = readProgressStore();
    expect(result!.visitedSections[NEW_SLUG_1]).toBe(true);
    expect(result!.visitedSections[NEW_SLUG_2]).toBe(true);
  });

  it('migra lastVisited corretamente (Req 6.2)', () => {
    const store = { visitedSections: {}, lastVisited: OLD_SLUG_1 };
    localStorage.setItem('ibbook_progress', JSON.stringify(store));

    migrateProgress();

    const result = readProgressStore();
    expect(result!.lastVisited).toBe(NEW_SLUG_1);
  });

  it('descarta lastVisited sem mapeamento (Req 6.3, 6.4)', () => {
    const store = { visitedSections: {}, lastVisited: UNKNOWN_SLUG };
    localStorage.setItem('ibbook_progress', JSON.stringify(store));

    migrateProgress();

    const result = readProgressStore();
    expect(result!.lastVisited).toBeUndefined();
  });

  it('descarta slugs sem mapeamento em visitedSections (Req 6.3, 6.4)', () => {
    const store = {
      visitedSections: {
        [OLD_SLUG_1]: true,
        [UNKNOWN_SLUG]: true,
      },
    };
    localStorage.setItem('ibbook_progress', JSON.stringify(store));

    migrateProgress();

    const result = readProgressStore();
    expect(result!.visitedSections[NEW_SLUG_1]).toBe(true);
    expect(result!.visitedSections[UNKNOWN_SLUG]).toBeUndefined();
  });

  it('grava ibbook_progress_version = MIGRATION_VERSION após migração (Req 6.1)', () => {
    localStorage.setItem('ibbook_progress', JSON.stringify({ visitedSections: {} }));
    migrateProgress();
    expect(localStorage.getItem('ibbook_progress_version')).toBe(MIGRATION_VERSION);
  });

  it('no-op quando ibbook_progress_version já é MIGRATION_VERSION (Req 6.6)', () => {
    const store = { visitedSections: { [OLD_SLUG_1]: true } };
    localStorage.setItem('ibbook_progress', JSON.stringify(store));
    localStorage.setItem('ibbook_progress_version', MIGRATION_VERSION);

    migrateProgress();

    // Store should be unchanged (old slug still present — migration was skipped)
    const raw = localStorage.getItem('ibbook_progress');
    const parsed = JSON.parse(raw!);
    expect(parsed.visitedSections[OLD_SLUG_1]).toBe(true);
  });

  it('inicializa store vazio quando localStorage está ausente (Req 6.5)', () => {
    // No ibbook_progress set
    migrateProgress();
    const result = readProgressStore();
    expect(result).not.toBeNull();
    expect(result!.visitedSections).toEqual({});
  });

  it('não lança exceção com JSON corrompido (Req 6.7, 6.8)', () => {
    localStorage.setItem('ibbook_progress', '{{invalid}}');
    expect(() => migrateProgress()).not.toThrow();
  });
});
