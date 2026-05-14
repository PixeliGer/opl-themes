import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import '@fontsource-variable/roboto-condensed/wght.css';
import '@fontsource-variable/roboto-mono/wght.css';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
);
