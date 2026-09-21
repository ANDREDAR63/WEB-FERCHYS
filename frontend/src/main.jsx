import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'

const rutaGuardada = new URLSearchParams(window.location.search).get('p');

if (rutaGuardada) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');

  window.history.replaceState(
    null,
    '',
    `${base}${rutaGuardada}${window.location.hash}`
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)