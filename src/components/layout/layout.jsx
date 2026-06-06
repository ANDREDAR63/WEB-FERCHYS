import React from 'react';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import './layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Navbar />
      <main className="layout-main">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
