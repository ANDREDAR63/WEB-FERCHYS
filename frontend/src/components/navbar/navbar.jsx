import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './navbar.css';
import logo from '../../assets/logo.ico';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === 'undefined') return [];
    const guardado = localStorage.getItem('ferchys-carrito');
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);

    const syncCart = () => {
      const guardado = localStorage.getItem('ferchys-carrito');
      setCartItems(guardado ? JSON.parse(guardado) : []);
    };

    syncCart();
    window.addEventListener('ferchys-carrito-cambiado', syncCart);
    window.addEventListener('storage', syncCart);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('ferchys-carrito-cambiado', syncCart);
      window.removeEventListener('storage', syncCart);
    };
  }, []);

  const navLinks = [
    { to: '/',          label: 'Inicio' },
    { to: '/catalogo',  label: 'Catálogo' },
    { to: '/nosotros',  label: 'Nosotros' },
    { to: '/contacto',  label: 'Contacto' },
  ];

  const totalProductos = cartItems.reduce((total, item) => total + item.cantidad, 0);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">

        <NavLink to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Logo Ferchy" className="navbar__logo-icon" />
          <span className="navbar__logo-text">
          Ferchy<span>'</span>s Postres
          </span>
        </NavLink>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink
              to="/login"
              className="navbar__cta"
              onClick={() => setMenuOpen(false)}
            >
              Iniciar Sesión
            </NavLink>
          </li>
          <li className="navbar__cart-wrapper">
            <button
              type="button"
              className="navbar__cart"
              onClick={() => {
                setMenuOpen(false);
                setCartOpen((prev) => !prev);
              }}
              aria-label="Carrito de compras"
            >
              Carrito 🛒 {totalProductos > 0 && <span>({totalProductos})</span>}
            </button>

            {cartOpen && (
              <div className="navbar__cart-panel">
                <div className="navbar__cart-panel-header">
                  <strong>Tu carrito</strong>
                </div>
                {cartItems.length === 0 ? (
                  <p className="navbar__cart-empty">Aún no tienes productos agregados.</p>
                ) : (
                  <div className="navbar__cart-items">
                    {cartItems.map((item) => (
                      <div key={item.id} className="navbar__cart-item">
                        <span>{item.nombre}</span>
                        <strong>x{item.cantidad}</strong>
                      </div>
                    ))}
                    <div className="navbar__cart-summary">
                      <span>{totalProductos} productos</span>
                    </div>
                  </div>
                )}
                <div className="navbar__cart-actions">
                  <NavLink
                    to="/carrito"
                    className="navbar__cart-link"
                    onClick={() => setCartOpen(false)}
                  >
                    Ir al carrito de compras
                  </NavLink>
                </div>
              </div>
            )}
          </li>
        </ul>

        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
