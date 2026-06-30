import { Suspense } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

import Home from './Pages/Home';
import ErrorBoundary from './Components/ErrorBoundary';
import { ThemeProvider, useThemeMode } from './context/ThemeContext';
import { getThemeByMode } from './theme';
import { BACKGROUND_REGISTRY } from './config/backgrounds';

function ThemedApp() {
  const { mode, background } = useThemeMode();
  const theme = getThemeByMode(mode);
  const BackgroundComponent = BACKGROUND_REGISTRY[background]?.component ?? null;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div className='App'>
        <Suspense fallback={null}>
          {BackgroundComponent && (
            <div className='background-container' key={background}>
              <BackgroundComponent />
            </div>
          )}
        </Suspense>
        <Home />
      </div>
    </MuiThemeProvider>
  );
}

const App = () => {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
};

export default App;
