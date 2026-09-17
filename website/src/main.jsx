import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppProviders } from './app/providers.jsx';
import { App } from './app/App.jsx';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
);
