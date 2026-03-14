import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: "'Roboto Condensed', sans-serif",
    body: {
      fontFamily: "'Roboto Condensed', sans-serif",
      fontWeight: 400,
    },
  },
});

export default darkTheme;
