import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <span>🧁</span>
              <span className="footer__logo-text">Ferchy<em>'</em>s Postres</span>
            </div>
            <p className="footer__tagline">
              Endulzando momentos especiales desde 2021. Cada postre,
              una promesa de calidad y amor artesanal.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-btn" aria-label="Instagram">📸</a>
              <a href="#" className="footer__social-btn" aria-label="Facebook">📘</a>
              <a href="#" className="footer__social-btn" aria-label="TikTok">🎵</a>
              <a href="https://wa.me/573000000000" className="footer__social-btn footer__social-btn--wa"
                target="_blank" rel="noreferrer" aria-label="WhatsApp">💬</a>
            </div>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Menú</h4>
            <ul className="footer__links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/catalogo">Catálogo</Link></li>
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Productos</h4>
            <ul className="footer__links">
              <li><Link to="/catalogo">Tortas</Link></li>
              <li><Link to="/catalogo">Cheesecakes</Link></li>
              <li><Link to="/catalogo">Brownies</Link></li>
              <li><Link to="/catalogo">Cupcakes</Link></li>
              <li><Link to="/catalogo">Cajas Surtidas</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Contacto</h4>
            <ul className="footer__links footer__links--info">
              <li>📍 Bogotá, Colombia</li>
              <li>💬 +57 302 543 0000</li>
              <li>📧 hola@ferchys.co</li>
              <li>🕐 Lun–Sáb: 8am – 7pm</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {year} Ferchy's Postres. Todos los derechos reservados.</p>
          <p className="footer__made">Hecho con 💕 en Colombia</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
