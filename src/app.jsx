import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // 1. Importamos BrowserRouter
import Layout from './components/layout/layout';
import Hero from './components/hero/hero';
import Catalogo from './components/catalogo/catalogo';
import About from './components/about/about';
import Contacto from './components/contacto/contacto';

function App() {
  return (
    // 2. Envolvemos todo en BrowserRouter y le pasamos el BASE_URL de Vite
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;