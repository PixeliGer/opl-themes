import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css'; // Ensure this path is correct

import Home from './Pages/Home';
import FiguresBackground from './Components/FiguresBackground';

import darkTheme from './theme';

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className='App'>
        <FiguresBackground />
        <Home />
      </div>
    </ThemeProvider>
  );
};

export default App;
