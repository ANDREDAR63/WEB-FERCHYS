import React from 'react';
import { NavLink } from 'react-router-dom';
import './hero.css';

const imagenes = import.meta.glob('../../assets/*', { eager: true });

const obtenerImagen = (nombreArchivo) => {
  const ruta = Object.keys(imagenes).find(key => key.includes(nombreArchivo));
  return ruta ? imagenes[ruta].default : '';
};

const Hero = () => {
  return (
    <section className="hero" id="inicio">
      {/* Decorative blobs */}
      <div className="hero__blob hero__blob--1" />
      <div className="hero__blob hero__blob--2" />
      <div className="hero__blob hero__blob--3" />

      <div className="hero__container">
        <div className="hero__content">
          <span className="hero__badge">"Sabores que nacen del corazón"</span>
          <h1 className="hero__title">
            El sabor que
            <br />
            <em>endulza</em> tu día
          </h1>
          <p className="hero__subtitle">
            Cheesecakes, alfajores, profiteroles y más — preparados artesanalmente, con
            ingredientes de la mejor calidad para cada ocasión especial.
          </p>

          <div className="hero__actions">
            {/* Botón Ver Catálogo conectado con NavLink y clases BEM intactas */}
            <NavLink to="/catalogo" className="hero__btn hero__btn--primary">
              Ver Catálogo ✨
            </NavLink>

            {/* Botón Hacer Pedido ahora también como NavLink hacia la ruta de contacto */}
            <NavLink to="/contacto" className="hero__btn hero__btn--secondary">
              Hacer Pedido
            </NavLink>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-num">200+</span>
              <span className="hero__stat-label">Clientes felices</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-num">50+</span>
              <span className="hero__stat-label">Recetas únicas</span>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <span className="hero__stat-num">5★</span>
              <span className="hero__stat-label">Valoración</span>
            </div>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__cake-ring" />
          <div className="hero__cake-card">
            <img 
              src={obtenerImagen('cheesecakes-grandes')} 
              alt="img_cheesecakes_refractaria " 
              className="hero__cake-imagen"
            />
            <p className="hero__cake-label">Cheesecake familiar en refractaria</p>
            <p className="hero__cake-sub">Desde $40.000</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator original sin funciones externas que rompan el renderizado */}
      <div className="hero__scroll">
        <span className="hero__scroll-dot" />
      </div>
    </section>
  );
};

export default Hero;

