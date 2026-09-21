import './catalogo.css';

const imagenes = import.meta.glob('../../assets/*', { eager: true });
const imagenesPorProducto = {
  Suspiros: 'favicon-rosa',
  Alfajores: 'favicon-rosa',
  'Cheesecake de limón': 'cheesecake_limon',
  'Cheesecake de maracuyá': 'cheesecake_maracuya',
  'Cheesecake de chocolate': 'cheesecake_chocolate',
  'Cheesecake de arándano': 'cheesecake_arandano',
  'Cheesecake de papayuela': 'cheesecake_papayuela',
  'Cheesecake de red velvet': 'cheesecake_redvelvet',
  'Refractaria familiar de cheesecake': 'cheesecakes-grandes',
};

function obtenerImagen(product) {
  if (product.image_url) return product.image_url;
  const nombreArchivo = imagenesPorProducto[product.name] || 'favicon-rosa';
  const ruta = Object.keys(imagenes).find((key) => key.includes(nombreArchivo));
  return ruta ? imagenes[ruta].default : '';
}

export default function ProductPreview({ product, quantity, open, onToggle }) {
  const name = product?.name || 'Producto';
  const price = Number(product?.price || 0);

  return (
    <span className={`product-preview ${open ? 'product-preview--open' : ''}`}>
      <button type="button" className="product-preview__trigger" onClick={onToggle} aria-expanded={open}>
        {name} x{quantity}
      </button>
      <span className="card-producto product-preview__card" role="dialog" aria-label={`Información de ${name}`}>
        <span className="card-producto__imagen product-preview__image-wrap"><img src={obtenerImagen(product)} alt={name} className="product-preview__image" /></span>
        <span className="card-cuerpo product-preview__content">
          <strong className="card-producto__nombre">{name}</strong>
          <span className="card-producto__desc">{product?.description || 'Sin descripción disponible.'}</span>
          <span className="product-preview__price">${price.toLocaleString()}</span>
        </span>
      </span>
    </span>
  );
}
