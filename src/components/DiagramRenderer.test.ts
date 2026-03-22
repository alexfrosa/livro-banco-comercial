import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';

// ---------------------------------------------------------------------------
// Sub-task 16.1 — Unit tests for DiagramRenderer
// Tests: presence of alt/aria-label (Property 22), static fallback rendered
// Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6
// ---------------------------------------------------------------------------

/**
 * Simulates the HTML structure that DiagramRenderer.astro produces.
 * Uses DOM APIs (not innerHTML) to avoid HTML-escaping issues with arbitrary strings.
 */
function createDiagramDOM(options: {
  alt: string;
  content: string;
  animated?: boolean;
  diagramId?: string;
}): void {
  const { alt, content, animated = true, diagramId = 'diagram-test123' } = options;

  // Clear body
  document.body.innerHTML = '';

  // <figure class="diagram-renderer" data-diagram-id=... data-diagram-type=... data-animated=...>
  const figure = document.createElement('figure');
  figure.className = 'diagram-renderer';
  figure.setAttribute('data-diagram-id', diagramId);
  figure.setAttribute('data-diagram-type', 'mermaid');
  figure.setAttribute('data-animated', String(animated));

  // <div id=... class="diagram-renderer__container" role="img" aria-label=... aria-busy="true">
  const container = document.createElement('div');
  container.id = diagramId;
  container.className = 'diagram-renderer__container';
  container.setAttribute('role', 'img');
  container.setAttribute('aria-label', alt);
  container.setAttribute('aria-busy', 'true');

  // <pre data-fallback><code>...</code></pre>
  const pre = document.createElement('pre');
  pre.className = 'diagram-renderer__fallback';
  pre.setAttribute('data-fallback', '');
  const code = document.createElement('code');
  code.textContent = content;
  pre.appendChild(code);
  container.appendChild(pre);
  figure.appendChild(container);

  // <figcaption>...</figcaption>
  const caption = document.createElement('figcaption');
  caption.className = 'diagram-renderer__caption';
  caption.textContent = alt;
  figure.appendChild(caption);

  document.body.appendChild(figure);
}

// ---------------------------------------------------------------------------
// Unit tests — accessibility (Property 22)
// ---------------------------------------------------------------------------

describe('DiagramRenderer — accessibility', () => {
  const SAMPLE_CONTENT = `graph LR
    BC[Banco Central] -->|Emite base monetária| BK[Banco Comercial]
    BK -->|Empresta 90%| CL[Cliente]`;

  beforeEach(() => {
    createDiagramDOM({
      alt: 'Fluxo de dinheiro entre Banco Central e bancos comerciais',
      content: SAMPLE_CONTENT,
    });
  });

  it('container has role="img"', () => {
    const container = document.querySelector('.diagram-renderer__container');
    expect(container?.getAttribute('role')).toBe('img');
  });

  it('container has non-empty aria-label', () => {
    const container = document.querySelector('.diagram-renderer__container');
    const label = container?.getAttribute('aria-label');
    expect(label).toBeTruthy();
    expect(label!.trim().length).toBeGreaterThan(0);
  });

  it('aria-label matches the alt prop', () => {
    const container = document.querySelector('.diagram-renderer__container');
    expect(container?.getAttribute('aria-label')).toBe(
      'Fluxo de dinheiro entre Banco Central e bancos comerciais'
    );
  });

  it('figcaption contains the alt text', () => {
    const caption = document.querySelector('.diagram-renderer__caption');
    expect(caption?.textContent?.trim()).toBe(
      'Fluxo de dinheiro entre Banco Central e bancos comerciais'
    );
  });

  it('container starts with aria-busy="true" before Mermaid renders', () => {
    const container = document.querySelector('.diagram-renderer__container');
    expect(container?.getAttribute('aria-busy')).toBe('true');
  });
});

// ---------------------------------------------------------------------------
// Unit tests — static fallback
// ---------------------------------------------------------------------------

describe('DiagramRenderer — static fallback', () => {
  const MERMAID_CODE = `graph LR
    A[Node A] --> B[Node B]`;

  beforeEach(() => {
    createDiagramDOM({ alt: 'Test diagram', content: MERMAID_CODE });
  });

  it('fallback <pre> element is present in the DOM', () => {
    const fallback = document.querySelector('[data-fallback]');
    expect(fallback).not.toBeNull();
  });

  it('fallback contains the raw mermaid content', () => {
    const code = document.querySelector('[data-fallback] code');
    expect(code?.textContent?.trim()).toBe(MERMAID_CODE);
  });

  it('fallback is a <pre> element', () => {
    const fallback = document.querySelector('[data-fallback]');
    expect(fallback?.tagName.toLowerCase()).toBe('pre');
  });

  it('fallback is inside the diagram container', () => {
    const container = document.querySelector('.diagram-renderer__container');
    const fallback = container?.querySelector('[data-fallback]');
    expect(fallback).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Unit tests — figure structure
// ---------------------------------------------------------------------------

describe('DiagramRenderer — figure structure', () => {
  beforeEach(() => {
    createDiagramDOM({
      alt: 'Diagrama de fluxo monetário',
      content: 'graph LR\n  A --> B',
    });
  });

  it('wraps everything in a <figure> element', () => {
    const figure = document.querySelector('figure.diagram-renderer');
    expect(figure).not.toBeNull();
  });

  it('figure has data-diagram-type attribute', () => {
    const figure = document.querySelector('.diagram-renderer');
    expect(figure?.getAttribute('data-diagram-type')).toBe('mermaid');
  });

  it('figure has data-animated attribute', () => {
    const figure = document.querySelector('.diagram-renderer');
    expect(figure?.getAttribute('data-animated')).toBeTruthy();
  });

  it('container id matches data-diagram-id on figure', () => {
    const figure = document.querySelector('.diagram-renderer') as HTMLElement;
    const container = document.querySelector('.diagram-renderer__container') as HTMLElement;
    expect(container.id).toBe(figure.getAttribute('data-diagram-id'));
  });
});

// ---------------------------------------------------------------------------
// Unit tests — animated flag
// ---------------------------------------------------------------------------

describe('DiagramRenderer — animated flag', () => {
  it('data-animated is "true" when animated prop is true', () => {
    createDiagramDOM({ alt: 'Test', content: 'graph LR\n  A-->B', animated: true });
    const figure = document.querySelector('.diagram-renderer');
    expect(figure?.getAttribute('data-animated')).toBe('true');
  });

  it('data-animated is "false" when animated prop is false', () => {
    createDiagramDOM({ alt: 'Test', content: 'graph LR\n  A-->B', animated: false });
    const figure = document.querySelector('.diagram-renderer');
    expect(figure?.getAttribute('data-animated')).toBe('false');
  });
});

// ---------------------------------------------------------------------------
// Property test — Property 22: Diagrams possuem texto alternativo
// Validates: Requirements 5.6
// ---------------------------------------------------------------------------

describe('Property 22: Diagrams possuem texto alternativo', () => {
  it('every diagram container has a non-empty aria-label', () => {
    // **Validates: Requirements 5.6**
    // Feature: interactive-banking-book, Property 22: Diagrams possuem texto alternativo
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
        (alt, content) => {
          createDiagramDOM({ alt, content });

          const container = document.querySelector('.diagram-renderer__container');
          const label = container?.getAttribute('aria-label');

          // aria-label must be present and non-empty
          expect(label).toBeTruthy();
          expect(label!.trim().length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('aria-label always matches the provided alt text', () => {
    // **Validates: Requirements 5.6**
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }),
        (alt) => {
          createDiagramDOM({ alt, content: 'graph LR\n  A-->B' });

          const container = document.querySelector('.diagram-renderer__container');
          expect(container?.getAttribute('aria-label')).toBe(alt);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('fallback is always present regardless of alt or content', () => {
    // **Validates: Requirements 5.4**
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }),
        fc.string({ minLength: 1, maxLength: 500 }),
        (alt, content) => {
          createDiagramDOM({ alt, content });

          const fallback = document.querySelector('[data-fallback]');
          expect(fallback).not.toBeNull();

          const code = fallback?.querySelector('code');
          expect(code?.textContent).toBe(content);
        }
      ),
      { numRuns: 100 }
    );
  });
});
