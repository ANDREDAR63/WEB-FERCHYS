import React, { useState } from 'react';
import './shopping_cart.css';

function Carrito() {
  // 1. Estado para los productos en el carrito (lista simulada)
  const [items, setItems] = useState([
    { id: 1, nombre: 'Producto Ejemplo A', precio: 25000, cantidad: 1 },
    { id: 2, nombre: 'Producto Ejemplo B', precio: 15000, cantidad: 2 }
  ]);

  // 2. Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    direccion: '',
    metodoPago: 'tarjeta'
  });

  // --- FUNCIONES DEL CARRITO ---

  // Sumar cantidad
  const incrementar = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
    ));
  };

  // Restar cantidad (mínimo 1)
  const decrementar = (id) => {
    setItems(items.map(item => {
      if (item.id === id && item.cantidad > 1) {
        return { ...item, cantidad: item.cantidad - 1 };
      }
      return item;
    }));
  };

  // Quitar producto del carrito
  const eliminarProducto = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Calcular el precio total
  const totalPagar = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  // Manejadores del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('El carrito está vacío. Agrega productos antes de confirmar.');
      return;
    }

    const numeroTelefono = "573001234567"; // Tu número de WhatsApp
    
    // Resumen de productos formateado
    const listaProductos = items
      .map(i => `- ${i.nombre} (x${i.cantidad}): $${(i.precio * i.cantidad).toLocaleString()}`)
      .join('%0A');

    const mensaje = `*¡Nuevo Pedido!*%0A%0A` +
                    `*Productos:*%0A${listaProductos}%0A%0A` +
                    `*Total a Pagar:* $${totalPagar.toLocaleString()}%0A%0A` +
                    `*Cliente:* ${formData.nombre}%0A` +
                    `*Dirección:* ${formData.direccion}%0A` +
                    `*Pago:* ${formData.metodoPago}`;

    window.open(`https://wa.me/${numeroTelefono}?text=${mensaje}`, '_blank');
  };

  return (
    <div className="cart-container">
      <h2>🛒 Carrito de Compras</h2>

      {/* SECCIÓN DE PRODUCTOS */}
      <div className="cart-items">
        {items.length === 0 ? (
          <p className="empty-msg">Tu carrito está vacío.</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <h4>{item.nombre}</h4>
                <p>Precio c/u: ${item.precio.toLocaleString()}</p>
              </div>

              {/* Botones Sumar/Restar */}
              <div className="item-controls">
                <button type="button" onClick={() => decrementar(item.id)}>-</button>
                <span>{item.cantidad}</span>
                <button type="button" onClick={() => incrementar(item.id)}>+</button>
              </div>

              <div className="item-subtotal">
                <strong>${(item.precio * item.cantidad).toLocaleString()}</strong>
              </div>

              {/* Botón Eliminar */}
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

        {/* TOTAL */}
        <div className="cart-total">
          <h3>Total: ${totalPagar.toLocaleString()}</h3>
        </div>
      </div>

      <hr />

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="cart-form">
        <h3>Datos de Envío</h3>
        <div className="form-group">
          <label>Nombre Completo:</label>
          <input 
            type="text" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Dirección:</label>
          <input 
            type="text" 
            name="direccion" 
            value={formData.direccion} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Método de Pago:</label>
          <select name="metodoPago" value={formData.metodoPago} onChange={handleChange}>
            <option value="tarjeta">Tarjeta</option>
            <option value="nequi">Nequi/Daviplata</option>
            <option value="efectivo">Efectivo</option>
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