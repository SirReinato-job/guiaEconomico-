import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/base/theme.js';
import GlobalStyle from './styles/base/GlobalStyle.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle  />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
