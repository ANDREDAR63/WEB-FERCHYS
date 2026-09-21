import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/api';
import ProductPreview from '../catalogo/ProductPreview';
import './dashboard.css';

const statusLabels = { pending: 'Pendiente', preparing: 'En preparación', shipped: 'En camino', delivered: 'Entregado', cancelled: 'Cancelado' };

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString('es-CO', { dateStyle: 'medium' }) : 'Sin fecha';
}

export default function ClienteDashboard() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [openProductId, setOpenProductId] = useState(null);

  useEffect(() => {
    let active = true;
    apiRequest('/orders')
      .then((data) => { if (active) setOrders(data); })
      .catch((requestError) => { if (active) setError(requestError.message); });
    return () => { active = false; };
  }, []);

  return (
    <section className="dashboard-page client-dashboard">
      <div className="dashboard-shell">
        <div className="dashboard-heading">
          <div><h1>Mis compras</h1><p>Consulta tus pedidos y revisa su estado.</p></div>
        </div>
        {error && <p className="dashboard-error">{error}</p>}
        {orders.length === 0 && !error ? <div className="dashboard-panel dashboard-empty"><p>Aún no tienes pedidos.</p></div> : (
          <div className="client-orders">
            {orders.map((order) => (
              <article className="dashboard-panel client-order" key={order.id}>
                <div className="client-order__header">
                  <div><h2>Pedido #{order.id}</h2><p>Realizado el {formatDate(order.created_at)}</p></div>
                  <span className="status">{statusLabels[order.status] || order.status}</span>
                </div>
                <div className="client-order__body">
                  <div>
                    <h3>Productos</h3>
                    <ul className="client-order__items">
                      {order.items?.map((item) => <li key={item.id}><ProductPreview product={item.product} quantity={item.quantity} open={openProductId === item.id} onToggle={() => setOpenProductId((currentId) => currentId === item.id ? null : item.id)} /><strong>${Number(item.unit_price * item.quantity).toLocaleString()}</strong></li>)}
                    </ul>
                  </div>
                  <div className="client-order__details">
                    <p><strong>Total:</strong> ${Number(order.total).toLocaleString()}</p>
                    <p><strong>Entrega:</strong> {order.address?.full_address || 'Sin dirección'}</p>
                    <p><strong>Pago:</strong> {order.payments?.[0]?.paymentMethod?.name || 'Registrado'}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
