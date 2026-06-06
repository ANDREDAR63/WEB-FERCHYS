import React, { useState } from 'react';
import './Catalogo.css';

const productos = [
  {
    id: 1, categoria: 'tortas',
    emoji: '🎂', nombre: 'Torta de Cumpleaños',
    descripcion: 'Bizcocho húmedo con relleno de crema de vainilla y frutos rojos. Personalizable.',
    precio: '$45.000', badge: '⭐ Favorita',
  },
  {
    id: 2, categoria: 'tortas',
    emoji: '🍫', nombre: 'Torta de Chocolate',
    descripcion: 'Tres capas de bizcocho de chocolate belga con ganache y almendras tostadas.',
    precio: '$50.000', badge: '',
  },
  {
    id: 3, categoria: 'tortas',
    emoji: '🍓', nombre: 'Torta de Fresas',
    descripcion: 'Base esponjosa con crema chantilly y fresas frescas. Ligera y deliciosa.',
    precio: '$42.000', badge: '',
  },
  {
    id: 4, categoria: 'macarons',
    emoji: '🫧', nombre: 'Macarons Clásicos',
    descripcion: 'Caja de 12 unidades. Sabores: vainilla, frambuesa, limón, café y chocolate.',
    precio: '$28.000', badge: '🎀 Especial',
  },
  {
    id: 5, categoria: 'macarons',
    emoji: '🌸', nombre: 'Macarons de Rosa',
    descripcion: 'Macarons perfumados con agua de rosas y rellenos de ganache de fresa.',
    precio: '$30.000', badge: '',
  },
  {
    id: 6, categoria: 'brownies',
    emoji: '🍫', nombre: 'Brownies Clásicos',
    descripcion: 'Caja de 9. Bordes crujientes, centro húmedo. Con chips de chocolate extra.',
    precio: '$22.000', badge: '🔥 Popular',
  },
  {
    id: 7, categoria: 'brownies',
    emoji: '🥜', nombre: 'Brownies Nutella',
    descripcion: 'Irresistibles brownies marmoleados con Nutella y avellanas tostadas.',
    precio: '$25.000', badge: '',
  },
  {
    id: 8, categoria: 'cupcakes',
    emoji: '🧁', nombre: 'Cupcakes Decorados',
    descripcion: 'Caja de 6. Bizcocho esponjoso con buttercream artesanal. Personalizables.',
    precio: '$20.000', badge: '✨ Nuevo',
  },
  {
    id: 9, categoria: 'cupcakes',
    emoji: '🍋', nombre: 'Cupcakes de Limón',
    descripcion: 'Refrescante bizcocho de limón con frosting de queso crema y ralladura.',
    precio: '$20.000', badge: '',
  },
];

const categorias = [
  { id: 'todos', label: 'Todos' },
  { id: 'tortas', label: '🎂 Tortas' },
  { id: 'macarons', label: '🫧 Macarons' },
  { id: 'brownies', label: '🍫 Brownies' },
  { id: 'cupcakes', label: '🧁 Cupcakes' },
];

const Catalogo = () => {
  const [activo, setActivo] = useState('todos');

  const filtrados = activo === 'todos'
    ? productos
    : productos.filter(p => p.categoria === activo);

  return (
    <section className="catalogo section-padding" id="catalogo">
      <div className="container">
        <h2>Nuestros Postres</h2>
        <p className="catalogo__intro">
          Cada postre es preparado con ingredientes frescos y mucho amor.
          Haz tu pedido personalizado con anticipación.
        </p>

        {/* Filtros */}
        <div className="catalogo__filtros">
          {categorias.map(cat => (
            <button
              key={cat.id}
              className={`catalogo__filtro ${activo === cat.id ? 'catalogo__filtro--activo' : ''}`}
              onClick={() => setActivo(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid de productos */}
        <div className="catalogo__grid">
          {filtrados.map(producto => (
            <article key={producto.id} className="card-producto">
              {producto.badge && (
                <span className="card-producto__badge">{producto.badge}</span>
              )}
              <div className="card-producto__imagen">
                <span className="card-producto__emoji">{producto.emoji}</span>
              </div>
              <div className="card-cuerpo">
                <h3 className="card-producto__nombre">{producto.nombre}</h3>
                <p className="card-producto__desc">{producto.descripcion}</p>
                <div className="card-producto__footer">
                  <span className="card-precio">{producto.precio}</span>
                  <a
                    className="card-producto__btn"
                    href={`https://wa.me/573000000000?text=Hola! Me interesa pedir: ${producto.nombre}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Pedir 💬
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Catalogo;
