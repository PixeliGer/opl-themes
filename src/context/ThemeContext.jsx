/**
 * Theme and background context.
 *
 * Manages two pieces of persistent UI state:
 * - `mode` — dark/light theme, synced with localStorage + system preference
 * - `background` — active background key, synced with localStorage
 *
 * Wraps the app so any consumer can read the current theme palette,
 * toggle themes, or cycle through available backgrounds.
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getPalette } from '../styles/palette';
import { BACKGROUND_OPTIONS, getNextBackground } from '../config/backgrounds';

const ThemeContext = createContext(null);

/**
 * Reads the persisted theme mode from localStorage.
 * Returns `null` when no valid preference has been saved yet.
 * @returns {'dark' | 'light' | null}
 */
function getStoredMode() {
  const stored = localStorage.getItem('theme-mode');
  return stored === 'dark' || stored === 'light' ? stored : null;
}

/**
 * Reads the persisted background key from localStorage.
 * Falls back to a random entry from the registry when no
 * preference has been saved yet (first visit or cleared data).
 * @returns {string}
 */
function getStoredBackground() {
  const stored = localStorage.getItem('background-style');
  return BACKGROUND_OPTIONS.includes(stored)
    ? stored
    : BACKGROUND_OPTIONS[Math.floor(Math.random() * BACKGROUND_OPTIONS.length)];
}

/**
 * Provides theme mode, background selection, and the matching
 * palette to the entire component tree.
 *
 * Context value: `{ mode, toggleTheme, background, toggleBackground, palette }`
 */
export function ThemeProvider({ children }) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(
    () => getStoredMode() || (prefersDark ? 'dark' : 'light'),
  );
  const [background, setBackground] = useState(getStoredBackground);

  /* Sync mode when the system preference changes (only if user
     hasn't explicitly picked a mode yet). */
  useEffect(() => {
    const stored = getStoredMode();
    if (!stored) {
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, [prefersDark]);

  /* Persist mode and reflect it as a class on <html>. */
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
    document.documentElement.className =
      mode === 'dark' ? 'dark-theme' : 'light-theme';
  }, [mode]);

  /* Persist background choice. */
  useEffect(() => {
    localStorage.setItem('background-style', background);
  }, [background]);

  /** Toggles between dark and light mode. */
  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  /** Cycles to the next background in the registry. */
  const toggleBackground = useCallback(() => {
    setBackground((prev) => getNextBackground(prev));
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        toggleTheme,
        background,
        toggleBackground,
        palette: getPalette(mode),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to consume the theme context.
 * Must be called inside a `<ThemeProvider>`.
 * @returns {{ mode: string, toggleTheme: () => void, background: string, toggleBackground: () => void, palette: object }}
 */
export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeProvider');
  return ctx;
}
