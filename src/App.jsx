import { lazy, Suspense } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

import Home from './Pages/Home';
import ErrorBoundary from './Components/ErrorBoundary';
import darkTheme from './theme';

const FiguresBackground = lazy(() => import('./Components/FiguresBackground'));

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div className='App'>
          <Suspense fallback={null}>
            <FiguresBackground />
          </Suspense>
          <Home />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
