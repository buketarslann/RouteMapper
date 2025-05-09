import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add a polyfill for Fetch API if needed for older browsers
if (!window.fetch) {
  console.warn('Fetch API not available, some functionality may not work correctly');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);