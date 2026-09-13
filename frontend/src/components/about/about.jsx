import React from 'react';
import './about.css';

const valores = [
  { titulo: 'Hecho con amor', texto: 'Cada postre lleva el cariño y la dedicación de quien lo prepara.' },
  { titulo: 'Ingredientes frescos', texto: 'Usamos solo ingredientes de calidad, seleccionados con cuidado.' },
  { titulo: 'Totalmente personalizable', texto: 'Tu visión, nuestra creación. Adaptamos cada pedido a tu gusto.' },
  { titulo: 'Entrega puntual', texto: 'Tu evento merece todo a tiempo. Cumplimos nuestra promesa.' },
 ]

const About = () => {
  return (
    <section className="about section-padding" id="nosotros">
      <div className="container">
        <div className="about__grid">
          {/* Visual */}
          <div className="about__visual">
            <div className="about__img-card about__img-card--main">
              <span className="about__big-emoji">👩‍🍳</span>
              <p className="about__img-label">Ferchy's en la cocina</p>
            </div>
          </div>

          {/* Content */}
          <div className="about__content">
            <h2 className="about__title">La historia detrás de cada postre</h2>
            <p className="about__text">
              Ferchy's Postres nació de una pasión: convertir ingredientes simples en momentos
              inolvidables. Lo que empezó como un hobby en casa se convirtió en un proyecto
              lleno de sabor, creatividad y amor.
            </p>
            <p className="about__text">
              Cada torta, alfajor o cheesecake que sale de nuestra cocina lleva horas de dedicación.
              Creemos que los postres son más que dulces — son recuerdos que se quedan en el corazón.
            </p>

            <div className="about__valores">
              {valores.map((v, i) => (
                <div className="about__valor" key={i}>
                  <span className="about__valor-icon">{v.icon}</span>
                  <div>
                    <strong className="about__valor-titulo">{v.titulo}</strong>
                    <p className="about__valor-texto">{v.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
