import React from 'react';
import './Hero.css';

const Hero = () => {
  const handleScroll = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="inicio">
      {/* Decorative blobs */}
      <div className="hero__blob hero__blob--1" />
      <div className="hero__blob hero__blob--2" />
      <div className="hero__blob hero__blob--3" />

      <div className="hero__container">
        <div className="hero__content">
          <span className="hero__badge">🎀 Postres artesanales hechos con amor</span>
          <h1 className="hero__title">
            El sabor que
            <br />
            <em>endulza</em> tu día
          </h1>
          <p className="hero__subtitle">
            Tortas, macarons, brownies y más — preparados a mano con
            ingredientes de la mejor calidad para cada ocasión especial.
          </p>
          <div className="hero__actions">
            <button className="hero__btn hero__btn--primary" onClick={() => handleScroll('#catalogo')}>
              Ver Catálogo ✨
            </button>
            <button className="hero__btn hero__btn--secondary" onClick={() => handleScroll('#contacto')}>
              Hacer Pedido
            </button>
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
            <div className="hero__cake-emoji">🎂</div>
            <p className="hero__cake-label">Torta Personalizada</p>
            <p className="hero__cake-sub">Desde $35.000</p>
          </div>
          <div className="hero__float hero__float--1">🧁</div>
          <div className="hero__float hero__float--2">🍓</div>
          <div className="hero__float hero__float--3">🌸</div>
          <div className="hero__float hero__float--4">🍫</div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll" onClick={() => handleScroll('#catalogo')}>
        <span className="hero__scroll-dot" />
      </div>
    </section>
  );
};

export default Hero;
