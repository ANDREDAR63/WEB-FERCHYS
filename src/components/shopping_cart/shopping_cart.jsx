import React, { useState } from 'react';
import './shopping_cart.css';

// 1. Lista fija de 10 productos disponibles para agregar
const PRODUCTOS_DISPONIBLES = [
  { id: 'p1', nombre: 'Suspiros', precio: 3000 },
  { id: 'p2', nombre: 'Profiteroles', precio: 5000 },
  { id: 'p3', nombre: 'Alfajores', precio: 7000 },
  { id: 'p4', nombre: 'Cheesecake de limón', precio: 7000 },
  { id: 'p5', nombre: 'Cheesecake de chocolate', precio: 7000 },
  { id: 'p6', nombre: 'Cheesecake de Árandano', precio: 7000 },
  { id: 'p7', nombre: 'Cheesecake de papayuela', precio: 7000 },
  { id: 'p8', nombre: 'Cheesecake de red velvet', precio: 7000 },
  { id: 'p9', nombre: 'Torta de arándanos', precio: 3000 },
  { id: 'p10', nombre: 'Torta de chocolate', precio: 5000 }
];

function Carrito() {
  // Estado para los productos cargados en el carrito
  const [items, setItems] = useState([
    { id: 'p1', nombre: 'Suspiros', precio: 3000, cantidad: 1 }
  ]);

  // Estado para el producto seleccionado en el desplegable
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState(PRODUCTOS_DISPONIBLES[0].id);

  // Estado para el formulario de Envío/Pago
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    direccion: '',
    metodoPago: 'tarjeta'
  });

  // --- LÓGICA PARA AGREGAR PRODUCTO DESDE LA LISTA ---
  const agregarProductoSeleccionado = (e) => {
    e.preventDefault();

    const productoBase = PRODUCTOS_DISPONIBLES.find(p => p.id === productoSeleccionadoId);
    if (!productoBase) return;

    const existe = items.find(item => item.id === productoBase.id);

    if (existe) {
      setItems(items.map(item =>
        item.id === productoBase.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setItems([...items, { ...productoBase, cantidad: 1 }]);
    }
  };

  // --- CONTROLES DE CANTIDAD Y ELIMINACIÓN ---
  const incrementar = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
    ));
  };

  const decrementar = (id) => {
    setItems(items.map(item => {
      if (item.id === id && item.cantidad > 1) {
        return { ...item, cantidad: item.cantidad - 1 };
      }
      return item;
    }));
  };

  const eliminarProducto = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Calcular precio total
  const totalPagar = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  // --- MANEJO DEL FORMULARIO DE ENVÍO ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si es el campo nombre, se filtran números y caracteres especiales en tiempo real
    if (name === 'nombre') {
      const soloLetras = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      setFormData({
        ...formData,
        [name]: soloLetras
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('El carrito está vacío. Agrega productos antes de confirmar.');
      return;
    }

    const numeroTelefono = "573001234567"; // Reemplazar por tu WhatsApp
    
    const listaProductos = items
      .map(i => `- ${i.nombre} (x${i.cantidad}): $${(i.precio * i.cantidad).toLocaleString()}`)
      .join('%0A');

    const mensaje = `*¡Nuevo Pedido!*%0A%0A` +
                    `*Productos:*%0A${listaProductos}%0A%0A` +
                    `*Total a Pagar:* $${totalPagar.toLocaleString()}%0A%0A` +
                    `*Cliente:* ${formData.nombre}%0A` +
                    `*Correo:* ${formData.email}%0A` +
                    `*Dirección:* ${formData.direccion}%0A` +
                    `*Pago:* ${formData.metodoPago}`;

    window.open(`https://wa.me/${numeroTelefono}?text=${mensaje}`, '_blank');
  };

  return (
    <div className="cart-container">
      <h2>🛒 Carrito de Compras</h2>

      {/* DESPLEGABLE CON LOS 10 PRODUCTOS CON PRECIO FIJO */}
      <div className="add-product-box">
        <h3>➕ Selecciona un producto para agregar:</h3>
        <form onSubmit={agregarProductoSeleccionado} className="add-product-form">
          <select 
            value={productoSeleccionadoId} 
            onChange={(e) => setProductoSeleccionadoId(e.target.value)}
            className="product-select"
          >
            {PRODUCTOS_DISPONIBLES.map(prod => (
              <option key={prod.id} value={prod.id}>
                {prod.nombre} - ${prod.precio.toLocaleString()}
              </option>
            ))}
          </select>
          <button type="submit" className="add-btn">Agregar al Carrito</button>
        </form>
      </div>

      <hr />

      {/* LISTA DE PRODUCTOS EN EL CARRITO */}
      <div className="cart-items">
        <h3>Productos en el Carrito:</h3>
        {items.length === 0 ? (
          <p className="empty-msg">Tu carrito está vacío.</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <h4>{item.nombre}</h4>
                <p>Precio c/u: ${item.precio.toLocaleString()}</p>
              </div>

              <div className="item-controls">
                <button type="button" onClick={() => decrementar(item.id)}>-</button>
                <span>{item.cantidad}</span>
                <button type="button" onClick={() => incrementar(item.id)}>+</button>
              </div>

              <div className="item-subtotal">
                <strong>${(item.precio * item.cantidad).toLocaleString()}</strong>
              </div>

              <button 
                type="button" 
                className="delete-btn" 
                onClick={() => eliminarProducto(item.id)}
              >
                🗑️
              </button>
            </div>
          ))
        )}

        <div className="cart-total">
          <h3>Total: ${totalPagar.toLocaleString()}</h3>
        </div>
      </div>

      <hr />

      {/* FORMULARIO DE ENVÍO */}
      <form onSubmit={handleSubmit} className="cart-form">
        <h3>Datos de Envío</h3>

        {/* NOMBRE (Sólo Letras) */}
        <div className="form-group">
          <label htmlFor="nombre">Nombre Completo:</label>
          <input 
            type="text" 
            id="nombre"
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            required 
            pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ ]+"
            title="Solo se permiten letras y espacios"
            placeholder="Ej. María Pérez"
          />
        </div>

        {/* CORREO (Validación con @ y Dominio) */}
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="ejemplo@correo.com"
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
            title="Ingresa un correo válido que incluya '@' y un dominio (ej: usuario@dominio.com)"
          />
        </div>

        {/* DIRECCIÓN */}
        <div className="form-group">
          <label htmlFor="direccion">Dirección de Entrega:</label>
          <input 
            type="text" 
            id="direccion"
            name="direccion" 
            value={formData.direccion} 
            onChange={handleChange} 
            required 
            placeholder="Calle 123 #45-67"
          />
        </div>

        {/* MÉTODO DE PAGO */}
        <div className="form-group">
          <label htmlFor="metodoPago">Método de Pago:</label>
          <select 
            id="metodoPago"
            name="metodoPago" 
            value={formData.metodoPago} 
            onChange={handleChange}
          >
            <option value="tarjeta">Tarjeta de Crédito / Débito</option>
            <option value="nequi">Nequi / Daviplata</option>
            <option value="efectivo">Efectivo contra entrega</option>
          </select>
        </div>

        <button type="submit" className="submit-btn" disabled={items.length === 0}>
          Finalizar Pedido (${totalPagar.toLocaleString()})
        </button>
      </form>
    </div>
  );
}

export default Carrito;