import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';
import logo from '../../assets/logo.ico';
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <img src={logo} alt="Logo Ferchy" className="footer__logo-icon" />
              <span className="footer__logo-text">Ferchy<em>'</em>s Postres</span>
            </div>
            <p className="footer__tagline">
              Endulzando momentos especiales desde 2021. Cada postre,
              una promesa de calidad y amor artesanal.
            </p>
            <div className="footer__social">
              <a href="https://www.instagram.com/ferchyspostres?igsh=bTNudmp4dzdxZWo4" className="footer__social-btn" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://www.facebook.com/share/1RgeqKbXVP/" className="footer__social-btn" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://tiktok.com" className="footer__social-btn" aria-label="TikTok"><FaTiktok /></a>
              <a href="https://wa.me/573024798502" className="footer__social-btn" aria-label="WhatsApp"><FaWhatsapp /></a>
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
              <li><Link to="/catalogo">Cheesecakes</Link></li>
              <li><Link to="/catalogo">Alfajores</Link></li>
              <li><Link to="/catalogo">Profiteroles</Link></li>
              <li><Link to="/catalogo">Cajas Surtidas</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Contacto</h4>
            <ul className="footer__links footer__links--info">
              <li>Bogotá, Colombia</li>
              <li>+57 302 479 8502</li>
              <li>ferchyspostres@gmail.com</li>
              <li>Lun–Vi: 8am – 7pm</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {year} Ferchy's Postres. Todos los derechos reservados.</p>
          <p className="footer__made">Hecho con amor en Colombia</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
