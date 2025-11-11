import React from 'react';
import ReactDOM from 'react-dom/client';

// @ts-ignore - виртуальный модуль, создается плагином PWA
//import { registerSW } from 'virtual:pwa-register';

import App from './App';


console.log('Application starting...');
console.log('Tauri available:', !!(window as any).__TAURI__);
console.log('Current URL:', window.location.href);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

// Регистрация Service Worker
/*if ("serviceWorker" in navigator) {
  registerSW();
}*/