/**
 * Bug Condition Exploration Tests
 *
 * These tests MUST FAIL on unfixed code — failure confirms the bugs exist.
 * DO NOT fix the code when these tests fail.
 *
 * Validates: Requirements 1.1, 1.2, 1.3
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';

// ── Bug 1: Astro version ──────────────────────────────────────────────────────

describe('Bug 1 — Astro version in package.json', () => {
  it('should declare astro ^6.0.0 or higher (FAILS on unfixed code — currently ^4.0.0)', () => {
    const pkgPath = resolve(process.cwd(), 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const astroVersion: string = pkg.dependencies?.astro ?? '';

    // This assertion FAILS on unfixed code because astroVersion is "^4.0.0"
    expect(astroVersion).toMatch(/^\^6\./);
  });
});

// ── Bug 2: NavigationMenu home link ──────────────────────────────────────────

describe('Bug 2 — NavigationMenu missing home link', () => {
  it('should contain an <a> pointing to home in the component source (FAILS on unfixed code — home link absent)', () => {
    const componentPath = resolve(
      process.cwd(),
      'src/components/NavigationMenu.astro'
    );
    const source = readFileSync(componentPath, 'utf-8');

    // Home link uses BASE_URL — check for the nav-home class or BASE_URL home href pattern
    const hasHomeLink =
      /nav-home/.test(source) ||
      /href=\{[^}]*BASE_URL[^}]*\}/.test(source) ||
      /href=["']\/["']/.test(source);

    // This assertion FAILS on unfixed code because there is no fixed home entry
    expect(hasHomeLink).toBe(true);
  });

  it('should render a home link as the first nav item before dynamic items (FAILS on unfixed code)', () => {
    const componentPath = resolve(
      process.cwd(),
      'src/components/NavigationMenu.astro'
    );
    const source = readFileSync(componentPath, 'utf-8');

    // The home link must appear before the items.map() call
    // Accept both href="/" and href={...BASE_URL...} patterns
    const homeIndex = Math.max(
      source.indexOf('nav-home'),
      source.indexOf('href="/"'),
      source.indexOf('BASE_URL}')
    );
    const mapIndex = source.indexOf('items.map(');

    // This assertion FAILS on unfixed code because homeIndex === -1
    expect(homeIndex).toBeGreaterThan(-1);
    expect(homeIndex).toBeLessThan(mapIndex);
  });
});

// ── Bug 3: BaseLayout header title ───────────────────────────────────────────

describe('Bug 3 — BaseLayout header missing title', () => {
  it('should contain a title element inside .site-header (FAILS on unfixed code — only ThemeToggle present)', () => {
    const layoutPath = resolve(
      process.cwd(),
      'src/layouts/BaseLayout.astro'
    );
    const source = readFileSync(layoutPath, 'utf-8');

    // Extract the site-header block
    const headerMatch = source.match(/<header class="site-header">([\s\S]*?)<\/header>/);
    expect(headerMatch).not.toBeNull();

    const headerContent = headerMatch![1];

    // This assertion FAILS on unfixed code because the header only has <ThemeToggle />
    // and no title element (span, a, h1, etc.) with visible text
    const hasTitleElement =
      /site-title/.test(headerContent) ||
      /<(span|a|h1|h2|p)[^>]*>/.test(headerContent.replace(/<ThemeToggle[^/]*\/>/g, ''));

    expect(hasTitleElement).toBe(true);
  });

  it('should have justify-content: space-between in .site-header CSS (FAILS on unfixed code — currently flex-end)', () => {
    const layoutPath = resolve(
      process.cwd(),
      'src/layouts/BaseLayout.astro'
    );
    const source = readFileSync(layoutPath, 'utf-8');

    // This assertion FAILS on unfixed code because it uses justify-content: flex-end
    expect(source).toMatch(/justify-content:\s*space-between/);
  });
});
