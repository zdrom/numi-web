/**
 * Storage utility for persisting calculator state
 */

const STORAGE_KEYS = {
  CALCULATOR_CONTENT: 'numi-calculator-content',
  LAST_SAVED: 'numi-last-saved',
} as const;

export interface SavedState {
  content: string;
  timestamp: number;
}

/**
 * Save calculator content to localStorage
 */
export function saveContent(content: string): void {
  try {
    const state: SavedState = {
      content,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.CALCULATOR_CONTENT, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save content:', error);
  }
}

/**
 * Load calculator content from localStorage
 */
export function loadContent(): SavedState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CALCULATOR_CONTENT);
    if (!saved) return null;

    const state: SavedState = JSON.parse(saved);
    return state;
  } catch (error) {
    console.error('Failed to load content:', error);
    return null;
  }
}

/**
 * Clear saved calculator content
 */
export function clearSavedContent(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CALCULATOR_CONTENT);
  } catch (error) {
    console.error('Failed to clear saved content:', error);
  }
}

/**
 * Check if there is saved content available
 */
export function hasSavedContent(): boolean {
  return localStorage.getItem(STORAGE_KEYS.CALCULATOR_CONTENT) !== null;
}
