import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        <Router>
          <Routes>
            <Route
              path='/'
              element={<Home />}
            />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
