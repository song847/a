import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css'

const originalFetch = window.fetch;
window.fetch = async (resource, config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config = config || {};
    const headers = new Headers(config.headers || {});
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }
  return originalFetch(resource, config);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
