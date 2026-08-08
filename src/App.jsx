import React from 'react';
import { Routes, Route } from 'react-router-dom'; // <-- Asegúrate de que NO tenga BrowserRouter aquí
import Layout from './components/layout/layout';
import Hero from './components/hero/hero';
import Catalogo from './components/catalogo/catalogo';
import About from './components/about/about';
import Contacto from './components/contacto/contacto';
import DashboardCocinero from './components/pages/DashboardCocinero';
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/nosotros" element={<About />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/dashboard-cocinero" element={<DashboardCocinero />} />
      </Routes>
    </Layout>
  );
}

export default App;