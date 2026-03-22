const STORAGE_KEY = 'ibbook_progress';

// --- Safe localStorage helpers (degraded mode for private browsing) ---

function safeLocalStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalStorageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // silently ignore (private browsing / storage quota exceeded)
  }
}

function safeLocalStorageRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // silently ignore
  }
}

// --- Data model ---

export interface ReadingProgress {
  visitedSections: string[];
  lastVisited: string | null;
  totalSections: number;
}

export interface ProgressTracker {
  markVisited(slug: string): void;
  getProgress(): ReadingProgress;
  getPercentage(): number;
  reset(): void;
  restore(): string | null;
}

// --- Internal helpers ---

function loadProgress(totalSections: number): ReadingProgress {
  const raw = safeLocalStorageGet(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<ReadingProgress>;
      return {
        visitedSections: Array.isArray(parsed.visitedSections) ? parsed.visitedSections : [],
        lastVisited: typeof parsed.lastVisited === 'string' ? parsed.lastVisited : null,
        totalSections,
      };
    } catch {
      // corrupted data — start fresh
    }
  }
  return { visitedSections: [], lastVisited: null, totalSections };
}

function saveProgress(progress: ReadingProgress): void {
  safeLocalStorageSet(STORAGE_KEY, JSON.stringify(progress));
}

// --- Factory ---

export function createProgressTracker(totalSections: number): ProgressTracker {
  return {
    markVisited(slug: string): void {
      const progress = loadProgress(totalSections);
      // Deduplicate: only add if not already present
      if (!progress.visitedSections.includes(slug)) {
        progress.visitedSections.push(slug);
      }
      progress.lastVisited = slug;
      progress.totalSections = totalSections;
      saveProgress(progress);
    },

    getProgress(): ReadingProgress {
      return loadProgress(totalSections);
    },

    getPercentage(): number {
      const progress = loadProgress(totalSections);
      if (totalSections <= 0) return 0;
      const raw = (progress.visitedSections.length / totalSections) * 100;
      // Clamp to [0, 100] and round to 1 decimal
      const clamped = Math.min(100, Math.max(0, raw));
      return Math.round(clamped * 10) / 10;
    },

    reset(): void {
      safeLocalStorageRemove(STORAGE_KEY);
    },

    restore(): string | null {
      return loadProgress(totalSections).lastVisited;
    },
  };
}
