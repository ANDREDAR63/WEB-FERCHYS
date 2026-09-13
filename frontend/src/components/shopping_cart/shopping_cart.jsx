import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../services/api';
import { useAuth } from '../../context/auth';
import './shopping_cart.css';

function Carrito() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [orderCreated, setOrderCreated] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    Promise.all([apiRequest('/cart'), apiRequest('/products'), apiRequest('/payment-methods')])
      .then(([cart, productData, paymentMethodData]) => {
        setItems(cart.items || []);
        setProducts(productData);
        setProductId(String(productData[0]?.id || ''));
        setPaymentMethods(paymentMethodData);
        setPaymentMethodId(String(paymentMethodData[0]?.id || ''));
      })
      .catch((requestError) => setError(requestError.message));
  }, [user]);

  const refreshCart = () => apiRequest('/cart').then((cart) => {
    setItems(cart.items || []);
    window.dispatchEvent(new Event('ferchys-carrito-cambiado'));
  });

  const agregarProducto = (event) => {
    event.preventDefault();
    if (!productId) return;
    apiRequest('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ product_id: Number(productId), quantity: 1 }),
    }).then(refreshCart).catch((requestError) => setError(requestError.message));
  };

  const cambiarCantidad = (item, quantity) => {
    const request = quantity > 0
      ? apiRequest(`/cart/items/${item.id}`, { method: 'PUT', body: JSON.stringify({ quantity }) })
      : apiRequest(`/cart/items/${item.id}`, { method: 'DELETE' });
    request.then(refreshCart).catch((requestError) => setError(requestError.message));
  };

  const totalPagar = items.reduce((total, item) => total + Number(item.product?.price || 0) * item.quantity, 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSending(true);
    apiRequest('/addresses', {
      method: 'POST',
      body: JSON.stringify({ full_address: address.trim(), is_default: true }),
    })
      .then((createdAddress) => apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify({ address_id: createdAddress.id }),
      }))
      .then((order) => apiRequest(`/orders/${order.id}/payments`, {
        method: 'POST',
        body: JSON.stringify({ payment_method_id: Number(paymentMethodId) }),
      }).then(() => order))
      .then((order) => {
        setOrderCreated(order);
        setItems([]);
        setAddress('');
        window.dispatchEvent(new Event('ferchys-carrito-cambiado'));
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setSending(false));
  };

  if (!user) {
    return <div className="cart-container"><h2>Carrito de Compras</h2><p>Inicia sesión para consultar y guardar tu carrito.</p><button type="button" onClick={() => navigate('/login')}>Iniciar sesión</button></div>;
  }

  return (
    <div className="cart-container">
      <h2>Carrito de Compras</h2>
      {error && <p role="alert">{error}</p>}
      {orderCreated && <p role="status">Pedido #{orderCreated.id} creado correctamente.</p>}

      <div className="add-product-box">
        <h3>Selecciona un producto para agregar:</h3>
        <form onSubmit={agregarProducto} className="add-product-form">
          <select value={productId} onChange={(event) => setProductId(event.target.value)} className="product-select">
            {products.map((product) => <option key={product.id} value={product.id}>{product.name} - ${Number(product.price).toLocaleString()}</option>)}
          </select>
          <button type="submit" className="add-btn">Agregar al Carrito</button>
        </form>
      </div>

      <hr />
      <div className="cart-items">
        <h3>Productos en el Carrito:</h3>
        {items.length === 0 ? <p className="empty-msg">Tu carrito está vacío.</p> : items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-info"><h4>{item.product?.name}</h4><p>Precio c/u: ${Number(item.product?.price || 0).toLocaleString()}</p></div>
            <div className="item-controls"><button type="button" onClick={() => cambiarCantidad(item, item.quantity - 1)}>-</button><span>{item.quantity}</span><button type="button" onClick={() => cambiarCantidad(item, item.quantity + 1)}>+</button></div>
            <div className="item-subtotal"><strong>${(Number(item.product?.price || 0) * item.quantity).toLocaleString()}</strong></div>
            <button type="button" className="delete-btn" onClick={() => cambiarCantidad(item, 0)}>Eliminar</button>
          </div>
        ))}
        <div className="cart-total"><h3>Total: ${totalPagar.toLocaleString()}</h3></div>
      </div>

      <hr />
      <form onSubmit={handleSubmit} className="cart-form">
        <h3>Datos de Entrega</h3>
        <div className="form-group"><label htmlFor="nombre">Nombre Completo:</label><input id="nombre" value={user.name} readOnly /></div>
        <div className="form-group"><label htmlFor="email">Correo Electrónico:</label><input id="email" value={user.email} readOnly /></div>
        <div className="form-group"><label htmlFor="direccion">Dirección de Entrega:</label><input type="text" id="direccion" value={address} onChange={(event) => setAddress(event.target.value)} required placeholder="Calle 123 #45-67" /></div>
        <div className="form-group"><label htmlFor="metodo-pago">Método de Pago:</label><select id="metodo-pago" value={paymentMethodId} onChange={(event) => setPaymentMethodId(event.target.value)} required><option value="">Selecciona un método</option>{paymentMethods.map((method) => <option key={method.id} value={method.id}>{method.name}</option>)}</select></div>
        <button type="submit" className="submit-btn" disabled={items.length === 0 || sending || !paymentMethodId}>{sending ? 'Creando pedido...' : `Finalizar Pedido ($${totalPagar.toLocaleString()})`}</button>
      </form>
    </div>
  );
}

export default Carrito;
