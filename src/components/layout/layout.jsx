// src/components/Layout/Layout.jsx
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <header>
        <h1>Ferchy's Postres</h1>
      </header>
      
      <main>{children}</main>
      
      <footer>
        <p>&copy; 2026 Ferchy's Postres - Gestión integral de pedidos</p>
      </footer>
    </div>
  );
};

export default Layout;