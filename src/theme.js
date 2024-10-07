import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    body: {
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 400,
    },
  },
});

export default darkTheme;
