import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Lo importamos aquí
import App from './App.jsx'
import './index.css' // Tus estilos globales
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Aquí configuramos el basename global para todo el proyecto */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider><App /></AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)