import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getPalette } from '../styles/palette';

const ThemeContext = createContext(null);

function getStoredMode() {
  const stored = localStorage.getItem('theme-mode');
  return stored === 'dark' || stored === 'light' ? stored : null;
}

const BACKGROUND_OPTIONS = ['figures', 'particleWave'];

function getStoredBackground() {
  const stored = localStorage.getItem('background-style');
  return BACKGROUND_OPTIONS.includes(stored) ? stored : 'figures';
}

export function ThemeProvider({ children }) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(() => getStoredMode() || (prefersDark ? 'dark' : 'light'));
  const [background, setBackground] = useState(getStoredBackground);

  useEffect(() => {
    const stored = getStoredMode();
    if (!stored) {
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, [prefersDark]);

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
    document.documentElement.className = mode === 'dark' ? 'dark-theme' : 'light-theme';
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('background-style', background);
  }, [background]);

  const toggleTheme = useCallback(() => {
    setMode(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const toggleBackground = useCallback(() => {
    setBackground(prev => prev === 'figures' ? 'particleWave' : 'figures');
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, background, toggleBackground, palette: getPalette(mode) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeProvider');
  return ctx;
}
