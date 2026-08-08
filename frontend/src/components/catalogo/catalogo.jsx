import React, { useState } from 'react';
import './catalogo.css';
const imagenes = import.meta.glob('../../assets/*', { eager: true });
const obtenerImagen = (nombreArchivo) => {
  const ruta = Object.keys(imagenes).find(key => key.includes(nombreArchivo));
  return ruta ? imagenes[ruta].default : '';
};

const productos = [
    {
    id: 1, categoria: 'horneados',
    img:obtenerImagen('favicon-rosa'), nombre: 'Suspiros',
    descripcion: 'Deliciosos merengues para endulzar tu día.',
    precio: '$3.000', badge: '',
   
  },
  {
    id: 2, categoria: 'horneados',
    img:obtenerImagen('favicon-rosa'), nombre: 'Profiteroles',
    descripcion: 'Repollas rellenas de arequipe artesanal para una nota extra de sabor.',
    precio: '$5.000', badge: '',
  },
  {
    id: 3, categoria: 'horneados',
    img:obtenerImagen('favicon-rosa'), nombre: 'Alfajores',
    descripcion: 'Dulce tradicional argentino elaborado con dos delicadas galletas rellenas de arequipe y coco.',
    precio: '$5.000', badge: '',
  },
  {
    id: 4, categoria: 'cheesecakes',
    img:obtenerImagen('cheesecake_limon'), nombre: 'Cheesecake de limón',
    descripcion: 'Postre con base de galleta dulce y relleno de sabor a limón natural.',
    precio: '$7.000', badge: 'Favorita',
   
  },
  {
    id: 5, categoria: 'cheesecakes',
    img:obtenerImagen('cheesecake_maracuya'), nombre: 'Cheesecake de maracuyá',
    descripcion: 'Postre con base de galleta dulce y relleno de sabor a maracuyá natural.',
    precio: '$7.000', badge: 'Favorita',
  },
  {
    id: 6, categoria: 'cheesecakes',
    img:obtenerImagen('cheesecake_chocolate'), nombre: 'Cheesecake de chocolate',
    descripcion: 'Postre con base de galleta oreo y sabor a chocolate para los mas amantes de el dulce.',
    precio: '$7.000', badge: '',    
  },
  {
    id: 7, categoria: 'cheesecakes',
    img:obtenerImagen('cheesecake_arandano'), nombre: 'Cheesecake de arándano',
    descripcion: 'Postre con base de galleta dulce y relleno de sabor a arándano natural.',
    precio: '$7.000', badge: '',    
  },
  {
    id: 8, categoria: 'cheesecakes',
    img:obtenerImagen('cheesecake_papayuela'), nombre: 'Cheesecake de papayuela',
    descripcion: 'Postre con base de galleta dulce y relleno de sabor a papayuela natural.',
    precio: '$7.000', badge: '',    
  },
  {
    id: 9, categoria: 'cheesecakes',
    img:obtenerImagen('cheesecake_redvelvet'), nombre: 'Cheesecake de red velvet',
    descripcion: 'Postre con base de torta red velvet y sabor a vainilla para los gustos mas refinados.',
    precio: '$7.000', badge: '',    
  },
  { id: 10, categoria: 'cheesecakes',
    img:obtenerImagen('cheesecakes-grandes'), nombre: 'Refractaria familiar de cheesecake',
    descripcion: 'Tienes un evento para compartir y quieres sorprender a tus invitados? esta es la opción perfecta para ti, una refractaria que rinde 10-15 porciones para que todos puedan disfrutar de un postre diferente.',
    precio: '$40.000', badge: 'Favorita',
  },
  { id: 11, categoria: 'horneados' ,
    img:obtenerImagen('favicon-rosa'), nombre: 'Torta de arándanos',
    descripcion: 'Deliciosa torta de arándanos frescos.',
    precio: '$3.000', badge: 'Nuevo',
  }
];

const categorias = [
  { id: 'todos', label: 'Todos' },
  { id: 'cheesecakes', label: 'Cheesecakes' },
  { id: 'horneados', label: 'Horneados' },
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
                <img src={producto.img} alt={producto.nombre} className="card-producto__imagen"/>
              </div>
              <div className="card-cuerpo">
                <h3 className="card-producto__nombre">{producto.nombre}</h3>
                <p className="card-producto__desc">{producto.descripcion}</p>
                <div className="card-producto__footer">
                  <span className="card-precio">{producto.precio}</span>
                  <a
                    className="card-producto__btn"
                    href={`https://wa.me/573024798502?text=Hola Ferchy's! Me interesa pedir: ${producto.nombre}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Pedir
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
