// ============================================
// MAIN ENTRY POINT
// Sets up React with Router and providers
// ============================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Create root element
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Router for navigation */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);