import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { App } from './App';

const theme = createTheme({
  palette: {
    primary: { main: '#1565c0' },
    background: { default: '#f6f8fa' },
  },
});

const root = document.getElementById('root');
if (root === null) {
  throw new Error('Missing #root element.');
}

createRoot(root).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
