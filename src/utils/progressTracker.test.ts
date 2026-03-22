import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { createProgressTracker } from './progressTracker';

beforeEach(() => {
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// Sub-task 4.1 — Property 4: Round-trip de progresso de leitura
// Feature: interactive-banking-book, Property 4: Round-trip de progresso de leitura
// Validates: Requirements 2.1, 2.2
// ---------------------------------------------------------------------------

describe('Property 4: Round-trip de progresso de leitura', () => {
  it('markVisited sequence → getProgress contains all slugs, lastVisited = last slug', () => {
    // **Validates: Requirements 2.1, 2.2**
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
        fc.integer({ min: 1, max: 200 }),
        (slugs, total) => {
          localStorage.clear();
          const tracker = createProgressTracker(total);
          slugs.forEach(slug => tracker.markVisited(slug));

          const progress = tracker.getProgress();
          const uniqueSlugs = [...new Set(slugs)];

          // All unique slugs must be present in visitedSections
          uniqueSlugs.forEach(slug => {
            expect(progress.visitedSections).toContain(slug);
          });

          // lastVisited must equal the last slug in the sequence
          expect(progress.lastVisited).toBe(slugs[slugs.length - 1]);
        }
      )
    );
  });
});

// ---------------------------------------------------------------------------
// Sub-task 4.2 — Property 5: Cálculo correto do percentual de progresso
// Feature: interactive-banking-book, Property 5: Cálculo correto do percentual de progresso
// Validates: Requirements 2.4
// ---------------------------------------------------------------------------

describe('Property 5: Percentual de progresso sempre em [0, 100]', () => {
  it('getPercentage() is always in [0, 100] for any visited/total combination', () => {
    // **Validates: Requirements 2.4**
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 })),
        fc.integer({ min: 1, max: 100 }),
        (visited, total) => {
          localStorage.clear();
          const tracker = createProgressTracker(total);
          visited.forEach(slug => tracker.markVisited(slug));

          const pct = tracker.getPercentage();
          expect(pct).toBeGreaterThanOrEqual(0);
          expect(pct).toBeLessThanOrEqual(100);
        }
      )
    );
  });
});

// ---------------------------------------------------------------------------
// Sub-task 4.3 — Property 6: Reset zera completamente o progresso
// Feature: interactive-banking-book, Property 6: Reset zera completamente o progresso
// Validates: Requirements 2.5
// ---------------------------------------------------------------------------

describe('Property 6: Reset zera completamente o progresso', () => {
  it('after reset(), progress is empty and percentage is 0', () => {
    // **Validates: Requirements 2.5**
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
        fc.integer({ min: 1, max: 100 }),
        (slugs, total) => {
          localStorage.clear();
          const tracker = createProgressTracker(total);
          slugs.forEach(slug => tracker.markVisited(slug));

          tracker.reset();

          const progress = tracker.getProgress();
          expect(progress.visitedSections).toEqual([]);
          expect(progress.lastVisited).toBeNull();
          expect(tracker.getPercentage()).toBe(0);
        }
      )
    );
  });
});

// ---------------------------------------------------------------------------
// Sub-task 4.4 — Unit tests
// Validates: Requirements 2.1, 2.2, 2.4, 2.5
// ---------------------------------------------------------------------------

describe('ProgressTracker unit tests', () => {
  it('returns empty progress when nothing has been visited', () => {
    const tracker = createProgressTracker(10);
    const progress = tracker.getProgress();
    expect(progress.visitedSections).toEqual([]);
    expect(progress.lastVisited).toBeNull();
    expect(tracker.getPercentage()).toBe(0);
  });

  it('does not duplicate slugs when the same section is visited twice', () => {
    const tracker = createProgressTracker(5);
    tracker.markVisited('intro/section-1');
    tracker.markVisited('intro/section-1');
    const progress = tracker.getProgress();
    expect(progress.visitedSections).toHaveLength(1);
    expect(progress.visitedSections[0]).toBe('intro/section-1');
  });

  it('updates lastVisited on duplicate visit', () => {
    const tracker = createProgressTracker(5);
    tracker.markVisited('intro/section-1');
    tracker.markVisited('intro/section-2');
    tracker.markVisited('intro/section-1'); // revisit
    expect(tracker.getProgress().lastVisited).toBe('intro/section-1');
  });

  it('calculates percentage correctly with totalSections = 1', () => {
    const tracker = createProgressTracker(1);
    expect(tracker.getPercentage()).toBe(0);
    tracker.markVisited('only-section');
    expect(tracker.getPercentage()).toBe(100);
  });

  it('restore() returns lastVisited slug', () => {
    const tracker = createProgressTracker(5);
    tracker.markVisited('ch1/s1');
    tracker.markVisited('ch1/s2');
    expect(tracker.restore()).toBe('ch1/s2');
  });

  it('restore() returns null when no sections visited', () => {
    const tracker = createProgressTracker(5);
    expect(tracker.restore()).toBeNull();
  });

  it('reset() clears localStorage and zeroes progress', () => {
    const tracker = createProgressTracker(5);
    tracker.markVisited('ch1/s1');
    tracker.markVisited('ch1/s2');
    tracker.reset();
    expect(localStorage.getItem('ibbook_progress')).toBeNull();
    expect(tracker.getProgress().visitedSections).toEqual([]);
    expect(tracker.getProgress().lastVisited).toBeNull();
    expect(tracker.getPercentage()).toBe(0);
  });

  it('percentage rounds to 1 decimal place', () => {
    const tracker = createProgressTracker(3);
    tracker.markVisited('s1');
    // 1/3 * 100 = 33.333... → 33.3
    expect(tracker.getPercentage()).toBe(33.3);
  });

  it('percentage is clamped to 100 even if more sections visited than total', () => {
    const tracker = createProgressTracker(2);
    tracker.markVisited('s1');
    tracker.markVisited('s2');
    tracker.markVisited('s3'); // beyond total
    expect(tracker.getPercentage()).toBe(100);
  });

  it('degraded mode: works without localStorage (silently)', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      get() { throw new Error('SecurityError'); },
      configurable: true,
    });

    const tracker = createProgressTracker(5);
    expect(() => tracker.markVisited('s1')).not.toThrow();
    expect(() => tracker.getProgress()).not.toThrow();
    expect(() => tracker.getPercentage()).not.toThrow();
    expect(() => tracker.reset()).not.toThrow();
    expect(() => tracker.restore()).not.toThrow();

    if (original) Object.defineProperty(window, 'localStorage', original);
  });
});
