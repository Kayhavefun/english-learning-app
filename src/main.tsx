import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// 注册 Service Worker，使应用可离线打开、并支持“添加到主屏幕”
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* 注册失败不影响正常使用 */
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
