import { describe, it, expect, beforeEach, vi } from 'vitest';
import fc from 'fast-check';
import {
  getTheme,
  setTheme,
  getResolvedTheme,
  safeLocalStorageGet,
  safeLocalStorageSet,
  THEME_SCRIPT,
  type Theme,
} from './themeManager';

// Reset localStorage and document state before each test
beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

// ---------------------------------------------------------------------------
// Sub-task 3.1 — Property test
// Feature: interactive-banking-book, Property 15: Round-trip de persistência de tema
// Validates: Requirements 6.2, 6.3
// ---------------------------------------------------------------------------

describe('Property 15: Round-trip de persistência de tema', () => {
  it('setTheme(T) → getResolvedTheme() returns T and localStorage stores T (for light/dark)', () => {
    // **Validates: Requirements 6.2, 6.3**
    fc.assert(
      fc.property(
        fc.constantFrom<Theme>('light', 'dark'),
        (theme) => {
          setTheme(theme);
          expect(getResolvedTheme()).toBe(theme);
          expect(localStorage.getItem('ibbook_theme')).toBe(theme);
        }
      )
    );
  });
});

// ---------------------------------------------------------------------------
// Sub-task 3.2 — Unit tests
// Validates: Requirements 6.1, 6.2, 6.3, 6.4
// ---------------------------------------------------------------------------

describe('getTheme', () => {
  it('returns "system" when nothing is stored', () => {
    expect(getTheme()).toBe('system');
  });

  it('returns stored theme when valid', () => {
    localStorage.setItem('ibbook_theme', 'dark');
    expect(getTheme()).toBe('dark');

    localStorage.setItem('ibbook_theme', 'light');
    expect(getTheme()).toBe('light');
  });

  it('returns "system" for unknown stored values', () => {
    localStorage.setItem('ibbook_theme', 'invalid');
    expect(getTheme()).toBe('system');
  });
});

describe('setTheme', () => {
  it('persists theme to localStorage', () => {
    setTheme('dark');
    expect(localStorage.getItem('ibbook_theme')).toBe('dark');

    setTheme('light');
    expect(localStorage.getItem('ibbook_theme')).toBe('light');
  });

  it('applies data-theme attribute to <html> immediately', () => {
    setTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    setTheme('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});

describe('getResolvedTheme', () => {
  it('returns "light" or "dark" (never "system")', () => {
    const resolved = getResolvedTheme();
    expect(['light', 'dark']).toContain(resolved);
  });

  it('resolves "system" via prefers-color-scheme dark', () => {
    // Mock matchMedia to prefer dark
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    localStorage.removeItem('ibbook_theme'); // ensure 'system' fallback
    expect(getResolvedTheme()).toBe('dark');
  });

  it('resolves "system" via prefers-color-scheme light', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false, // no dark preference
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    localStorage.removeItem('ibbook_theme');
    expect(getResolvedTheme()).toBe('light');
  });
});

describe('safeLocalStorageGet / safeLocalStorageSet (degraded mode)', () => {
  it('safeLocalStorageGet returns null when localStorage throws', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      get() { throw new Error('SecurityError'); },
      configurable: true,
    });

    expect(safeLocalStorageGet('ibbook_theme')).toBeNull();

    // Restore
    if (original) Object.defineProperty(window, 'localStorage', original);
  });

  it('safeLocalStorageSet does not throw when localStorage throws', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      get() { throw new Error('SecurityError'); },
      configurable: true,
    });

    expect(() => safeLocalStorageSet('ibbook_theme', 'dark')).not.toThrow();

    if (original) Object.defineProperty(window, 'localStorage', original);
  });
});

describe('THEME_SCRIPT (inline head script)', () => {
  it('is a non-empty string', () => {
    expect(typeof THEME_SCRIPT).toBe('string');
    expect(THEME_SCRIPT.length).toBeGreaterThan(0);
  });

  it('contains the correct localStorage key', () => {
    expect(THEME_SCRIPT).toContain('ibbook_theme');
  });

  it('contains data-theme attribute setter', () => {
    expect(THEME_SCRIPT).toContain('data-theme');
  });

  it('contains prefers-color-scheme detection', () => {
    expect(THEME_SCRIPT).toContain('prefers-color-scheme');
  });
});
