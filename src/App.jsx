import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

import Home from './Pages/Home';
import FiguresBackground from './Components/FiguresBackground';
import ErrorBoundary from './Components/ErrorBoundary';

import darkTheme from './theme';

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div className='App'>
          <FiguresBackground />
          <Home />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
