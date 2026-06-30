import { createTheme } from '@mui/material/styles';
import { darkPalette, lightPalette } from './styles/palette';

const baseTheme = {
  typography: {
    fontFamily: "'Roboto Condensed', sans-serif",
    body1: {
      fontFamily: "'Roboto Condensed', sans-serif",
      fontWeight: 400,
    },
  },
};

export const darkTheme = createTheme({
  ...baseTheme,
  palette: { mode: 'dark' },
});

export const lightTheme = createTheme({
  ...baseTheme,
  palette: { mode: 'light' },
});

darkTheme.custom = darkPalette;
lightTheme.custom = lightPalette;

export function getThemeByMode(mode) {
  return mode === 'light' ? lightTheme : darkTheme;
}
