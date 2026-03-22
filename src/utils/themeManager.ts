export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'ibbook_theme';

// --- Safe localStorage helpers (degraded mode for private browsing) ---

export function safeLocalStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeLocalStorageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // silently ignore (private browsing / storage quota exceeded)
  }
}

// --- Core ThemeManager functions ---

export function getTheme(): Theme {
  const stored = safeLocalStorageGet(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

export function setTheme(theme: Theme): void {
  safeLocalStorageSet(STORAGE_KEY, theme);

  const resolved = theme === 'system' ? resolveSystemTheme() : theme;
  applyThemeToDocument(resolved);
}

export function getResolvedTheme(): 'light' | 'dark' {
  const theme = getTheme();
  if (theme === 'system') {
    return resolveSystemTheme();
  }
  return theme;
}

// --- Internal helpers ---

function resolveSystemTheme(): 'light' | 'dark' {
  try {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // matchMedia not available
  }
  return 'light';
}

function applyThemeToDocument(resolved: 'light' | 'dark'): void {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', resolved);
  }
}

// --- Inline script for <head> to prevent FOUC ---
// This string is embedded directly in BaseLayout's <head> before any render.

export const THEME_SCRIPT = `(function(){
  var key = '${STORAGE_KEY}';
  var stored;
  try { stored = localStorage.getItem(key); } catch(e) { stored = null; }
  var theme = (stored === 'light' || stored === 'dark') ? stored
    : (stored === 'system' || !stored)
      ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : 'light';
  document.documentElement.setAttribute('data-theme', theme);
})();`;
