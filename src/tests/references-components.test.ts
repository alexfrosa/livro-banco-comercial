import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Task 8 — Structural component tests for Ref.astro and referencias.astro
// Validates: Requirements 2.5, 4.1, 4.2, 4.3
// ---------------------------------------------------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));
const refAstroSource = readFileSync(resolve(__dirname, '../components/Ref.astro'), 'utf-8');
const referenciasSource = readFileSync(resolve(__dirname, '../pages/referencias.astro'), 'utf-8');

// ---------------------------------------------------------------------------
// src/pages/referencias.astro — Req 4.2
// ---------------------------------------------------------------------------

describe('referencias.astro — semantic markup (Req 4.2)', () => {
  it('contains <section elements for category grouping', () => {
    expect(referenciasSource).toContain('<section');
  });

  it('contains <article elements for individual references', () => {
    expect(referenciasSource).toContain('<article');
  });
});

// ---------------------------------------------------------------------------
// src/pages/referencias.astro — external links (Req 2.5)
// ---------------------------------------------------------------------------

describe('referencias.astro — external link attributes (Req 2.5)', () => {
  it('contains target="_blank" on external links', () => {
    expect(referenciasSource).toContain('target="_blank"');
  });

  it('contains rel="noopener noreferrer" on external links', () => {
    expect(referenciasSource).toContain('rel="noopener noreferrer"');
  });
});

// ---------------------------------------------------------------------------
// src/pages/referencias.astro — aria-label for external links (Req 4.3)
// ---------------------------------------------------------------------------

describe('referencias.astro — aria-label with (abre em nova aba) pattern (Req 4.3)', () => {
  it('contains aria-label with "(abre em nova aba)" pattern', () => {
    expect(referenciasSource).toContain('(abre em nova aba)');
  });
});

// ---------------------------------------------------------------------------
// src/pages/referencias.astro — reference anchors (Req 2.4)
// ---------------------------------------------------------------------------

describe('referencias.astro — reference anchor id pattern (Req 2.4)', () => {
  it('contains id={`ref-${...} pattern for reference anchors', () => {
    expect(referenciasSource).toContain('id={`ref-${');
  });
});

// ---------------------------------------------------------------------------
// src/components/Ref.astro — accessibility (Req 4.1)
// ---------------------------------------------------------------------------

describe('Ref.astro — aria-label attribute (Req 4.1)', () => {
  it('contains aria-label attribute', () => {
    expect(refAstroSource).toContain('aria-label');
  });

  it('contains "Ver referência:" in the aria-label pattern', () => {
    expect(refAstroSource).toContain('Ver referência:');
  });
});

// ---------------------------------------------------------------------------
// src/components/Ref.astro — visual style (Req 3.5)
// ---------------------------------------------------------------------------

describe('Ref.astro — ref-link class (Req 3.5)', () => {
  it('contains class="ref-link"', () => {
    expect(refAstroSource).toContain('class="ref-link"');
  });
});
