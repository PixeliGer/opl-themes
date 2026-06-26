import { lazy, Suspense } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

import Home from './Pages/Home';
import ErrorBoundary from './Components/ErrorBoundary';
import { ThemeProvider, useThemeMode } from './context/ThemeContext';
import { getThemeByMode } from './theme';

const ParticleWaveBackground = lazy(() => import('./Components/ParticleWaveBackground'));

function ThemedApp() {
  const { mode, background } = useThemeMode();
  const theme = getThemeByMode(mode);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div className='App'>
        <Suspense fallback={null}>
          <ParticleWaveBackground />
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
