import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/layout';
import Hero from './components/hero/hero';
import Catalogo from './components/catalogo/catalogo';
import About from './components/about/about';
import Contacto from './components/contacto/contacto';
//import Login from './components/login/login'; 
//import Registration from './components/registration/registration';
//import PasswordRecovery from './components/PasswordRecovery/PasswordRecovery'; 

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/nosotros" element={<About />} />
        <Route path="/contacto" element={<Contacto />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/registration" element={<Registration />} /> */}
        {/* <Route path="/PasswordRecovery" element={<PasswordRecovery />} /> */}
        {/* <Route path="/recuperar-contraseña" element={<PasswordRecovery />} /> */}
      </Routes>
    </Layout>
  );
}

export default App;