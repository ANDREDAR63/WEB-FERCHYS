import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import { useAuth } from '../../context/auth';
import { itemQuantity, readGuestCart } from '../../services/guestCart';
import './navbar.css';
import logo from '../../assets/logo.ico';

export default function NavbarClient() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => readGuestCart());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    const syncCart = () => {
      if (!localStorage.getItem('ferchys-token')) {
        setCartItems(readGuestCart());
        return;
      }
      apiRequest('/cart').then((cart) => setCartItems(cart.items || [])).catch(() => setCartItems([]));
    };

    window.addEventListener('scroll', handleScroll);
    syncCart();
    window.addEventListener('ferchys-carrito-cambiado', syncCart);
    window.addEventListener('storage', syncCart);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('ferchys-carrito-cambiado', syncCart);
      window.removeEventListener('storage', syncCart);
    };
  }, []);

  const totalProductos = cartItems.reduce((total, item) => total + itemQuantity(item), 0);

  const manejarCierreSesion = async () => {
    setMenuOpen(false);
    setCartOpen(false);
    await logout();
    navigate('/');
  };

  const cerrarMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <NavLink to="/catalogo" className="navbar__logo" onClick={cerrarMenu}>
          <img src={logo} alt="Logo Ferchy" className="navbar__logo-icon" />
          <span className="navbar__logo-text">Ferchy<span>'</span>s Postres</span>
        </NavLink>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <li><NavLink to="/catalogo" className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`} onClick={cerrarMenu}>Catálogo</NavLink></li>
          <li><NavLink to="/dashboard/cliente" end className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`} onClick={cerrarMenu}>Mis compras</NavLink></li>
          <li className="navbar__cart-wrapper">
            <button type="button" className="navbar__cart" onClick={() => {
              setMenuOpen(false);
              const isMobile = window.innerWidth <= 768;
              if (isMobile) {
                setCartOpen(false);
                navigate('/carrito');
                return;
              }
              setCartOpen((prev) => !prev);
            }} aria-label="Carrito de compras">
              Carrito 🛒 {totalProductos > 0 && <span>({totalProductos})</span>}
            </button>
            {cartOpen && (
              <div className="navbar__cart-panel">
                <div className="navbar__cart-panel-header"><strong>Tu carrito</strong></div>
                {cartItems.length === 0 ? <p className="navbar__cart-empty">Aún no tienes productos agregados.</p> : (
                  <div className="navbar__cart-items">
                    {cartItems.map((item) => <div key={item.id} className="navbar__cart-item"><span>{item.product?.name || item.nombre || 'Producto'}</span><strong>x{itemQuantity(item)}</strong></div>)}
                    <div className="navbar__cart-summary"><span>{totalProductos} productos</span></div>
                  </div>
                )}
                <div className="navbar__cart-actions"><NavLink to="/carrito" className="navbar__cart-link" onClick={() => setCartOpen(false)}>Ir al carrito de compras</NavLink></div>
              </div>
            )}
          </li>
          <li><button type="button" className="navbar__logout" onClick={manejarCierreSesion}>Cerrar sesión</button></li>
        </ul>

        <button type="button" className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`} onClick={() => setMenuOpen((prev) => !prev)} aria-label="Abrir menú">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
