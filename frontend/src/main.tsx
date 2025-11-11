import React from 'react';
import ReactDOM from 'react-dom/client';

// @ts-ignore - виртуальный модуль, создается плагином PWA
import { registerSW } from 'virtual:pwa-register';

import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Регистрация Service Worker
if ("serviceWorker" in navigator) {
  registerSW();
}